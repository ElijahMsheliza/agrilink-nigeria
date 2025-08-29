import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/supabase';
import { buildSearchQuery, formatSearchResults } from '../../../../../lib/search-utils';

// GET: Advanced product search with filters
export async function GET(request: NextRequest) {
  try {
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const cropTypes = searchParams.get('crop_types')?.split(',') || [];
    const qualityGrades = searchParams.get('quality_grades')?.split(',') || [];
    const minPrice = searchParams.get('min_price');
    const maxPrice = searchParams.get('max_price');
    const stateId = searchParams.get('state_id');
    const lgaId = searchParams.get('lga_id');
    const radius = searchParams.get('radius');
    const buyerLat = searchParams.get('buyer_lat');
    const buyerLng = searchParams.get('buyer_lng');
    const availability = searchParams.get('availability');
    const certifications = searchParams.get('certifications')?.split(',') || [];
    const harvestDate = searchParams.get('harvest_date');
    const isOrganic = searchParams.get('is_organic');
    const sortBy = searchParams.get('sort_by') || 'date';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);

    const offset = (page - 1) * limit;

    // Build base query
    let supabaseQuery = supabase
      .from('products')
      .select(`
        *,
        farmer_profile:farmer_profiles!inner(
          id,
          user_id,
          farm_name,
          latitude,
          longitude,
          certifications,
          state:states(name),
          lga:lgas(name),
          user:profiles!inner(
            id,
            full_name,
            is_verified
          )
        )
      `)
      .eq('is_active', true)
      .gt('quantity_available', 0);

    // Apply text search
    if (query) {
      supabaseQuery = supabaseQuery.or(
        `title.ilike.%${query}%,crop_type.ilike.%${query}%,variety.ilike.%${query}%,description.ilike.%${query}%`
      );
    }

    // Apply crop type filter
    if (cropTypes.length > 0) {
      supabaseQuery = supabaseQuery.in('crop_type', cropTypes);
    }

    // Apply quality grade filter
    if (qualityGrades.length > 0) {
      supabaseQuery = supabaseQuery.in('quality_grade', qualityGrades);
    }

    // Apply price range filter
    if (minPrice) {
      supabaseQuery = supabaseQuery.gte('price_per_unit', parseFloat(minPrice));
    }
    if (maxPrice) {
      supabaseQuery = supabaseQuery.lte('price_per_unit', parseFloat(maxPrice));
    }

    // Apply location filter
    if (stateId) {
      supabaseQuery = supabaseQuery.eq('farmer_profile.state_id', parseInt(stateId));
    }
    if (lgaId) {
      supabaseQuery = supabaseQuery.eq('farmer_profile.lga_id', parseInt(lgaId));
    }

    // Apply organic filter
    if (isOrganic === 'true') {
      supabaseQuery = supabaseQuery.eq('is_organic', true);
    }

    // Apply availability filter
    if (availability) {
      const now = new Date().toISOString();
      switch (availability) {
        case 'now':
          supabaseQuery = supabaseQuery.lte('available_from', now);
          break;
        case 'week':
          const weekFromNow = new Date(now);
          weekFromNow.setDate(weekFromNow.getDate() + 7);
          supabaseQuery = supabaseQuery.lte('available_from', weekFromNow.toISOString());
          break;
        case 'month':
          const monthFromNow = new Date(now);
          monthFromNow.setMonth(monthFromNow.getMonth() + 1);
          supabaseQuery = supabaseQuery.lte('available_from', monthFromNow.toISOString());
          break;
      }
    }

    // Apply harvest date filter
    if (harvestDate) {
      const now = new Date();
      let daysAgo: number;
      
      switch (harvestDate) {
        case '30days':
          daysAgo = 30;
          break;
        case '3months':
          daysAgo = 90;
          break;
        case '6months':
          daysAgo = 180;
          break;
        default:
          daysAgo = 30;
      }
      
      const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      supabaseQuery = supabaseQuery.gte('harvest_date', cutoffDate.toISOString());
    }

    // Apply certification filter
    if (certifications.length > 0) {
      supabaseQuery = supabaseQuery.overlaps('farmer_profile.certifications', certifications);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price_asc':
        supabaseQuery = supabaseQuery.order('price_per_unit', { ascending: true });
        break;
      case 'price_desc':
        supabaseQuery = supabaseQuery.order('price_per_unit', { ascending: false });
        break;
      case 'distance':
        // Note: Distance sorting would require additional logic with coordinates
        supabaseQuery = supabaseQuery.order('created_at', { ascending: false });
        break;
      case 'rating':
        // Note: Rating sorting would require joining with reviews table
        supabaseQuery = supabaseQuery.order('created_at', { ascending: false });
        break;
      default:
        supabaseQuery = supabaseQuery.order('created_at', { ascending: false });
    }

    // Apply pagination
    supabaseQuery = supabaseQuery.range(offset, offset + limit - 1);

    // Execute query
    const { data: products, error, count } = await supabaseQuery;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      );
    }

    // Format results with distance calculation if buyer location provided
    const buyerLocation = buyerLat && buyerLng 
      ? { lat: parseFloat(buyerLat), lng: parseFloat(buyerLng) }
      : undefined;

    const formattedProducts = formatSearchResults(products || [], buyerLocation);

    // Apply radius filter after distance calculation
    let filteredProducts = formattedProducts;
    if (radius && buyerLocation) {
      const radiusKm = parseFloat(radius);
      filteredProducts = formattedProducts.filter(product => 
        product.distance && product.distance <= radiusKm
      );
    }

    return NextResponse.json({
      products: filteredProducts,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      },
      filters: {
        query,
        cropTypes,
        qualityGrades,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        stateId: stateId ? parseInt(stateId) : undefined,
        lgaId: lgaId ? parseInt(lgaId) : undefined,
        radius: radius ? parseFloat(radius) : undefined,
        availability,
        certifications,
        harvestDate,
        isOrganic: isOrganic === 'true',
        sortBy
      }
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

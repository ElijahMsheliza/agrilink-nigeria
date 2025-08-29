import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';
import { validateCompleteProduct } from '../../../../lib/validations/product';
import { generateImageFilename } from '../../../../lib/image-utils';

// GET: List farmer's products with filtering
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

    // Get farmer profile
    const { data: farmerProfile, error: profileError } = await supabase
      .from('farmer_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (profileError || !farmerProfile) {
      return NextResponse.json(
        { error: 'Farmer profile not found' },
        { status: 404 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const cropType = searchParams.get('crop_type') || '';
    const qualityGrade = searchParams.get('quality_grade') || '';
    const status = searchParams.get('status') || '';
    const minPrice = searchParams.get('min_price');
    const maxPrice = searchParams.get('max_price');
    const availableFrom = searchParams.get('available_from');
    const availableUntil = searchParams.get('available_until');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const sortBy = searchParams.get('sort_by') || 'created_at';
    const sortOrder = searchParams.get('sort_order') || 'desc';

    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from('products')
      .select(`
        *,
        farmer_profile:farmer_profiles!inner(*)
      `)
      .eq('farmer_profile.user_id', user.id);

    // Apply filters
    if (search) {
      query = query.or(`title.ilike.%${search}%,crop_type.ilike.%${search}%,variety.ilike.%${search}%`);
    }

    if (cropType) {
      query = query.eq('crop_type', cropType);
    }

    if (qualityGrade) {
      query = query.eq('quality_grade', qualityGrade);
    }

    if (minPrice) {
      query = query.gte('price_per_unit', parseFloat(minPrice));
    }

    if (maxPrice) {
      query = query.lte('price_per_unit', parseFloat(maxPrice));
    }

    if (availableFrom) {
      query = query.gte('available_from', availableFrom);
    }

    if (availableUntil) {
      query = query.lte('available_until', availableUntil);
    }

    // Apply status filter
    if (status) {
      const now = new Date().toISOString();
      switch (status) {
        case 'active':
          query = query.eq('is_active', true).gt('quantity_available', 0);
          break;
        case 'inactive':
          query = query.eq('is_active', false);
          break;
        case 'expired':
          query = query.lt('available_until', now);
          break;
        case 'pending':
          query = query.gt('available_from', now);
          break;
        case 'out_of_stock':
          query = query.eq('quantity_available', 0);
          break;
      }
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: products, error, count } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      products: products || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
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

// POST: Create new product listing
export async function POST(request: NextRequest) {
  try {
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get farmer profile
    const { data: farmerProfile, error: profileError } = await supabase
      .from('farmer_profiles')
      .select('id, state_id, lga_id')
      .eq('user_id', user.id)
      .single();

    if (profileError || !farmerProfile) {
      return NextResponse.json(
        { error: 'Farmer profile not found' },
        { status: 404 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate product data
    const validation = validateCompleteProduct(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid product data', details: validation.errors },
        { status: 400 }
      );
    }

    const productData = validation.data!;

    // Upload images to Supabase Storage
    const imageUrls: string[] = [];
    if (productData.images && productData.images.length > 0) {
      for (const image of productData.images) {
        try {
          const filename = generateImageFilename(image.file.name, 'product');
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(filename, image.file, {
              cacheControl: '3600',
              upsert: false
            });

          if (uploadError) {
            console.error('Image upload error:', uploadError);
            return NextResponse.json(
              { error: 'Failed to upload image' },
              { status: 500 }
            );
          }

          // Get public URL
          const { data: urlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(filename);

          imageUrls.push(urlData.publicUrl);
        } catch (error) {
          console.error('Image processing error:', error);
          return NextResponse.json(
            { error: 'Failed to process image' },
            { status: 500 }
          );
        }
      }
    }

    // Prepare product data for database
    const dbProductData = {
      farmer_profile_id: farmerProfile.id,
      title: productData.title,
      crop_type: productData.crop_type,
      variety: productData.variety,
      is_organic: productData.is_organic,
      quality_grade: productData.quality_grade,
      quantity_available: productData.quantity_available,
      unit: productData.unit,
      price_per_unit: productData.price_per_unit,
      minimum_order_quantity: productData.minimum_order_quantity || null,
      bulk_discount_percentage: productData.bulk_discount_percentage || null,
      harvest_date: productData.harvest_date || null,
      available_from: productData.available_from,
      available_until: productData.available_until,
      storage_method: productData.storage_method,
      description: productData.description || null,
      certifications: productData.certifications || [],
      images: imageUrls,
      is_active: true,
      state_id: farmerProfile.state_id,
      lga_id: farmerProfile.lga_id
    };

    // Insert product into database
    const { data: newProduct, error: insertError } = await supabase
      .from('products')
      .insert(dbProductData)
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      return NextResponse.json(
        { error: 'Failed to create product' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Product created successfully',
      product: newProduct
    }, { status: 201 });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

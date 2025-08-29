import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { calculateDistance } from '../../../../../lib/location-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const productId = params.id;

    // Get buyer's location for distance calculation
    let buyerLocation = null;
    const buyerProfile = await supabase
      .from('buyer_profiles')
      .select('location_lat, location_lng')
      .eq('user_id', user.id)
      .single();

    if (buyerProfile.data) {
      buyerLocation = {
        lat: buyerProfile.data.location_lat,
        lng: buyerProfile.data.location_lng
      };
    }

    // Fetch the main product with farmer details
    const { data: product, error: productError } = await supabase
      .from('products')
      .select(`
        *,
        farmer_profiles!inner (
          id,
          user_id,
          full_name,
          company_name,
          location_lat,
          location_lng,
          location_address,
          state_id,
          lga_id,
          is_verified,
          rating,
          products_count
        ),
        states!farmer_profiles_state_id_fkey (
          id,
          name
        ),
        lgas!farmer_profiles_lga_id_fkey (
          id,
          name
        )
      `)
      .eq('id', productId)
      .eq('status', 'active')
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Calculate distance if buyer location is available
    let distance = null;
    if (buyerLocation && product.farmer_profiles.location_lat && product.farmer_profiles.location_lng) {
      distance = calculateDistance(
        buyerLocation.lat,
        buyerLocation.lng,
        product.farmer_profiles.location_lat,
        product.farmer_profiles.location_lng
      );
    }

    // Format the product data
    const formattedProduct = {
      id: product.id,
      title: product.title,
      description: product.description,
      crop_type: product.crop_type,
      quality_grade: product.quality_grade,
      price_per_unit: product.price_per_unit,
      unit: product.unit,
      quantity_available: product.quantity_available,
      images: product.images || [],
      is_organic: product.is_organic,
      harvest_date: product.harvest_date,
      created_at: product.created_at,
      updated_at: product.updated_at,
      distance: distance,
      farmer_name: product.farmer_profiles.company_name || product.farmer_profiles.full_name,
      farmer_location: `${product.lgas?.name || ''}, ${product.states?.name || ''}`.trim(),
      farmer_verified: product.farmer_profiles.is_verified,
      farmer_rating: product.farmer_profiles.rating,
      farmer_products_count: product.farmer_profiles.products_count || 0
    };

    // Fetch related products (same crop type, different farmers, same state)
    const { data: relatedProducts, error: relatedError } = await supabase
      .from('products')
      .select(`
        *,
        farmer_profiles!inner (
          id,
          full_name,
          company_name,
          location_lat,
          location_lng,
          is_verified,
          rating,
          products_count
        ),
        states!farmer_profiles_state_id_fkey (
          name
        ),
        lgas!farmer_profiles_lga_id_fkey (
          name
        )
      `)
      .eq('crop_type', product.crop_type)
      .eq('status', 'active')
      .neq('id', productId)
      .neq('farmer_profiles.id', product.farmer_profiles.id)
      .limit(4);

    // Format related products
    const formattedRelatedProducts = (relatedProducts || []).map(relatedProduct => {
      let relatedDistance = null;
      if (buyerLocation && relatedProduct.farmer_profiles.location_lat && relatedProduct.farmer_profiles.location_lng) {
        relatedDistance = calculateDistance(
          buyerLocation.lat,
          buyerLocation.lng,
          relatedProduct.farmer_profiles.location_lat,
          relatedProduct.farmer_profiles.location_lng
        );
      }

      return {
        id: relatedProduct.id,
        title: relatedProduct.title,
        description: relatedProduct.description,
        crop_type: relatedProduct.crop_type,
        quality_grade: relatedProduct.quality_grade,
        price_per_unit: relatedProduct.price_per_unit,
        unit: relatedProduct.unit,
        quantity_available: relatedProduct.quantity_available,
        images: relatedProduct.images || [],
        is_organic: relatedProduct.is_organic,
        harvest_date: relatedProduct.harvest_date,
        created_at: relatedProduct.created_at,
        updated_at: relatedProduct.updated_at,
        distance: relatedDistance,
        farmer_name: relatedProduct.farmer_profiles.company_name || relatedProduct.farmer_profiles.full_name,
        farmer_location: `${relatedProduct.lgas?.name || ''}, ${relatedProduct.states?.name || ''}`.trim(),
        farmer_verified: relatedProduct.farmer_profiles.is_verified,
        farmer_rating: relatedProduct.farmer_profiles.rating,
        farmer_products_count: relatedProduct.farmer_profiles.products_count || 0
      };
    });

    return NextResponse.json({
      product: formattedProduct,
      relatedProducts: formattedRelatedProducts
    });

  } catch (error) {
    console.error('Error fetching product details:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

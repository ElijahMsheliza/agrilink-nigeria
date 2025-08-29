import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

// GET: List buyer's favorite products
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

    // Get buyer profile
    const { data: buyerProfile, error: profileError } = await supabase
      .from('buyer_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (profileError || !buyerProfile) {
      return NextResponse.json(
        { error: 'Buyer profile not found' },
        { status: 404 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const offset = (page - 1) * limit;

    // Get favorite products
    const { data: favorites, error, count } = await supabase
      .from('buyer_favorites')
      .select(`
        *,
        product:products(
          *,
          farmer_profile:farmer_profiles(
            id,
            user_id,
            farm_name,
            latitude,
            longitude,
            certifications,
            state:states(name),
            lga:lgas(name),
            user:profiles(
              id,
              full_name,
              is_verified
            )
          )
        )
      `)
      .eq('buyer_id', buyerProfile.id)
      .eq('product.is_active', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch favorites' },
        { status: 500 }
      );
    }

    // Format the response
    const formattedFavorites = favorites?.map(fav => ({
      id: fav.id,
      productId: fav.product_id,
      createdAt: fav.created_at,
      product: fav.product
    })) || [];

    return NextResponse.json({
      favorites: formattedFavorites,
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

// POST: Add product to favorites
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

    // Get buyer profile
    const { data: buyerProfile, error: profileError } = await supabase
      .from('buyer_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (profileError || !buyerProfile) {
      return NextResponse.json(
        { error: 'Buyer profile not found' },
        { status: 404 }
      );
    }

    // Parse request body
    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Check if product exists and is active
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id')
      .eq('id', productId)
      .eq('is_active', true)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { error: 'Product not found or inactive' },
        { status: 404 }
      );
    }

    // Check if already favorited
    const { data: existingFavorite, error: checkError } = await supabase
      .from('buyer_favorites')
      .select('id')
      .eq('buyer_id', buyerProfile.id)
      .eq('product_id', productId)
      .single();

    if (existingFavorite) {
      return NextResponse.json(
        { error: 'Product already in favorites' },
        { status: 409 }
      );
    }

    // Add to favorites
    const { data: newFavorite, error: insertError } = await supabase
      .from('buyer_favorites')
      .insert({
        buyer_id: buyerProfile.id,
        product_id: productId
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database error:', insertError);
      return NextResponse.json(
        { error: 'Failed to add to favorites' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Product added to favorites',
      favorite: newFavorite
    }, { status: 201 });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE: Remove product from favorites
export async function DELETE(request: NextRequest) {
  try {
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get buyer profile
    const { data: buyerProfile, error: profileError } = await supabase
      .from('buyer_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (profileError || !buyerProfile) {
      return NextResponse.json(
        { error: 'Buyer profile not found' },
        { status: 404 }
      );
    }

    // Parse request body
    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Remove from favorites
    const { error: deleteError } = await supabase
      .from('buyer_favorites')
      .delete()
      .eq('buyer_id', buyerProfile.id)
      .eq('product_id', productId);

    if (deleteError) {
      console.error('Database error:', deleteError);
      return NextResponse.json(
        { error: 'Failed to remove from favorites' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Product removed from favorites'
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

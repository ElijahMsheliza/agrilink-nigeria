import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/supabase';
import { validateCompleteProduct } from '../../../../../lib/validations/product';
import { generateImageFilename } from '../../../../../lib/image-utils';

// GET: Get single product details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Get product with farmer profile check
    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        farmer_profile:farmer_profiles!inner(*)
      `)
      .eq('id', params.id)
      .eq('farmer_profile.user_id', user.id)
      .single();

    if (error || !product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ product });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT: Update product information
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Verify product ownership
    const { data: existingProduct, error: fetchError } = await supabase
      .from('products')
      .select('id, images')
      .eq('id', params.id)
      .eq('farmer_profile_id', farmerProfile.id)
      .single();

    if (fetchError || !existingProduct) {
      return NextResponse.json(
        { error: 'Product not found or access denied' },
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

    // Handle image updates
    let imageUrls = existingProduct.images || [];
    
    // If new images are provided, upload them
    if (productData.images && productData.images.length > 0) {
      const newImageUrls: string[] = [];
      
      for (const image of productData.images) {
        // If it's a new file (has file property), upload it
        if (image.file) {
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

            newImageUrls.push(urlData.publicUrl);
          } catch (error) {
            console.error('Image processing error:', error);
            return NextResponse.json(
              { error: 'Failed to process image' },
              { status: 500 }
            );
          }
        } else if (image.preview && image.preview.startsWith('http')) {
          // If it's an existing image URL, keep it
          newImageUrls.push(image.preview);
        }
      }
      
      imageUrls = newImageUrls;
    }

    // Prepare update data
    const updateData = {
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
      updated_at: new Date().toISOString()
    };

    // Update product
    const { data: updatedProduct, error: updateError } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single();

    if (updateError) {
      console.error('Database update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update product' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE: Remove product listing
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Get product to check ownership and get image URLs
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('id, images')
      .eq('id', params.id)
      .eq('farmer_profile_id', farmerProfile.id)
      .single();

    if (fetchError || !product) {
      return NextResponse.json(
        { error: 'Product not found or access denied' },
        { status: 404 }
      );
    }

    // Delete images from storage if they exist
    if (product.images && product.images.length > 0) {
      for (const imageUrl of product.images) {
        try {
          // Extract filename from URL
          const urlParts = imageUrl.split('/');
          const filename = urlParts[urlParts.length - 1];
          
          if (filename) {
            await supabase.storage
              .from('product-images')
              .remove([filename]);
          }
        } catch (error) {
          console.error('Error deleting image from storage:', error);
          // Continue with product deletion even if image deletion fails
        }
      }
    }

    // Delete product from database
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', params.id);

    if (deleteError) {
      console.error('Database delete error:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete product' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

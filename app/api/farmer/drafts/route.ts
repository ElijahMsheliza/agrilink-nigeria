import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { draftProductSchema } from '@/lib/validations/product';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate draft data
    const validation = draftProductSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ 
        error: 'Invalid draft data', 
        details: validation.error.errors 
      }, { status: 400 });
    }

    const draftData = validation.data;

    // Insert draft into database
    const { data: draft, error: insertError } = await supabase
      .from('product_drafts')
      .insert({
        farmer_id: user.id,
        title: draftData.title,
        crop_type: draftData.cropType,
        variety: draftData.variety,
        is_organic: draftData.isOrganic,
        quality_grade: draftData.qualityGrade,
        quantity_available: draftData.quantityAvailable,
        unit: draftData.unit,
        price_per_unit: draftData.pricePerUnit,
        minimum_order_quantity: draftData.minimumOrderQuantity,
        harvest_date: draftData.harvestDate,
        available_from: draftData.availableFrom,
        available_until: draftData.availableUntil,
        storage_method: draftData.storageMethod,
        description: draftData.description,
        location: draftData.location,
        certifications: draftData.certifications,
        images: draftData.images,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      console.error('Draft insert error:', insertError);
      return NextResponse.json({ error: 'Failed to save draft' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      draft: draft 
    });

  } catch (error) {
    console.error('Draft save error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const draftId = searchParams.get('id');

    if (draftId) {
      // Get specific draft
      const { data: draft, error: fetchError } = await supabase
        .from('product_drafts')
        .select('*')
        .eq('id', draftId)
        .eq('farmer_id', user.id)
        .single();

      if (fetchError) {
        return NextResponse.json({ error: 'Draft not found' }, { status: 404 });
      }

      return NextResponse.json({ draft });
    } else {
      // Get all drafts for the farmer
      const { data: drafts, error: fetchError } = await supabase
        .from('product_drafts')
        .select('*')
        .eq('farmer_id', user.id)
        .order('updated_at', { ascending: false });

      if (fetchError) {
        console.error('Drafts fetch error:', fetchError);
        return NextResponse.json({ error: 'Failed to fetch drafts' }, { status: 500 });
      }

      return NextResponse.json({ drafts });
    }

  } catch (error) {
    console.error('Draft fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...draftData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Draft ID is required' }, { status: 400 });
    }

    // Validate draft data
    const validation = draftProductSchema.safeParse(draftData);
    if (!validation.success) {
      return NextResponse.json({ 
        error: 'Invalid draft data', 
        details: validation.error.errors 
      }, { status: 400 });
    }

    // Update draft
    const { data: draft, error: updateError } = await supabase
      .from('product_drafts')
      .update({
        ...validation.data,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('farmer_id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Draft update error:', updateError);
      return NextResponse.json({ error: 'Failed to update draft' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      draft: draft 
    });

  } catch (error) {
    console.error('Draft update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const draftId = searchParams.get('id');

    if (!draftId) {
      return NextResponse.json({ error: 'Draft ID is required' }, { status: 400 });
    }

    // Delete draft
    const { error: deleteError } = await supabase
      .from('product_drafts')
      .delete()
      .eq('id', draftId)
      .eq('farmer_id', user.id);

    if (deleteError) {
      console.error('Draft delete error:', deleteError);
      return NextResponse.json({ error: 'Failed to delete draft' }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Draft delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

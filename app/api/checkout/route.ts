import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { formData, cartItems } = body;

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'Your cart is empty' }, { status: 400 });
    }

    let calculatedTotal = 0;
    const verifiedItems = [];

    // SECURITY CHECK: Verify products, prices, and stock server-side
    for (const item of cartItems) {
      const { data: dbProduct, error: prodError } = await supabase
        .from('products')
        .select('id, price, stock, name, is_active')
        .eq('id', item.id)
        .single();

      if (prodError || !dbProduct || !dbProduct.is_active) {
        return NextResponse.json({ error: `Product ${item.name} is no longer available.` }, { status: 400 });
      }

      if (dbProduct.stock < item.quantity) {
        return NextResponse.json({ error: `Not enough stock for ${dbProduct.name}. Only ${dbProduct.stock} left.` }, { status: 400 });
      }

      // Use database price, never browser price!
      const itemTotal = dbProduct.price * item.quantity;
      calculatedTotal += itemTotal;

      verifiedItems.push({
        product_id: dbProduct.id,
        quantity: item.quantity,
        price: dbProduct.price,
        newStock: dbProduct.stock - item.quantity,
      });
    }

    // 1. Create the Order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        full_name: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        postal_code: formData.postalCode || '',
        order_notes: formData.orderNotes || '',
        total_amount: calculatedTotal,
        status: 'pending',
        payment_method: 'COD',
      })
      .select()
      .single();

    if (orderError || !orderData) {
      return NextResponse.json({ error: 'Failed to create order. Please try again.' }, { status: 500 });
    }

    const orderId = orderData.id;

    // 2. Create Order Items & Reduce Inventory
    for (const item of verifiedItems) {
      // Insert order item
      await supabase.from('order_items').insert({
        order_id: orderId,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      });

      // Safely reduce inventory stock
      await supabase
        .from('products')
        .update({ stock: item.newStock })
        .eq('id', item.product_id);
    }

    return NextResponse.json({ success: true, orderId });
  } catch (err) {
    console.error('Checkout error:', err);
    return NextResponse.json({ error: 'An unexpected server error occurred.' }, { status: 500 });
  }
}
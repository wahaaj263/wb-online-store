"use client";

import { useCart } from '../context/CartContext';
import Link from 'next/link';

export default function CartPage() {
  const { cart, removeFromCart, clearCart, subtotal } = useCart();

  if (cart.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-100 max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link href="/" className="bg-brand hover:bg-brand-dark text-white font-medium py-3 px-8 rounded-lg transition-colors">
            Start Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center space-x-4">
                <img src={item.image_url} alt={item.name} className="w-20 h-20 object-cover rounded-md border" />
                <div>
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  <p className="text-brand font-bold mt-1">Rs. {item.price}</p>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <span className="text-sm font-medium text-gray-600">Qty: {item.quantity}</span>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <button 
            onClick={clearCart}
            className="text-sm text-gray-500 hover:text-gray-800 underline mt-4"
          >
            Clear Shopping Cart
          </button>
        </div>

        {/* Order Summary Box */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-fit">
          <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Order Summary</h2>
          
          <div className="flex justify-between mb-2 text-gray-600">
            <span>Subtotal</span>
            <span>Rs. {subtotal}</span>
          </div>
          <div className="flex justify-between mb-4 text-gray-600">
            <span>Shipping (Cash on Delivery)</span>
            <span className="text-brand font-medium">Free / Calculated at Checkout</span>
          </div>

          <div className="border-t pt-4 mb-6 flex justify-between font-bold text-xl text-gray-900">
            <span>Total</span>
            <span className="text-brand">Rs. {subtotal}</span>
          </div>

          <Link 
            href="/checkout"
            className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-3 px-4 rounded-lg text-center block shadow transition-colors"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </main>
  );
}
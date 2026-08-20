"use client";

import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cart, subtotal, clearCart } = useCart();
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    orderNotes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData, cartItems: cart }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      // Clear cart and redirect to success page
      clearCart();
      router.push(`/order-success?orderId=${data.orderId}`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-100 max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">Add items to your cart before proceeding to checkout.</p>
          <Link href="/" className="bg-brand hover:bg-brand-dark text-white font-medium py-3 px-8 rounded-lg transition-colors">
            Return to Store
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Checkout (Cash on Delivery)</h1>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Customer Information Form */}
        <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-xl font-bold text-gray-900 border-b pb-3">Shipping Details</h2>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Wahaaj Baig"
                className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-brand focus:border-brand"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="03001234567"
                className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-brand focus:border-brand"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-brand focus:border-brand"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
            <input
              type="text"
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              placeholder="House #123, Street #4, Area/Society"
              className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-brand focus:border-brand"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                placeholder="Faisalabad / Lahore / Karachi"
                className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-brand focus:border-brand"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code (Optional)</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="38000"
                className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-brand focus:border-brand"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Order Notes (Optional)</label>
            <textarea
              name="orderNotes"
              rows={3}
              value={formData.orderNotes}
              onChange={handleChange}
              placeholder="Special instructions for delivery..."
              className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-brand focus:border-brand"
            />
          </div>
        </div>

        {/* Order Review Sidebar */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-fit space-y-4">
          <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Your Order</h2>

          <div className="space-y-3 max-h-60 overflow-y-auto">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <span className="text-gray-600 truncate max-w-[180px]">{item.name} x {item.quantity}</span>
                <span className="font-medium text-gray-900">Rs. {item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>Rs. {subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Method</span>
              <span className="font-semibold text-gray-800">Cash on Delivery (COD)</span>
            </div>
          </div>

          <div className="border-t pt-4 flex justify-between font-bold text-xl text-gray-900">
            <span>Total</span>
            <span className="text-brand">Rs. {subtotal}</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-3 px-4 rounded-lg text-center shadow transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing Order...' : 'Place Order (COD)'}
          </button>
        </div>
      </form>
    </main>
  );
}
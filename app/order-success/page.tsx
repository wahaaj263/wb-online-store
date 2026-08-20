"use client";

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <main className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="bg-white p-10 rounded-lg shadow-sm border border-gray-100 space-y-6">
        <div className="w-16 h-16 bg-brand-light text-brand rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
          ✓
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900">Order Placed Successfully!</h1>
        <p className="text-gray-600">
          Thank you for shopping with <span className="font-semibold text-brand">W.B Online Store</span>. Your order has been placed via Cash on Delivery.
        </p>

        {orderId && (
          <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-700">
            <span className="font-medium">Order Reference ID:</span> <span className="font-mono text-brand">{orderId}</span>
          </div>
        )}

        <div className="pt-4 flex justify-center space-x-4">
          <Link href="/" className="bg-brand hover:bg-brand-dark text-white font-medium py-3 px-6 rounded-lg transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="text-center py-24">Loading order details...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
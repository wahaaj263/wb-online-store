"use client";

import Link from 'next/link';
import { useCart } from '../context/CartContext';

export default function Header() {
  const { totalItems } = useCart();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-brand">
              W.B Store
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8 hidden md:block">
            <div className="relative flex">
              <input 
                type="text" 
                placeholder="Search in W.B Online Store..." 
                className="w-full bg-gray-100 border-none rounded-l-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-brand-light"
              />
              <button className="bg-brand hover:bg-brand-dark text-white px-6 rounded-r-md transition-colors font-medium">
                Search
              </button>
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-6">
            <Link href="/login" className="text-gray-600 hover:text-brand font-medium text-sm">
              Login / Sign Up
            </Link>
            <Link href="/cart" className="text-gray-600 hover:text-brand font-medium text-sm flex items-center bg-brand-light px-3 py-1.5 rounded-md">
              🛒 Cart <span className="ml-1.5 bg-brand text-white text-xs px-2 py-0.5 rounded-full font-bold">{totalItems}</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
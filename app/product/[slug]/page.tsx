"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: number;
  stock: number;
  category: string;
  image_url: string;
};

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!slug) return;
    async function fetchProduct() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();

      if (!error && data) {
        setProduct(data);
      }
      setLoading(false);
    }
    fetchProduct();
  }, [slug]);

  if (loading) {
    return <div className="text-center py-24 text-gray-500">Loading product details...</div>;
  }

  if (!product) {
    return (
      <div className="text-center py-24">
        <h2 className="text-2xl font-bold text-gray-800">Product not found</h2>
        <Link href="/" className="text-brand mt-4 inline-block hover:underline">Return to Home</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000); // Reset success feedback after 2 seconds
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">{product.category}</span>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        <div className="rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center">
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="w-full h-96 object-cover"
          />
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-brand font-semibold bg-brand-light px-2 py-1 rounded">
              {product.category}
            </span>
            <h1 className="text-3xl font-extrabold text-gray-900 mt-3 mb-2">
              {product.name}
            </h1>
            
            <div className="text-3xl font-bold text-brand my-4">
              Rs. {product.price}
            </div>

            <p className="text-gray-600 text-base leading-relaxed mb-6">
              {product.description || product.short_description || "No description available for this item."}
            </p>

            <div className="mb-6 flex items-center space-x-2">
              <span className={`h-3 w-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className="text-sm text-gray-700 font-medium">
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </span>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-gray-100">
            <button 
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-3 px-6 rounded-lg shadow transition-colors text-base disabled:opacity-50"
            >
              {added ? '✓ Added to Cart!' : 'Add to Cart'}
            </button>
            <p className="text-xs text-gray-500 text-center">
              📦 Cash on Delivery available across Pakistan
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
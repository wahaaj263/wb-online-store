"use client";

import Link from 'next/link';
import { useCart } from '../context/CartContext';

type ProductProps = {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    image_url: string;
    category: string;
  };
};

export default function ProductCard({ product }: ProductProps) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
      <Link href={`/product/${product.slug}`} className="flex-grow">
        <img 
          src={product.image_url} 
          alt={product.name} 
          className="w-full h-48 object-cover" 
        />
        <div className="p-4">
          <p className="text-xs text-gray-500 mb-1">{product.category}</p>
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[40px]">
            {product.name}
          </h3>
          <div className="mt-2 flex items-center">
            <span className="text-lg font-bold text-brand">Rs. {product.price}</span>
          </div>
        </div>
      </Link>
      
      <div className="px-4 pb-4 mt-auto">
        <button 
          onClick={() => addToCart(product)}
          className="w-full bg-brand-light text-brand-dark hover:bg-brand hover:text-white font-medium py-2 rounded transition-colors text-sm"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
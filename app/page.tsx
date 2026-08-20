import { supabase } from '../lib/supabase';
import ProductCard from './components/ProductCard';

// This tells Next.js to always fetch fresh data from the database
export const revalidate = 0; 

export default async function Home() {
  // 1. Fetch products from the Supabase database
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true); // Only show active products

  return (
    <main className="flex min-h-screen flex-col items-center">
      
      {/* Hero Banner Section */}
      <section className="w-full bg-brand-light py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
            Discover Quality Products at <br className="hidden md:block" />
            <span className="text-brand">W.B Online Store</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Pakistan's premier marketplace for fashion, electronics, and daily essentials. 
            Experience seamless shopping with Cash on Delivery.
          </p>
          <button className="bg-brand hover:bg-brand-dark text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all text-lg">
            Shop Now
          </button>
        </div>
      </section>

      {/* Dynamic Product Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Featured Products</h2>
        
        {/* If there's an error connecting, show a message */}
        {error ? (
          <div className="text-red-500 bg-red-50 p-4 rounded-md">
            Failed to load products. Please check your database connection.
          </div>
        ) : (
          /* Grid Layout: 2 items on mobile, up to 5 items on large screens (like Daraz) */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

    </main>
  );
}
"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';

type Order = {
  id: string;
  full_name: string;
  phone: string;
  email: string; // <-- Added this missing property
  address: string;
  city: string;
  total_amount: number;
  status: string;
  payment_method: string;
  created_at: string;
};

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  is_active: boolean;
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');

  // Fetch data from Supabase on load
  useEffect(() => {
    async function fetchAdminData() {
      setLoading(true);
      
      // Fetch orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch products
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .order('name', { ascending: true });

      if (ordersData) setOrders(ordersData);
      if (productsData) setProducts(productsData);
      setLoading(false);
    }

    fetchAdminData();
  }, []);

  // Function to update order status
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (!error) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } else {
      alert('Failed to update order status');
    }
  };

  // Calculate stats
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);
  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;
  const lowStockCount = products.filter(p => p.stock < 10).length;

  if (loading) {
    return <div className="text-center py-24 text-gray-500 font-medium">Loading Admin Dashboard...</div>;
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b pb-4 gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-brand font-semibold bg-brand-light px-2 py-1 rounded">
            Administrator Portal
          </span>
          <h1 className="text-3xl font-extrabold text-gray-900 mt-1">W.B Store Management</h1>
        </div>
        <Link href="/" className="text-sm font-medium text-brand hover:underline">
          ← Back to Live Store
        </Link>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Total Revenue</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">Rs. {totalRevenue.toLocaleString()}</h3>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Total Orders</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{orders.length}</h3>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Pending Orders</p>
          <h3 className="text-2xl font-bold text-amber-600 mt-1">{pendingOrdersCount}</h3>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Low Stock Items</p>
          <h3 className="text-2xl font-bold text-red-600 mt-1">{lowStockCount}</h3>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex space-x-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'orders' ? 'border-brand text-brand' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Customer Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'products' ? 'border-brand text-brand' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Inventory & Products ({products.length})
        </button>
      </div>

      {/* TAB 1: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-lg font-bold text-gray-900">Recent Customer Orders</h2>
          </div>
          {orders.length === 0 ? (
            <p className="p-6 text-gray-500 text-center">No orders placed yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider border-b">
                    <th className="p-4">Order ID / Date</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Shipping Address</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="p-4 font-mono text-xs text-gray-500">
                        <span className="font-bold text-gray-800">{order.id.slice(0, 8)}...</span>
                        <div className="text-[10px] text-gray-400">{new Date(order.created_at).toLocaleString()}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-gray-900">{order.full_name}</div>
                        <div className="text-xs text-gray-500">{order.phone}</div>
                        <div className="text-xs text-gray-500">{order.email}</div>
                      </td>
                      <td className="p-4 text-gray-600 max-w-xs">
                        {order.address}, {order.city}
                      </td>
                      <td className="p-4 font-bold text-brand">
                        Rs. {order.total_amount}
                      </td>
                      <td className="p-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 text-xs font-medium bg-white focus:ring-brand focus:border-brand"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PRODUCTS / INVENTORY MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Store Inventory</h2>
          </div>
          {products.length === 0 ? (
            <p className="p-6 text-gray-500 text-center">No products found in database.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider border-b">
                    <th className="p-4">Product Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock Level</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-900">{product.name}</td>
                      <td className="p-4 text-gray-600">{product.category}</td>
                      <td className="p-4 font-bold text-brand">Rs. {product.price}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${product.stock > 10 ? 'bg-green-100 text-green-800' : product.stock > 0 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>
                          {product.stock} units
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`text-xs font-semibold ${product.is_active ? 'text-green-600' : 'text-gray-400'}`}>
                          {product.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </main>
  );
}
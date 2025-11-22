"use client";

import Image from "next/image";
import { useEffect, useState } from 'react';
import { getProducts } from '../components/productsApi';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url?: string;
  created_at: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts();
        setProducts(data as Product[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  function showToast(message: string, type: 'success' | 'error' = 'success') {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  }

  function handleAddToCart(product: Product) {
    const existing = cart.find(item => item.product.id === product.id);
    if (existing) {
      showToast(`${product.title} is already in cart!`, 'error');
      return;
    }
    const newCart = [...cart, { product, quantity: 1 }];
    setCart(newCart);
    showToast(`${product.title} added to cart!`);
  }

  function handleRemoveFromCart(productId: string) {
    const item = cart.find(item => item.product.id === productId);
    if (item) {
      showToast(`${item.product.title} removed from cart!`, 'error');
    }
    const newCart = cart.filter(item => item.product.id !== productId);
    setCart(newCart);
  }

  function handleUpdateQuantity(productId: string, quantity: number) {
    const newCart = cart.map(item =>
      item.product.id === productId ? { ...item, quantity } : item
    );
    setCart(newCart);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 font-sans dark:bg-black">
      {/* Amazon-style header */}
      <header className="w-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 shadow-md py-3 px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src="/logo.svg" alt="Logo" width={40} height={40} />
          <span className="text-3xl font-bold text-gray-900 tracking-wide">E-Shop</span>
        </div>
        <div className="flex items-center gap-4 w-1/2">
          <input type="text" placeholder="Search products, brands and more..." className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-yellow-500" />
          <button 
            onClick={() => setCartOpen(!cartOpen)}
            className="bg-yellow-500 text-white px-4 py-2 rounded flex items-center gap-2 font-bold shadow hover:bg-yellow-600 relative"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 6h15l-1.5 9h-13z"/><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/></svg>
            Cart
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
        <div className="flex items-center gap-6">
          <a href="/" className="text-gray-900 font-medium hover:underline">Home</a>
          <a href="/about" className="text-gray-900 font-medium hover:underline">About</a>
          <a href="/contact" className="text-gray-900 font-medium hover:underline">Contact</a>
        </div>
      </header>
      {/* Category bar */}
      <nav className="w-full bg-white shadow flex gap-8 px-8 py-2 text-sm font-semibold text-gray-700 overflow-x-auto">
        <span className="hover:text-yellow-600 cursor-pointer">Electronics</span>
        <span className="hover:text-yellow-600 cursor-pointer">Fashion</span>
        <span className="hover:text-yellow-600 cursor-pointer">Home</span>
        <span className="hover:text-yellow-600 cursor-pointer">Beauty</span>
        <span className="hover:text-yellow-600 cursor-pointer">Sports</span>
        <span className="hover:text-yellow-600 cursor-pointer">Toys</span>
        <span className="hover:text-yellow-600 cursor-pointer">Grocery</span>
        <span className="hover:text-yellow-600 cursor-pointer">Mobiles</span>
      </nav>
      <main className="flex flex-col items-center py-8 px-2 sm:py-16 sm:px-4">
        <div className="w-full max-w-7xl">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mb-8 text-center">Featured Products</h1>
          {loading ? (
            <p className="text-center">Loading products...</p>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : products.length === 0 ? (
            <p className="text-center">No products found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {products.map(product => (
                <div key={product.id} className="border rounded-xl p-4 bg-white flex flex-col shadow hover:shadow-2xl transition-all duration-200 group">
                  <div className="flex-1 flex flex-col items-center justify-center">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.title} className="w-40 h-40 object-cover rounded mb-4 group-hover:scale-105 transition-transform duration-200" />
                    ) : (
                      <div className="w-40 h-40 bg-gray-200 flex items-center justify-center rounded mb-4 text-gray-400">No Image</div>
                    )}
                    <div className="font-semibold text-lg text-gray-900 mb-2 text-center group-hover:text-yellow-600">{product.title}</div>
                    <div className="text-gray-700 mb-2 text-center line-clamp-2">{product.description}</div>
                  </div>
                  <div className="font-bold text-xl text-green-700 mb-2 text-center">₹{product.price}</div>
                  {cart.find(item => item.product.id === product.id) ? (
                    <button 
                      className="bg-green-500 text-white px-4 py-2 rounded-lg w-full font-bold mt-2 shadow-lg flex items-center justify-center gap-2 cursor-default" 
                      disabled
                    >
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Added to Cart
                    </button>
                  ) : (
                    <button 
                      className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-4 py-2 rounded-lg hover:from-yellow-600 hover:to-yellow-700 w-full font-bold mt-2 shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2" 
                      onClick={() => handleAddToCart(product)}
                    >
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M6 6h15l-1.5 9h-13z"/>
                        <circle cx="9" cy="21" r="1"/>
                        <circle cx="20" cy="21" r="1"/>
                      </svg>
                      Add to Cart
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
          {/* Cart Section */}
          {cartOpen && (
            <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-xl border">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b">
                    <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
                    <button 
                      onClick={() => setCartOpen(false)}
                      className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                      ×
                    </button>
                  </div>
                  {cart.length === 0 ? (
                    <div className="text-center py-8">
                      <svg className="mx-auto w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 9M7 13l-1.5-9M7 13h10m0 0v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6z" />
                      </svg>
                      <p className="text-gray-500 text-lg">Your cart is empty</p>
                      <p className="text-gray-400 text-sm mt-2">Add some products to get started!</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4 mb-6">
                        {cart.map(item => (
                          <div key={item.product.id} className="flex items-center gap-4 p-4 border-b last:border-b-0 hover:bg-gray-50">
                            {item.product.image_url ? (
                              <img src={item.product.image_url} alt={item.product.title} className="w-16 h-16 object-cover rounded" />
                            ) : (
                              <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded text-gray-400 text-xs">No Image</div>
                            )}
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">{item.product.title}</h3>
                              <p className="text-green-600 font-bold">₹{item.product.price}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center border rounded">
                                <button 
                                  onClick={() => handleUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                                  className="px-3 py-1 hover:bg-gray-100"
                                >
                                  -
                                </button>
                                <span className="px-3 py-1 border-x">{item.quantity}</span>
                                <button 
                                  onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                                  className="px-3 py-1 hover:bg-gray-100"
                                >
                                  +
                                </button>
                                
                              </div>
                              <button 
                                onClick={() => handleRemoveFromCart(item.product.id)} 
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="border-t pt-4 bg-gray-50 -mx-6 -mb-6 px-6 pb-6 mt-4">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-lg font-semibold">Total Items:</span>
                          <span className="text-lg font-bold">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-6">
                          <span className="text-xl font-bold">Total Amount:</span>
                          <span className="text-xl font-bold text-green-600">₹{cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toFixed(2)}</span>
                        </div>
                        <button className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 transition-colors">
                          Proceed to Checkout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <div 
            key={toast.id}
            className={`px-4 py-3 rounded-lg shadow-lg text-white font-medium transform transition-all duration-300 ${
              toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } animate-slide-in`}
          >
            <div className="flex items-center gap-2">
              {toast.type === 'success' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              {toast.message}
            </div>
          </div>
        ))}
      </div>

      <footer className="w-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 py-6 mt-12 shadow-inner text-center text-gray-900 font-semibold">
        &copy; {new Date().getFullYear()} E-Shop. All rights reserved.
      </footer>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

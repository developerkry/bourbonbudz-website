'use client';

import { useState, useEffect } from 'react';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { fetchShopifyProducts, shopCategories } from '../utils/shopify-fallback';
import { useCart } from '../context/CartContext';

interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  images: Array<{
    src: string;
    altText?: string;
  }>;
  variants: Array<{
    id: string;
    title: string;
    price: string;
    available: boolean;
  }>;
  handle: string;
  productType: string;
  tags: string[];
  vendor: string;
  availableForSale: boolean;
  collections: string[]; // Added collections array
}

export default function Shop() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const fetchedProducts = await fetchShopifyProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const categories = ['All', ...shopCategories.map(cat => cat.name)];
  
  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => {
        // Filter by collection handle (collections are stored as handles/slugs)
        const categoryHandle = selectedCategory.toLowerCase();
        return product.collections.includes(categoryHandle);
      });

  // Get featured products (products in 'featured' collection)
  const featuredProducts = products.filter(product => 
    product.collections.includes('featured')
  );

  // Get non-featured products for regular grid
  const regularProducts = filteredProducts.filter(product => 
    !product.collections.includes('featured')
  );

  const handleAddToCart = (product: ShopifyProduct, variantId?: string) => {
    const variant = variantId 
      ? product.variants.find(v => v.id === variantId)
      : product.variants.find(v => v.available) || product.variants[0];
      
    if (!variant) return;

    addToCart({
      variantId: variant.id,
      productId: product.id,
      title: product.title,
      price: parseFloat(variant.price),
      image: product.images[0]?.src || '/api/placeholder/300/400'
    });
  };

  const getDisplayPrice = (product: ShopifyProduct) => {
    const availableVariant = product.variants.find(v => v.available) || product.variants[0];
    return availableVariant ? parseFloat(availableVariant.price) : 0;
  };

  const isInStock = (product: ShopifyProduct) => {
    return product.availableForSale && product.variants.some(v => v.available);
  };

  if (loading) {
    return (
      <div className="bg-black min-h-screen py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
            <p className="text-white mt-4">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            Bourbon Budz Merch
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Show your love for the podcast with our exclusive merchandise collection. 
            From comfortable apparel to bourbon accessories, represent Bourbon Budz in style.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                category === selectedCategory
                  ? "bg-red-500 text-white"
                  : "bg-zinc-800 text-gray-300 hover:bg-zinc-700 hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Featured Products - Show only if we have products and featured ones exist */}
        {products.length > 0 && featuredProducts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              🌟 Featured Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {featuredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-zinc-900 rounded-lg overflow-hidden border-2 border-red-500/60 hover:border-red-500 transition-all duration-300 group relative shadow-lg hover:shadow-red-500/20"
                >
                  {/* Featured Badge */}
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-20">
                    ⭐ Featured
                  </div>
                  
                  {/* Product Image */}
                  <div className="aspect-square bg-gradient-to-br from-red-900/20 to-zinc-800 flex items-center justify-center relative">
                    {!isInStock(product) && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                        <span className="text-white font-bold bg-red-600 px-3 py-1 rounded-lg text-sm">Out of Stock</span>
                      </div>
                    )}
                    {product.images[0] ? (
                      <img
                        src={product.images[0].src}
                        alt={product.images[0].altText || product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-red-400/20 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">🥃</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-4">
                    <div className="text-red-400 text-xs font-medium mb-1 uppercase tracking-wide">{product.productType}</div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-red-400 transition-colors line-clamp-2">
                      {product.title}
                    </h3>
                    <p className="text-gray-400 text-sm mt-2 mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-white">${getDisplayPrice(product).toFixed(2)}</span>
                    </div>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      disabled={!isInStock(product)}
                      className={`w-full font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center ${
                        isInStock(product)
                          ? "bg-red-500 hover:bg-red-600 text-white" 
                          : "bg-gray-600 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <ShoppingCartIcon className="w-4 h-4 mr-2" />
                      {isInStock(product) ? "Add to Cart" : "Out of Stock"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regular Products */}
        {products.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-zinc-900 rounded-lg shadow-lg p-8 max-w-md mx-auto border border-red-500/30">
              <div className="text-red-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Shop Temporarily Unavailable</h3>
              <p className="text-gray-400 mb-4">
                We're working on setting up our shop! Check back soon for:
              </p>
              <div className="text-left space-y-4">
                {shopCategories.map((category) => (
                  <div key={category.name}>
                    <h4 className="text-red-400 font-semibold mb-2">{category.name}</h4>
                    <ul className="space-y-1 text-sm text-gray-400 ml-4">
                      {category.items.map((item) => (
                        <li key={item} className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Follow us on social media for updates!
              </p>
            </div>
          </div>
        ) : regularProducts.length > 0 ? (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-8">
              {selectedCategory === "All" ? "All Products" : selectedCategory}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {regularProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 hover:border-red-500/30 transition-all duration-300 group"
                >
                  <div className="aspect-square bg-gradient-to-br from-red-900/20 to-zinc-800 flex items-center justify-center relative">
                    {!isInStock(product) && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                        <span className="text-white font-bold bg-red-600 px-3 py-1 rounded-lg">Out of Stock</span>
                      </div>
                    )}
                    {product.images[0] ? (
                      <img
                        src={product.images[0].src}
                        alt={product.images[0].altText || product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-red-400/20 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">🥃</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="text-red-400 text-xs font-medium mb-1">{product.productType}</div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-red-400 transition-colors line-clamp-2">
                      {product.title}
                    </h3>
                    <p className="text-gray-400 text-sm mt-2 mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-white">${getDisplayPrice(product).toFixed(2)}</span>
                    </div>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      disabled={!isInStock(product)}
                      className={`w-full font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center ${
                        isInStock(product)
                          ? "bg-red-500 hover:bg-red-600 text-white" 
                          : "bg-gray-600 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <ShoppingCartIcon className="w-4 h-4 mr-2" />
                      {isInStock(product) ? "Add to Cart" : "Out of Stock"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">No products found in this category.</p>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="bg-zinc-900 rounded-lg p-8 text-center border border-red-500/20">
          <h3 className="text-2xl font-bold text-white mb-4">Stay Updated</h3>
          <p className="text-gray-400 mb-6">
            {products.length === 0 
              ? "Get notified when our merchandise store launches!"
              : "Get notified about new merchandise releases and exclusive podcast deals."
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
            />
            <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

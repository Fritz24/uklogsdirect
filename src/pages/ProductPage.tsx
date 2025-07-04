import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Plus, Minus, ShoppingCart, Star, Truck, Shield, Clock } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useCart } from '../contexts/CartContext'
import { Helmet } from 'react-helmet-async'

interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category: string
  stock: number
  featured: boolean
}

export default function ProductPage() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()

  useEffect(() => {
    if (id) {
      fetchProduct(id)
    }
  }, [id])

  const fetchProduct = async (productId: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single()

      if (error) throw error
      setProduct(data)
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addItem({
          id: product.id,
          name: product.name,
          price: product.price,
          image_url: product.image_url,
        })
      }
    }
  }

  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(prev => prev + 1)
    }
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Helmet>
          <title>Product Not Found - Logs Supply Pro</title>
          <meta name="description" content="The product you are looking for could not be found on Logs Supply Pro." />
        </Helmet>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <Link to="/shop" className="text-green-600 hover:text-green-700">
            Return to Shop
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Helmet>
        <title>{`Logs Supply Pro - ${product.name}`}</title>
        <meta name="description" content={product.description} />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={product.image_url} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={`https://www.logssupplypro.com/product/${product.id}`} />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            to="/shop"
            className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shop
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div>
            <div className="aspect-w-4 aspect-h-3 bg-gray-200 rounded-lg overflow-hidden">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-96 object-cover"
              />
            </div>
          </div>

          {/* Product Details */}
          <div>
            <div className="mb-6">
              {product.featured && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mb-4">
                  Featured Product
                </span>
              )}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-current text-yellow-400"
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">(48 reviews)</span>
              </div>
              <p className="text-4xl font-bold text-green-600 mb-6">
                £{product.price.toFixed(2)}
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <p className="text-green-600 font-medium">
                  ✓ In Stock ({product.stock} available)
                </p>
              ) : (
                <p className="text-red-600 font-medium">
                  ✗ Out of Stock
                </p>
              )}
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={increaseQuantity}
                      disabled={quantity >= product.stock}
                      className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-green-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </button>
                </div>
              </div>
            )}

            {/* Features */}
            <div className="border-t pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Choose This Product</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Truck className="w-6 h-6 text-green-600 mr-3 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900">Free Delivery</h4>
                    <p className="text-gray-600 text-sm">Free delivery on orders over £100</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Shield className="w-6 h-6 text-green-600 mr-3 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900">Quality Guarantee</h4>
                    <p className="text-gray-600 text-sm">Moisture content below 20% guaranteed</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="w-6 h-6 text-green-600 mr-3 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900">Ready to Burn</h4>
                    <p className="text-gray-600 text-sm">No seasoning required - use immediately</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
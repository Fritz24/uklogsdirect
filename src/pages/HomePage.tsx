import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Truck, Shield, Leaf, Star, CheckCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import ProductCard from '../components/ProductCard'

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

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .limit(3)

      if (error) throw error
      setFeaturedProducts(data || [])
    } catch (error) {
      console.error('Error fetching featured products:', error)
    } finally {
      setLoading(false)
    }
  }

  const features = [
    {
      icon: <Truck className="w-8 h-8 text-green-600" />,
      title: 'Free Delivery',
      description: 'Free delivery on orders over £100 worldwide'
    },
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: 'Quality Guaranteed',
      description: 'Premium logs with moisture content below 20%'
    },
    {
      icon: <Leaf className="w-8 h-8 text-green-600" />,
      title: 'Sustainable Sourcing',
      description: 'Responsibly sourced from sustainably managed forests'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      rating: 5,
      comment: 'Excellent quality logs, burn beautifully and delivered on time. Highly recommended!'
    },
    {
      name: 'Michael Thompson',
      rating: 5,
      comment: 'Been using Logs Supply Pro for 2 years now. Consistent quality and great service.'
    },
    {
      name: 'Emma Davis',
      rating: 5,
      comment: 'Perfect logs for our wood burner. Clean burning and great heat output.'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white">
        <div className="absolute inset-0">
          <img
            src="/images/home-hero.jpg"
            alt="Kiln-dried logs"
            loading="lazy"
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Premium Logs
              <span className="block text-green-400">Delivered to Your Door</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              High-quality, sustainably sourced hardwood logs with guaranteed low moisture content. 
              Perfect for wood burners, stoves, and open fires.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/shop"
                className="inline-flex items-center bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Shop Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Logs Supply Pro?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to providing the highest quality logs with exceptional service
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600">
              Our most popular products for your heating needs
            </p>
          </div>
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          <div className="text-center mt-12">
            <Link
              to="/shop"
              className="inline-flex items-center bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors"
            >
              View All Products
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                World's Premium Log Supplier
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                With over 15 years of experience, Logs Supply Pro has been providing premium 
               logs to homes across the world. Our commitment to quality and 
                sustainable sourcing ensures you get the best logs for your heating needs.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                  <span className="text-gray-700">Moisture content below 20% guaranteed</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                  <span className="text-gray-700">Sustainably sourced hardwood</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                  <span className="text-gray-700">Ready to burn immediately</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                  <span className="text-gray-700">worldwide delivery available</span>
                </div>
              </div>
            </div>
            <div>
              <img
                src="/images/home-feature.jpg"
                alt="Stacked logs"
                loading="lazy"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600">
              Trusted by thousands of satisfied customers across the world
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "{testimonial.comment}"
                </p>
                <p className="font-semibold text-gray-900">
                  {testimonial.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Order Premium Logs?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Get your premium logs delivered directly to your door. 
            Perfect for your wood burner, stove, or open fire.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center bg-white text-green-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Shop Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
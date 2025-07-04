import React from 'react'
import { CheckCircle, Users, Truck, Leaf } from 'lucide-react'
import { Helmet } from 'react-helmet-async'

export default function AboutPage() {
  const stats = [
    { label: 'Years of Experience', value: '15+' },
    { label: 'Happy Customers', value: '10,000+' },
    { label: 'Orders Delivered', value: '50,000+' },
    { label: 'Counties Served', value: '48' },
  ]

  const values = [
    {
      icon: <Leaf className="w-8 h-8 text-green-600" />,
      title: 'Sustainability',
      description: 'All our logs come from sustainably managed forests with FSC certification.'
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-green-600" />,
      title: 'Quality',
      description: 'Every batch is tested to ensure moisture content below 20% for optimal burning.'
    },
    {
      icon: <Truck className="w-8 h-8 text-green-600" />,
      title: 'Reliability',
      description: 'Consistent delivery schedules and excellent customer service you can count on.'
    },
    {
      icon: <Users className="w-8 h-8 text-green-600" />,
      title: 'Customer Focus',
      description: 'Your satisfaction is our priority, with 24/7 support and hassle-free returns.'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>About Logs Supply Pro - Our Story & Values</title>
        <meta name="description" content="Learn about Logs Supply Pro: our 15+ years of experience, commitment to sustainable sourcing, quality logs, and dedication to customer satisfaction." />
      </Helmet>
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white py-24">
        <div className="absolute inset-0">
          <img
            src="/images/about-hero.jpg"
            alt="Forest"
            loading="lazy"
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About Logs Supply Pro
            </h1>
            <p className="text-xl md:text-2xl text-gray-300">
              Trusted supplier of premium logs, 
              serving homes across the world for over 15 years.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  {stat.value}
                </div>
                <div className="text-green-100">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Founded in 2009, Logs Supply Pro began as a small family business with a simple mission: 
                  to provide homes with the highest quality logs available. What started in a small woodland in Devon has grown into one of the UK's most trusted log suppliers.
                </p>
                <p>
                  Our founder, James Mitchell, was frustrated by the poor quality and inconsistent moisture 
                  content of logs available in the market. He decided to take matters into his own hands, 
                  investing in state-of-the-art kiln-drying equipment and establishing direct relationships 
                  with sustainable forestry operations across the world.
                </p>
                <p>
                  Today, we're proud to serve over 10,000 satisfied customers across 48 counties, 
                  delivering premium logs that burn efficiently, produce excellent heat output, 
                  and create minimal smoke and ash.
                </p>
              </div>
            </div>
            <div>
              <img
                src="/images/home-feature.jpg"
                alt="Log processing facility"
                loading="lazy"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These core principles guide everything we do, from sourcing our logs 
              to delivering them to your door.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Process
            </h2>
            <p className="text-xl text-gray-600">
              From forest to fireplace, we maintain the highest standards at every step
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Sustainable Sourcing</h3>
              <p className="text-gray-600">
                We source our hardwood exclusively from FSC-certified, sustainably managed forests across the world.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Kiln Drying</h3>
              <p className="text-gray-600">
                Our state-of-the-art kilns reduce moisture content to below 20%, ensuring optimal burning efficiency.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality Control</h3>
              <p className="text-gray-600">
                Every batch is tested and inspected before packaging to guarantee consistent quality and performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600">
              The passionate people behind Logs Supply Pro
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">James Mitchell</h3>
              <p className="text-green-600 font-medium mb-3">Founder & CEO</p>
              <p className="text-gray-600 text-sm">
                With over 20 years in forestry, James founded Logs Supply Pro to bring premium 
                quality logs to British homes.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sarah Thompson</h3>
              <p className="text-green-600 font-medium mb-3">Operations Director</p>
              <p className="text-gray-600 text-sm">
                Sarah oversees our kiln operations and quality control, ensuring every log 
                meets our exacting standards.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Michael Davies</h3>
              <p className="text-green-600 font-medium mb-3">Customer Service Manager</p>
              <p className="text-gray-600 text-sm">
                Michael leads our customer service team, ensuring every customer has an 
                exceptional experience with Logs Supply Pro.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
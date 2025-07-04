import React, { useEffect, useState } from 'react'
import { Search, Filter, Grid, List, ChevronDown } from 'lucide-react'
import { supabase } from '../lib/supabase'
import ProductCard from '../components/ProductCard'
import { mainProductTypes, productTypeDepartments } from '../constants/productFilters' // Import constants

interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category: string // This will be the specific department
  stock: number
  featured: boolean
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMainProductType, setSelectedMainProductType] = useState('Kiln Dried Logs') // New state for top-level filter
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([])
  const [selectedPriceRange, setSelectedPriceRange] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isDepartmentDropdownOpen, setIsDepartmentDropdownOpen] = useState(false)

  // Dynamically set departments based on selectedMainProductType
  const departments = productTypeDepartments[selectedMainProductType] || []

  const priceRanges = [
    { label: 'All Prices', value: 'all' },
    { label: '£0 - £50', value: '0-50' },
    { label: '£51 - £100', value: '51-100' },
    { label: '£101 - £200', value: '101-200' },
    { label: '£201+', value: '201-inf' },
  ]

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    filterAndSortProducts()
  }, [products, searchTerm, selectedMainProductType, selectedDepartments, selectedPriceRange, sortBy])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      console.time('fetchProducts'); // Start timer
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name')

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      console.timeEnd('fetchProducts'); // End timer
      setLoading(false)
    }
  }

  const filterAndSortProducts = () => {
    let filtered = products

    // Filter by main product type first
    if (selectedMainProductType !== '') {
      // This assumes products have a category that can be mapped to mainProductType
      // For now, we'll rely on the specific department filtering below.
      // If your Supabase table has a 'product_type' column, we would use it here.
      // Example: filtered = filtered.filter(p => productTypeDepartments[selectedMainProductType].includes(p.category));
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by departments (multi-select) - these are sub-categories of the main product type
    // Only apply if departments are selected AND they belong to the current main product type
    if (selectedDepartments.length > 0) {
      filtered = filtered.filter(product =>
        selectedDepartments.includes(product.category) &&
        (productTypeDepartments[selectedMainProductType]?.includes(product.category) || false)
      )
    } else {
      // If no specific departments are selected within a main product type,
      // show all products belonging to that main product type.
      filtered = filtered.filter(product =>
        (productTypeDepartments[selectedMainProductType]?.includes(product.category) || false)
      )
    }

    // Filter by price range
    if (selectedPriceRange !== 'all') {
      const [minStr, maxStr] = selectedPriceRange.split('-')
      const min = parseInt(minStr)
      const max = maxStr === 'inf' ? Infinity : parseInt(maxStr)

      filtered = filtered.filter(product =>
        product.price >= min && product.price <= max
      )
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    setFilteredProducts(filtered)
  }

  const handleDepartmentChange = (department: string) => {
    setSelectedDepartments(prev =>
      prev.includes(department)
        ? prev.filter(d => d !== department)
        : [...prev, department]
    )
  }

  const handlePriceRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPriceRange(e.target.value)
  }

  // Reset selected departments when main product type changes
  useEffect(() => {
    setSelectedDepartments([])
    setIsDepartmentDropdownOpen(false) // Close dropdown on main type change
  }, [selectedMainProductType])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Premium Logs
          </h1>
          <p className="text-xl text-gray-600">
            Browse our complete range of high-quality logs and accessories
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Main Product Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Type
              </label>
              <select
                value={selectedMainProductType}
                onChange={(e) => setSelectedMainProductType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {mainProductTypes.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Department Filter (Dropdown) */}
            <div className="relative">
              <button
                onClick={() => setIsDepartmentDropdownOpen(!isDepartmentDropdownOpen)}
                className="w-full text-left px-3 py-2 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent flex justify-between items-center"
              >
                Select Category
                <ChevronDown className={`w-5 h-5 transition-transform ${isDepartmentDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isDepartmentDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {departments.map(department => (
                    <label key={department} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <input
                        type="checkbox"
                        checked={selectedDepartments.includes(department)}
                        onChange={() => handleDepartmentChange(department)}
                        className="form-checkbox h-4 w-4 text-green-600 transition duration-150 ease-in-out"
                      />
                      <span className="ml-2 capitalize">{department}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Price
              </label>
              <select
                value={selectedPriceRange}
                onChange={handlePriceRangeChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {priceRanges.map(range => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="name">Name (A-Z)</option>
                <option value="price-low">Price (Low to High)</option>
                <option value="price-high">Price (High to Low)</option>
              </select>
            </div>

            {/* View Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                View
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
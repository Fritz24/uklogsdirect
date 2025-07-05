import React, { useState, useEffect } from 'react'
import { 
  Package, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  Plus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { mainProductTypes, productTypeDepartments } from '../../constants/productFilters'
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
  created_at: string
  old_price?: number | null
}

interface DashboardStats {
  totalProducts: number
  totalUsers: number
  totalOrders: number
  totalRevenue: number
}

export default function AdminDashboard() {
  const { isAdmin } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0
  })
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    oldPrice: '',
    image_url: '',
    imageFile: null as File | null,
    selectedMainProductType: mainProductTypes[0] || '',
    category: productTypeDepartments[mainProductTypes[0]]?.[0] || '',
    stock: '',
    featured: false
  })

  const currentFormDepartments = productTypeDepartments[productForm.selectedMainProductType] || []

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardData()
    }
  }, [isAdmin])

  const fetchDashboardData = async () => {
    try {
      // Fetch products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*, old_price')
        .order('created_at', { ascending: false })

      if (productsError) throw productsError
      setProducts(productsData || [])

      // Fetch real stats
      const { count: usersCount, error: usersError } = await supabase
        .from('profiles') // Assuming each auth.users entry has a corresponding profiles entry
        .select('id', { count: 'exact' });
      if (usersError) throw usersError;

      const { count: ordersCount, data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('total', { count: 'exact' });
      if (ordersError) throw ordersError;

      const totalRevenue = ordersData.reduce((sum, order) => sum + (order.total || 0), 0);

      setStats({
        totalProducts: productsData?.length || 0,
        totalUsers: usersCount || 0,
        totalOrders: ordersCount || 0,
        totalRevenue: totalRevenue || 0
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    let imageUrlToSave = productForm.image_url;

    if (productForm.imageFile) {
      const file = productForm.imageFile;
      const filePath = `product_images/${Date.now()}-${file.name}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        alert('Error uploading image: ' + uploadError.message);
        setLoading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);
      
      imageUrlToSave = publicUrlData.publicUrl;
    } else if (editingProduct && !productForm.image_url) {
        imageUrlToSave = '';
    }

    try {
      const productData = {
        name: productForm.name,
        description: productForm.description,
        price: parseFloat(productForm.price),
        old_price: productForm.oldPrice ? parseFloat(productForm.oldPrice) : null,
        image_url: imageUrlToSave,
        category: productForm.category,
        stock: parseInt(productForm.stock),
        featured: productForm.featured
      }

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData])

        if (error) throw error
      }

      setShowProductForm(false)
      setEditingProduct(null)
      setProductForm({
        name: '',
        description: '',
        price: '',
        oldPrice: '',
        image_url: '',
        imageFile: null,
        selectedMainProductType: mainProductTypes[0] || '',
        category: productTypeDepartments[mainProductTypes[0]]?.[0] || '',
        stock: '',
        featured: false
      })
      fetchDashboardData()
    } catch (error) {
      console.error('Error saving product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)

    let mainTypeFound = '';
    for (const type of mainProductTypes) {
      if (productTypeDepartments[type]?.includes(product.category)) {
        mainTypeFound = type;
        break;
      }
    }

    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      oldPrice: product.old_price?.toString() || '',
      image_url: product.image_url,
      imageFile: null,
      selectedMainProductType: mainTypeFound || mainProductTypes[0] || '',
      category: product.category,
      stock: product.stock.toString(),
      featured: product.featured
    })
    setShowProductForm(true)
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchDashboardData()
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Admin Dashboard - Logs Supply Pro</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your store and monitor performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">£{stats.totalRevenue.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'overview'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'products'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Products
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'orders'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Orders
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Dashboard Overview</h2>
                <p className="text-gray-600">
                  Welcome to your admin dashboard. Here you can manage products, view orders, and monitor your store's performance.
                </p>
              </div>
            )}

            {activeTab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Products</h2>
                  <button
                    onClick={() => {
                      setShowProductForm(true)
                      setEditingProduct(null)
                      setProductForm({
                        name: '',
                        description: '',
                        price: '',
                        oldPrice: '',
                        image_url: '',
                        imageFile: null,
                        selectedMainProductType: mainProductTypes[0] || '',
                        category: productTypeDepartments[mainProductTypes[0]]?.[0] || '',
                        stock: '',
                        featured: false
                      })
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-700 transition-colors flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </button>
                </div>

                {/* Product Form Modal */}
                {showProductForm && (
                  <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                      <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                      </div>
                      <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                        <form onSubmit={handleProductSubmit}>
                          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                              {editingProduct ? 'Edit Product' : 'Add New Product'}
                            </h3>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Product Name
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={productForm.name}
                                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Description
                                </label>
                                <textarea
                                  rows={3}
                                  required
                                  value={productForm.description}
                                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                ></textarea>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Old Price (£)
                                  </label>
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={productForm.oldPrice}
                                    onChange={(e) => setProductForm({...productForm, oldPrice: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    New Price (£)
                                  </label>
                                  <input
                                    type="number"
                                    step="0.01"
                                    required
                                    value={productForm.price}
                                    onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Stock Quantity
                                </label>
                                <input
                                  type="number"
                                  required
                                  value={productForm.stock}
                                  onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Product Image
                                </label>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => setProductForm({...productForm, imageFile: e.target.files ? e.target.files[0] : null})}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                                {(productForm.imageFile || productForm.image_url) && (
                                  <div className="mt-2">
                                    <p className="text-sm text-gray-600 mb-1">Image Preview:</p>
                                    <img 
                                      src={productForm.imageFile ? URL.createObjectURL(productForm.imageFile) : productForm.image_url}
                                      alt="Product Preview"
                                      className="w-32 h-32 object-cover rounded-md border border-gray-300"
                                    />
                                  </div>
                                )}
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Product Type
                                </label>
                                <select
                                  value={productForm.selectedMainProductType}
                                  onChange={(e) => {
                                    const newMainType = e.target.value;
                                    const newDepartments = productTypeDepartments[newMainType] || [];
                                    setProductForm(prev => ({
                                      ...prev,
                                      selectedMainProductType: newMainType,
                                      category: newDepartments.length > 0 ? newDepartments[0] : '',
                                    }));
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                  {mainProductTypes.map((type) => (
                                    <option key={type} value={type}>
                                      {type}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Category
                                </label>
                                <select
                                  value={productForm.category}
                                  onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                  {currentFormDepartments.length > 0 ? (
                                    currentFormDepartments.map((department) => (
                                      <option key={department} value={department}>
                                        {department}
                                      </option>
                                    ))
                                  ) : (
                                    <option value="">No departments available</option>
                                  )}
                                </select>
                              </div>
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  id="featured"
                                  checked={productForm.featured}
                                  onChange={(e) => setProductForm({...productForm, featured: e.target.checked})}
                                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                />
                                <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                                  Featured Product
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button
                              type="submit"
                              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                            >
                              {editingProduct ? 'Update' : 'Add'} Product
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowProductForm(false)
                                setEditingProduct(null)
                                setProductForm({
                                  name: '',
                                  description: '',
                                  price: '',
                                  oldPrice: '',
                                  image_url: '',
                                  imageFile: null,
                                  selectedMainProductType: mainProductTypes[0] || '',
                                  category: productTypeDepartments[mainProductTypes[0]]?.[0] || '',
                                  stock: '',
                                  featured: false
                                })
                              }}
                              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                )}

                {/* Products Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Old Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          New Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stock
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Featured
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Saved
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-10 h-10 rounded-md object-cover mr-3"
                              />
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {product.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 capitalize">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product.old_price ? `£${product.old_price.toFixed(2)}` : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            £{product.price.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product.stock}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {product.featured ? (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Yes
                              </span>
                            ) : (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                No
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product.old_price && product.old_price > product.price ? 
                              `£${(product.old_price - product.price).toFixed(2)}` : '-'
                            }
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditProduct(product)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Orders</h2>
                <p className="text-gray-600">Order management functionality would go here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
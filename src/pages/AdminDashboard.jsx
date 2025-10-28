import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Package, Plus, Edit2, Trash2, Save, X, Users, ShieldCheck, Upload, AlertCircle, CheckCircle, Loader, LogOut, Star, Search } from 'lucide-react'
import { useDialog } from '../contexts/DialogContext'

const AdminDashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth()
  const navigate = useNavigate()
  const { showAlert, showConfirm } = useDialog()
  
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [activeTab, setActiveTab] = useState('products')
  const [products, setProducts] = useState([])
  const [editingProduct, setEditingProduct] = useState(null)
  const [showProductForm, setShowProductForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [admins, setAdmins] = useState([])
  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [addingAdmin, setAddingAdmin] = useState(false)
  
  const [productForm, setProductForm] = useState({
    name: '', category: 'seeds', price: '', unit: '', description: '', supplier: '', 
    image1: '', image2: '', image3: '',
    verified: true, in_stock: true, rating: 4.5, reviews: 0
  })

  useEffect(() => {
    // Wait for auth to finish loading before checking
    if (!authLoading) {
      checkAdminAccess()
    }
  }, [user, authLoading])

  const checkAdminAccess = async () => {
    // If auth finished loading and no user, redirect to login
    if (!user?.email) { 
      navigate('/login')
      return 
    }
    try {
      const { data, error } = await supabase.from('admin_users').select('email').eq('email', user.email).single()
      if (error || !data) {
        showAlert({ title: 'Access Denied', message: 'You do not have admin privileges.', type: 'error', onClose: () => navigate('/') })
        return
      }
      setIsAdmin(true)
      loadProducts()
      loadAdmins()
    } catch (error) {
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase.from('marketplace_products').select('*').order('created_at', { ascending: false })
      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      showAlert({ title: 'Error', message: 'Failed to load products.', type: 'error' })
    }
  }

  const loadAdmins = async () => {
    try {
      const { data } = await supabase.from('admin_users').select('*').order('created_at', { ascending: false })
      setAdmins(data || [])
    } catch (error) {
      console.error('Error loading admins:', error)
    }
  }

  const handleSaveProduct = async () => {
    if (!productForm.name || !productForm.price || !productForm.unit) {
      showAlert({ title: 'Validation Error', message: 'Please fill in all required fields (Name, Price, Unit)', type: 'warning' })
      return
    }
    if (!productForm.image1 || productForm.image1.trim() === '') {
      showAlert({ title: 'Validation Error', message: 'Please provide at least one product image (Image 1)', type: 'warning' })
      return
    }
    try {
      // Create images array from image1, image2, image3
      const images = [productForm.image1, productForm.image2, productForm.image3].filter(img => img.trim() !== '')
      
      const productData = {
        name: productForm.name,
        category: productForm.category,
        price: parseFloat(productForm.price),
        unit: productForm.unit,
        description: productForm.description,
        supplier: productForm.supplier,
        image: productForm.image1 || '', // First image as main image
        images: images, // Array of all images
        verified: productForm.verified,
        in_stock: productForm.in_stock,
        rating: parseFloat(productForm.rating),
        reviews: parseInt(productForm.reviews) || 0,
        created_by: user.email,
        updated_at: new Date().toISOString()
      }
      if (editingProduct) {
        await supabase.from('marketplace_products').update(productData).eq('id', editingProduct.id)
        showAlert({ title: 'Success', message: 'Product updated successfully!', type: 'success' })
      } else {
        await supabase.from('marketplace_products').insert([productData])
        showAlert({ title: 'Success', message: 'Product added successfully!', type: 'success' })
      }
      setShowProductForm(false)
      setEditingProduct(null)
      resetProductForm()
      loadProducts()
    } catch (error) {
      showAlert({ title: 'Error', message: 'Failed to save product.', type: 'error' })
    }
  }

  const handleDeleteProduct = async (productId) => {
    const confirmed = await showConfirm({ title: 'Delete Product', message: 'Are you sure? This cannot be undone.', type: 'warning' })
    if (!confirmed) return
    try {
      await supabase.from('marketplace_products').delete().eq('id', productId)
      showAlert({ title: 'Deleted', message: 'Product deleted successfully!', type: 'success' })
      loadProducts()
    } catch (error) {
      showAlert({ title: 'Error', message: 'Failed to delete product.', type: 'error' })
    }
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    // Extract images from images array
    const images = product.images || [product.image]
    setProductForm({ 
      name: product.name, 
      category: product.category, 
      price: product.price.toString(), 
      unit: product.unit,
      description: product.description || '', 
      supplier: product.supplier || '', 
      image1: images[0] || '',
      image2: images[1] || '',
      image3: images[2] || '',
      verified: product.verified, 
      in_stock: product.in_stock, 
      rating: product.rating.toString(), 
      reviews: product.reviews.toString()
    })
    setShowProductForm(true)
  }

  const resetProductForm = () => {
    setProductForm({ 
      name: '', category: 'seeds', price: '', unit: '', description: '', supplier: '', 
      image1: '', image2: '', image3: '',
      verified: true, in_stock: true, rating: 4.5, reviews: 0 
    })
  }

  const handleAddAdmin = async () => {
    if (!newAdminEmail || !newAdminEmail.includes('@')) {
      showAlert({ title: 'Invalid Email', message: 'Please enter a valid email address.', type: 'warning' })
      return
    }
    setAddingAdmin(true)
    try {
      const { error } = await supabase.from('admin_users').insert([{ email: newAdminEmail.toLowerCase().trim(), created_by: user.email }])
      if (error) {
        if (error.code === '23505') showAlert({ title: 'Already Exists', message: 'This email is already an admin.', type: 'warning' })
        else throw error
        return
      }
      showAlert({ title: 'Success', message: `Admin ${newAdminEmail} added successfully!`, type: 'success' })
      setNewAdminEmail('')
      loadAdmins()
    } catch (error) {
      showAlert({ title: 'Error', message: 'Failed to add admin.', type: 'error' })
    } finally {
      setAddingAdmin(false)
    }
  }

  const handleDeleteAdmin = async (adminId, adminEmail) => {
    console.log('🗑️ Delete Admin Called:', { adminId, adminEmail, currentUser: user.email })
    
    if (adminEmail === user.email) {
      console.log('❌ Cannot delete yourself')
      showAlert({ title: 'Cannot Delete', message: 'You cannot remove yourself as an admin.', type: 'warning' })
      return
    }
    
    const confirmed = await showConfirm({ 
      title: 'Remove Admin', 
      message: `Are you sure you want to remove ${adminEmail} as an admin?`, 
      type: 'warning' 
    })
    
    console.log('✅ Confirmation result:', confirmed)
    if (!confirmed) {
      console.log('❌ User cancelled deletion')
      return
    }
    
    console.log('🚀 Attempting to delete admin from Supabase...')
    console.log('   ID:', adminId)
    console.log('   Email:', adminEmail)
    
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', adminId)
      
      console.log('📊 Supabase Response:', { data, error })
      
      if (error) {
        console.error('❌ DELETE ERROR:', error)
        console.error('   Error Code:', error.code)
        console.error('   Error Message:', error.message)
        console.error('   Error Details:', error.details)
        console.error('   Error Hint:', error.hint)
        
        showAlert({ 
          title: 'Delete Failed', 
          message: `Could not remove admin: ${error.message}. Check console (F12) for details.`, 
          type: 'error' 
        })
        return
      }
      
      console.log('✅ Admin deleted successfully!')
      showAlert({ 
        title: 'Success', 
        message: `${adminEmail} has been removed as an admin.`, 
        type: 'success' 
      })
      
      console.log('🔄 Reloading admin list...')
      loadAdmins()
    } catch (error) {
      console.error('❌ UNEXPECTED ERROR:', error)
      showAlert({ 
        title: 'Error', 
        message: `Unexpected error: ${error.message}. Check console (F12) for details.`, 
        type: 'error' 
      })
    }
  }

  const handleLogout = async () => { await signOut(); navigate('/') }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.supplier || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Show loading while auth is loading OR while checking admin status
  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center"><Loader className="w-12 h-12 animate-spin text-agro-green-600 mx-auto mb-4" /><p className="text-gray-600">Verifying admin access...</p></div>
    </div>
  }

  if (!isAdmin) return null

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center"><ShieldCheck className="w-8 h-8 text-agro-green-600 mr-3" />Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">Manage products and administrators</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right"><p className="text-sm text-gray-600">Logged in as</p><p className="font-semibold text-gray-900">{user?.email}</p></div>
              <button onClick={handleLogout} className="btn-secondary flex items-center space-x-2"><LogOut className="w-4 h-4" /><span>Logout</span></button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg mb-8">
          <div className="flex border-b">
            <button onClick={() => setActiveTab('products')} className={`flex-1 px-6 py-4 font-semibold flex items-center justify-center space-x-2 transition-colors ${activeTab === 'products' ? 'bg-agro-green-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
              <Package className="w-5 h-5" /><span>Products ({products.length})</span>
            </button>
            <button onClick={() => setActiveTab('admins')} className={`flex-1 px-6 py-4 font-semibold flex items-center justify-center space-x-2 transition-colors ${activeTab === 'admins' ? 'bg-agro-green-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
              <Users className="w-5 h-5" /><span>Administrators ({admins.length})</span>
            </button>
          </div>

          {activeTab === 'products' && (
            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="flex-1 relative w-full md:max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search products..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agro-green-500" />
                </div>
                <button onClick={() => { resetProductForm(); setEditingProduct(null); setShowProductForm(true) }} className="btn-primary flex items-center space-x-2">
                  <Plus className="w-5 h-5" /><span>Add New Product</span>
                </button>
              </div>

              {showProductForm && (
                <div className="bg-gray-50 rounded-lg p-6 mb-6 border-2 border-agro-green-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="block text-sm font-semibold text-gray-700 mb-2">Product Name *</label>
                      <input type="text" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-agro-green-500" placeholder="e.g., Hybrid Tomato Seeds" /></div>
                    <div><label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                      <select value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-agro-green-500">
                        <option value="seeds">Seeds</option><option value="pesticides">Pesticides</option><option value="fertilizers">Fertilizers</option><option value="tools">Tools</option>
                      </select></div>
                    <div><label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹) *</label>
                      <input type="number" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-agro-green-500" /></div>
                    <div><label className="block text-sm font-semibold text-gray-700 mb-2">Unit *</label>
                      <input type="text" value={productForm.unit} onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-agro-green-500" placeholder="1kg, 100g, piece" /></div>
                    <div><label className="block text-sm font-semibold text-gray-700 mb-2">Supplier</label>
                      <input type="text" value={productForm.supplier} onChange={(e) => setProductForm({ ...productForm, supplier: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-agro-green-500" /></div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Product Images (Up to 3)</label>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Image 1 URL (Main Image) *</label>
                          <input type="text" value={productForm.image1} onChange={(e) => setProductForm({ ...productForm, image1: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-agro-green-500" placeholder="https://images.unsplash.com/photo-..." />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Image 2 URL (Optional)</label>
                          <input type="text" value={productForm.image2} onChange={(e) => setProductForm({ ...productForm, image2: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-agro-green-500" placeholder="https://images.unsplash.com/photo-..." />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Image 3 URL (Optional)</label>
                          <input type="text" value={productForm.image3} onChange={(e) => setProductForm({ ...productForm, image3: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-agro-green-500" placeholder="https://images.unsplash.com/photo-..." />
                        </div>
                        <p className="text-xs text-gray-500 italic">💡 Tip: Use high-quality images (600x600px recommended). Find free images at unsplash.com</p>
                      </div>
                    </div>
                    <div><label className="block text-sm font-semibold text-gray-700 mb-2">Rating (0-5)</label>
                      <input type="number" step="0.1" min="0" max="5" value={productForm.rating} onChange={(e) => setProductForm({ ...productForm, rating: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-agro-green-500" /></div>
                    <div><label className="block text-sm font-semibold text-gray-700 mb-2">Reviews Count</label>
                      <input type="number" value={productForm.reviews} onChange={(e) => setProductForm({ ...productForm, reviews: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-agro-green-500" /></div>
                    <div className="md:col-span-2"><label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                      <textarea value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-agro-green-500" rows="3" /></div>
                    <div className="flex items-center space-x-6">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" checked={productForm.verified} onChange={(e) => setProductForm({ ...productForm, verified: e.target.checked })} className="w-4 h-4" />
                        <span className="text-sm font-semibold">Verified</span></label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" checked={productForm.in_stock} onChange={(e) => setProductForm({ ...productForm, in_stock: e.target.checked })} className="w-4 h-4" />
                        <span className="text-sm font-semibold">In Stock</span></label>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <button onClick={() => { setShowProductForm(false); setEditingProduct(null); resetProductForm() }} className="btn-secondary flex items-center space-x-2"><X className="w-4 h-4" /><span>Cancel</span></button>
                    <button onClick={handleSaveProduct} className="btn-primary flex items-center space-x-2"><Save className="w-4 h-4" /><span>{editingProduct ? 'Update' : 'Save'} Product</span></button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-12 text-gray-500"><Package className="w-16 h-16 mx-auto mb-4 text-gray-400" /><p className="text-lg font-semibold">No products found</p></div>
                ) : (
                  filteredProducts.map((product) => (
                    <div key={product.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-4">
                        <img src={product.image || 'https://via.placeholder.com/100'} alt={product.name} className="w-20 h-20 object-cover rounded-lg" onError={(e) => e.target.src = 'https://via.placeholder.com/100'} />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-bold text-lg">{product.name}</h4>
                              <p className="text-sm text-gray-600">{product.supplier}</p>
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                              <div className="flex items-center space-x-4 mt-2">
                                <span className="text-2xl font-bold text-agro-green-600">₹{product.price}</span>
                                <span className="text-sm text-gray-600">/ {product.unit}</span>
                                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${product.category === 'seeds' ? 'bg-green-100 text-green-800' : product.category === 'pesticides' ? 'bg-red-100 text-red-800' : product.category === 'fertilizers' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                                  {product.category}</span>
                                <div className="flex items-center space-x-1"><Star className="w-4 h-4 text-yellow-400 fill-current" /><span className="text-sm font-semibold">{product.rating}</span><span className="text-xs text-gray-500">({product.reviews})</span></div>
                              </div>
                              <div className="flex items-center space-x-3 mt-2">
                                {product.verified && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold flex items-center space-x-1"><CheckCircle className="w-3 h-3" /><span>Verified</span></span>}
                                {product.in_stock ? <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold">In Stock</span> : <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-semibold">Out of Stock</span>}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button onClick={() => handleEditProduct(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"><Edit2 className="w-5 h-5" /></button>
                              <button onClick={() => handleDeleteProduct(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 className="w-5 h-5" /></button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'admins' && (
            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-6 mb-6 border-2 border-agro-green-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Add New Administrator</h3>
                <div className="flex items-end space-x-3">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <input type="email" value={newAdminEmail} onChange={(e) => setNewAdminEmail(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAddAdmin()} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-agro-green-500" placeholder="admin@example.com" />
                  </div>
                  <button onClick={handleAddAdmin} disabled={addingAdmin} className="btn-primary flex items-center space-x-2 disabled:opacity-50">
                    {addingAdmin ? <Loader className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}<span>Add Admin</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Current Administrators</h3>
                {admins.map((admin) => (
                  <div key={admin.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-agro-green-100 rounded-full flex items-center justify-center"><ShieldCheck className="w-5 h-5 text-agro-green-600" /></div>
                        <div>
                          <p className="font-semibold text-gray-900">{admin.email} {admin.email === user.email && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full ml-2">You</span>}</p>
                          <p className="text-xs text-gray-500">Added on {new Date(admin.created_at).toLocaleDateString()}{admin.created_by && ` by ${admin.created_by}`}</p>
                        </div>
                      </div>
                      {admin.email !== user.email && (
                        <button onClick={() => handleDeleteAdmin(admin.id, admin.email)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 className="w-5 h-5" /></button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

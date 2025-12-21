import React, { useState, useEffect } from 'react'
import { User, Mail, LogOut, Phone, MapPin, CreditCard, Lock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'

export const Profile = ({ onLogout }) => {
  const { user, updateProfile, logout } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    nic: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  })

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        address: user.address || '',
        nic: user.nic || '',
        phoneNumber: user.phoneNumber || '',
      }))
    }
  }, [user])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (formData.password && formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match')
        setLoading(false)
        return
      }

      // Remove password fields if empty to avoid updating them
      const dataToUpdate = { ...formData }
      if (!dataToUpdate.password) {
        delete dataToUpdate.password
        delete dataToUpdate.confirmPassword
      }

      await updateProfile(dataToUpdate)
      toast.success('Profile updated successfully')
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }))
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    onLogout()
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Please log in to view your profile</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 border border-gray-100">
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-200">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <User size={32} className="text-orange-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
              <p className="text-gray-600 mt-1">Manage your account information</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User size={16} />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-gray-50 focus:bg-white transition-colors"
                  placeholder="John Doe"
                />
              </div>

              {/* Email (Read Only) */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Mail size={16} />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Phone size={16} />
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-gray-50 focus:bg-white transition-colors"
                  placeholder="+1 234 567 890"
                />
              </div>

              {/* NIC */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <CreditCard size={16} />
                  NIC Number
                </label>
                <input
                  type="text"
                  name="nic"
                  value={formData.nic}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-gray-50 focus:bg-white transition-colors"
                  placeholder="NIC No"
                />
              </div>

              {/* Address */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <MapPin size={16} />
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-gray-50 focus:bg-white transition-colors"
                  placeholder="123 Main St, City, Country"
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Lock size={20} className="text-orange-500" />
                Security (Optional)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">New Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-gray-50 focus:bg-white transition-colors"
                    placeholder="Leave blank to keep current"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-gray-50 focus:bg-white transition-colors"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg shadow-orange-500/30 disabled:opacity-50"
              >
                {loading ? 'Saving Changes...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="sm:w-auto bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import { User, Mail, LogOut } from 'lucide-react'
import { supabase } from '../lib/supabase'

export const Profile = ({ onLogout }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    onLogout()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
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
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-200">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <User size={32} className="text-orange-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
              <p className="text-gray-600 mt-1">Manage your account settings</p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                <Mail size={20} className="text-orange-500" />
                <span className="text-gray-800 font-semibold">{user.email}</span>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Account Settings</h2>
              <div className="space-y-4">
                <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <p className="font-semibold text-gray-800">Change Password</p>
                  <p className="text-sm text-gray-600">Update your password regularly for security</p>
                </button>
                <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <p className="font-semibold text-gray-800">Notification Preferences</p>
                  <p className="text-sm text-gray-600">Manage your email notifications</p>
                </button>
                <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <p className="font-semibold text-gray-800">Saved Addresses</p>
                  <p className="text-sm text-gray-600">Manage delivery addresses</p>
                </button>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order History</h2>
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No orders yet</p>
                <p className="text-sm text-gray-500 mt-2">Start shopping to see your order history</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../lib/api'
import { useAuth } from './AuthContext'

const CartContext = createContext(undefined)

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth()
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchCart = async () => {
    if (!isAuthenticated) {
      // Guest user: items are already in state (or could be loaded from localStorage if we wanted persistence)
      // For now, we assume guest items are just in-memory as per previous config.
      // If we want to clear guest cart on logout, that's handled in useEffect dependence.
      return
    }

    try {
      const { data } = await api.get('/cart')
      // Backend returns array of items with populated 'product' field
      setItems(data || [])
    } catch (error) {
      console.error('Error fetching cart:', error)
    }
  }

  // Load cart when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart()
    } else {
      // Optional: clear cart on logout or keep it?
      // Previous logic cleared it.
      setItems([])
    }
  }, [isAuthenticated])


  const addItem = async (product, quantity) => {
    setIsLoading(true)
    try {
      if (!isAuthenticated) {
        // Guest user: In-memory update
        const existingItem = items.find((item) => item.product.id === product.id)
        if (existingItem) {
          setItems(
            items.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          )
        } else {
          // Create consistent structure with backend response
          const newItem = {
            _id: `guest_${Date.now()}_${product.id}`,
            product: product, // Store full product object
            quantity,
          }
          setItems([...items, newItem])
        }
        return
      }

      // Authenticated user: API Call
      const { data } = await api.post('/cart', {
        productId: product.id,
        quantity
      })
      setItems(data)

    } catch (error) {
      console.error('Error adding item to cart:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateQuantity = async (cartItemId, quantity) => {
    setIsLoading(true)
    try {
      if (quantity <= 0) {
        await removeItem(cartItemId)
        return
      }

      const currentItem = items.find(item => item._id === cartItemId || item.id === cartItemId);
      if (!currentItem) return;

      if (!isAuthenticated) {
        // Guest user
        setItems(
          items.map((item) =>
            (item._id === cartItemId || item.id === cartItemId) ? { ...item, quantity } : item
          )
        )
        return
      }

      // Authenticated user
      // Backend expects productId in URL, but we have cartItemId (which is the Mongo _id)
      // We need to use product.id from the item in state
      const productId = currentItem.product.id;

      const { data } = await api.put(`/cart/${productId}`, { quantity })
      setItems(data)

    } catch (error) {
      console.error('Error updating cart item:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const removeItem = async (cartItemId) => {
    setIsLoading(true)
    try {
      const currentItem = items.find(item => item._id === cartItemId || item.id === cartItemId);

      if (!isAuthenticated) {
        // Guest user
        setItems(items.filter((item) => item._id !== cartItemId && item.id !== cartItemId))
        return
      }

      if (!currentItem) return;

      // Authenticated user
      const productId = currentItem.product.id;

      const { data } = await api.delete(`/cart/${productId}`)
      setItems(data)

    } catch (error) {
      console.error('Error removing item from cart:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const clearCart = async () => {
    setIsLoading(true)
    try {
      if (!isAuthenticated) {
        setItems([])
        return
      }

      await api.delete('/cart')
      setItems([])
    } catch (error) {
      console.error('Error clearing cart:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate total dynamically based on product price
  const total = items.reduce((sum, item) => {
    const price = item.product ? item.product.price : 0;
    return sum + item.quantity * price;
  }, 0)

  const itemCount = items.reduce((count, item) => count + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        total,
        itemCount,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}

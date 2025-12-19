import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const CartContext = createContext(undefined)

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchCart = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        // For guest users, we start with what's in the local state (which is empty by default or maintained in memory)
        // No need to fetch from server.
        // If we wanted to persist across refresh, we'd read from localStorage here.
        // But per request, we do not persist.
        return
      }

      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)

      if (error) throw error
      setItems(data || [])
    } catch (error) {
      console.error('Error fetching cart:', error)
    }
  }

  useEffect(() => {
    fetchCart()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      // Re-fetch on auth state change (login/logout)
      if (event === 'SIGNED_OUT') {
        setItems([])
      } else {
        fetchCart()
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const addItem = async (product, quantity) => {
    setIsLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        // Guest user: In-memory update
        const existingItem = items.find((item) => item.product_id === product.id)
        if (existingItem) {
          setItems(
            items.map((item) =>
              item.product_id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          )
        } else {
          // Create a valid cart item structure for the frontend
          const newItem = {
            id: `guest_${Date.now()}_${product.id}`, // Temporary ID
            product_id: product.id,
            quantity,
            user_id: null,
          }
          setItems([...items, newItem])
        }
        return
      }

      // Authenticated user: Supabase update
      const existingItem = items.find((item) => item.product_id === product.id)

      if (existingItem) {
        const { error } = await supabase
          .from('cart_items')
          .update({
            quantity: existingItem.quantity + quantity,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingItem.id)

        if (error) throw error
        setItems(
          items.map((item) =>
            item.id === existingItem.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        )
      } else {
        const { data, error } = await supabase
          .from('cart_items')
          .insert([{ user_id: user.id, product_id: product.id, quantity }])
          .select()

        if (error) throw error
        if (data) setItems([...items, ...data])
      }
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

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        // Guest user
        setItems(
          items.map((item) =>
            item.id === cartItemId ? { ...item, quantity } : item
          )
        )
        return
      }

      // Authenticated user
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity, updated_at: new Date().toISOString() })
        .eq('id', cartItemId)

      if (error) throw error
      setItems(
        items.map((item) =>
          item.id === cartItemId ? { ...item, quantity } : item
        )
      )
    } catch (error) {
      console.error('Error updating cart item:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const removeItem = async (cartItemId) => {
    setIsLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        // Guest user
        setItems(items.filter((item) => item.id !== cartItemId))
        return
      }

      // Authenticated user
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId)

      if (error) throw error
      setItems(items.filter((item) => item.id !== cartItemId))
    } catch (error) {
      console.error('Error removing item from cart:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const clearCart = async () => {
    setIsLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setItems([])
        return
      }

      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)

      if (error) throw error
      setItems([])
    } catch (error) {
      console.error('Error clearing cart:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const total = items.reduce((sum, item) => sum + item.quantity * 25, 0)
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

import React, { useState } from 'react'
import { X, Trash2, Plus, Minus } from 'lucide-react'
import { useCart } from '../context/CartContext'

export const CartSidebar = ({ isOpen, onClose }) => {
  const { items, removeItem, updateQuantity, total } = useCart()

  if (!isOpen) return null

  // Ensure items is always an array to prevent crashes
  const cartItems = Array.isArray(items) ? items : []

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col overflow-hidden transition-transform duration-300 transform">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="bg-orange-50 p-6 rounded-full mb-4">
              <div className="text-4xl">🛒</div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 text-center mb-8 max-w-[200px]">
              Looks like you haven't added anything to your cart yet.
            </p>
            <button
              onClick={onClose}
              className="bg-orange-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors shadow-md hover:shadow-lg w-full max-w-xs"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-4">
                {cartItems.map((item) => {
                  // Backend populates item.product with the full product object
                  // If product is null (deleted), use a fallback or skip
                  const product = item.product || {}

                  // Use item._id or item.id depending on what backend/frontend uses. 
                  // Mongo uses _id for the item itself.
                  const itemId = item._id || item.id

                  if (!product.id) return null // Skip invalid items

                  return (
                    <div
                      key={itemId}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-gray-800">
                            {product.name}
                          </h3>
                          <p className="text-orange-600 font-semibold">
                            ${product.price?.toFixed(2)} each
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(itemId)}
                          className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between bg-gray-100 rounded-lg p-2">
                        <button
                          onClick={() =>
                            updateQuantity(
                              itemId,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="font-semibold w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(itemId, item.quantity + 1)
                          }
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <div className="text-right mt-2 text-sm text-gray-600">
                        Subtotal: $
                        {(product.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="border-t border-gray-200 p-6 space-y-3 bg-gray-50">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span className="font-semibold">
                  ${total.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-lg font-bold text-gray-800 pt-3 border-t border-gray-200">
                <span>Total:</span>
                <span className="text-orange-600">
                  ${total.toFixed(2)}
                </span>
              </div>

              <button className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold text-lg hover:bg-orange-600 transition-colors mt-4">
                Proceed to Checkout
              </button>

              <button
                onClick={onClose}
                className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}


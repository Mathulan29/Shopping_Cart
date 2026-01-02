import React, { useState } from 'react';
import { ProductForm } from '../components/Admin/ProductForm';
import { CategoryManager } from '../components/Admin/CategoryManager';

export const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('products');

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

            <div className="flex border-b border-gray-200 mb-8">
                <button
                    onClick={() => setActiveTab('products')}
                    className={`pb-4 px-4 font-medium transition-colors relative ${activeTab === 'products'
                            ? 'text-orange-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Add Product
                    {activeTab === 'products' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-600"></div>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('categories')}
                    className={`pb-4 px-4 font-medium transition-colors relative ${activeTab === 'categories'
                            ? 'text-orange-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Manage Categories
                    {activeTab === 'categories' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-600"></div>
                    )}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    {activeTab === 'products' ? (
                        <ProductForm />
                    ) : (
                        <CategoryManager />
                    )}
                </div>

                <div className="bg-orange-50 p-6 rounded-lg h-fit">
                    <h3 className="font-bold text-lg mb-4 text-orange-800">Quick Tips</h3>
                    <ul className="list-disc list-inside space-y-2 text-sm text-orange-700">
                        <li>Ensure all required fields are filled for products.</li>
                        <li>Image URLs must be valid direct links.</li>
                        <li>Category changes affect all associated products immediately.</li>
                        <li>Deleting a category does not delete products, but may leave them unclassified.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

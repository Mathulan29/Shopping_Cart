import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { toast } from 'react-toastify';

export const CategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data } = await api.get('/categories');
            setCategories(data);
        } catch (error) {
            toast.error('Failed to fetch categories');
        }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategory.trim()) return;

        setIsLoading(true);
        try {
            await api.post('/categories', { name: newCategory });
            toast.success('Category added successfully');
            setNewCategory('');
            fetchCategories();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add category');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteCategory = async (id) => {
        if (!window.confirm('Are you sure? This might affect products using this category.')) return;

        try {
            await api.delete(`/categories/${id}`);
            toast.success('Category removed');
            fetchCategories();
        } catch (error) {
            toast.error('Failed to delete category');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Manage Categories</h2>

            <form onSubmit={handleAddCategory} className="flex gap-2 mb-6">
                <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="New Category Name"
                    className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
                >
                    {isLoading ? 'Adding...' : 'Add'}
                </button>
            </form>

            <div className="space-y-2">
                {categories.map((cat) => (
                    <div key={cat.id} className="flex justify-between items-center p-3 bg-gray-50 rounded border">
                        <span>{cat.name}</span>
                        <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="text-red-500 hover:text-red-700 text-sm"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/Category');
const Product = require('../models/Product');
const connectDB = require('../config/db');

// Load environment variables
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });


const MOCK_CATEGORIES = [
    { id: 1, name: 'Fruits & Vegetables' },
    { id: 2, name: 'Dairy & Breakfast' },
    { id: 3, name: 'Bakery & Biscuits' },
    { id: 4, name: 'Cold Drinks & Juices' },
    { id: 5, name: 'Instant Food' },
    { id: 6, name: 'Tea, Coffee & Health Drinks' },
];

const MOCK_PRODUCTS = [
    {
        id: 1,
        name: 'Fresh Bananas',
        description: 'Sweet and nutritious robusta bananas',
        price: 4.99,
        stock: 50,
        category_id: 1,
        image_url: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&q=80&w=1000',
    },
    {
        id: 2,
        name: 'Red Apples',
        description: 'Crisp and sweet shimla apples',
        price: 3.49,
        stock: 30,
        category_id: 1,
        image_url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=1000',
    },
    {
        id: 3,
        name: 'Whole Milk',
        description: 'Fresh cow milk, pasteurized',
        price: 2.99,
        stock: 20,
        category_id: 2,
        image_url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=1000',
    },
    {
        id: 4,
        name: 'Brown Bread',
        description: 'Whole wheat fresh bread',
        price: 1.99,
        stock: 15,
        category_id: 3,
        image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=1000',
    },
    {
        id: 5,
        name: 'Orange Juice',
        description: '100% natural orange juice using cold press',
        price: 5.99,
        stock: 25,
        category_id: 4,
        image_url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=1000',
    },
    {
        id: 6,
        name: 'Maggi Noodles',
        description: 'Instant 2-minute noodles',
        price: 0.99,
        stock: 100,
        category_id: 5,
        image_url: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&q=80&w=1000',
    },
    {
        id: 7,
        name: 'Fresh Tomatoes',
        description: 'Farm fresh red tomatoes',
        price: 2.49,
        stock: 45,
        category_id: 1,
        image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=1000',
    },
    {
        id: 8,
        name: 'Green Tea',
        description: 'Organic green tea bags',
        price: 8.99,
        stock: 40,
        category_id: 6,
        image_url: 'https://images.unsplash.com/photo-1627435601361-ec25481c3db6?auto=format&fit=crop&q=80&w=1000',
    },
];

const seedData = async () => {
    try {
        await connectDB();

        console.log('Clearing existing data...');
        await Category.deleteMany({});
        await Product.deleteMany({});

        console.log('Seeding categories...');
        await Category.insertMany(MOCK_CATEGORIES);

        console.log('Seeding products...');
        await Product.insertMany(MOCK_PRODUCTS);

        console.log('Data seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();

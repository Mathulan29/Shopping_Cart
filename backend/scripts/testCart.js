const API_URL = 'http://localhost:5000/api';
let token = '';
let productId = 1;

async function request(url, method = 'GET', body = null, authToken = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

    const options = {
        method,
        headers,
    };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(url, options);
    // Handle 204 No Content
    if (response.status === 204) return null;

    const text = await response.text();
    if (!response.ok) {
        throw new Error(`Request failed: ${response.status} ${response.statusText} - ${text}`);
    }

    try {
        return text ? JSON.parse(text) : null;
    } catch (e) {
        return text;
    }
}

const testCart = async () => {
    try {
        console.log('Starting Cart Test...');

        // 1. Get a Product ID
        try {
            const products = await request(`${API_URL}/products`);
            if (products && products.length > 0) {
                productId = products[0].id;
                console.log(`Using Product ID: ${productId}`);
            } else {
                console.warn('No products found, using default ID 1');
            }
        } catch (e) {
            console.warn('Could not fetch products, using default ID 1');
        }

        // 2. Register/Login User
        const email = 'carttest@example.com';
        const password = 'password123';

        try {
            console.log('Registering user...');
            const regData = await request(`${API_URL}/auth/register`, 'POST', {
                email,
                password,
                name: 'Cart Tester'
            });
            token = regData.token;
            console.log('User registered.');
        } catch (e) {
            if (e.message.includes('400')) {
                console.log('User already exists, logging in...');
                const loginData = await request(`${API_URL}/auth/login`, 'POST', {
                    email,
                    password
                });
                token = loginData.token;
                console.log('User logged in.');
            } else {
                throw e;
            }
        }

        // 3. Clear Cart First
        console.log('Clearing cart...');
        await request(`${API_URL}/cart`, 'DELETE', null, token);

        // 4. Add to Cart
        console.log('Adding to cart...');
        const addData = await request(`${API_URL}/cart`, 'POST', {
            productId,
            quantity: 2
        }, token);
        console.log('Add result:', JSON.stringify(addData, null, 2));

        if (addData.length !== 1 || addData[0].quantity !== 2) {
            throw new Error('Add to cart failed verification');
        }

        // 5. Update Quantity
        console.log('Updating quantity...');
        const updateData = await request(`${API_URL}/cart/${productId}`, 'PUT', {
            quantity: 5
        }, token);
        console.log('Update result:', JSON.stringify(updateData, null, 2));

        if (updateData[0].quantity !== 5) {
            throw new Error('Update quantity failed verification');
        }

        // 6. Remove Item
        console.log('Removing item...');
        const delData = await request(`${API_URL}/cart/${productId}`, 'DELETE', null, token);
        console.log('Remove result:', JSON.stringify(delData, null, 2));

        if (delData.length !== 0) {
            throw new Error('Remove item failed verification');
        }

        console.log('SUCCESS: All cart operations verified!');

    } catch (error) {
        console.error('TEST FAILED:', error.message);
    }
};

testCart();

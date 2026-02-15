require('dotenv').config();
const fetch = require('node-fetch');

async function testCreateAdmin() {
    try {
        // First, login to get token
        console.log('1. Logging in as admin...');
        const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'mhmd12@gmail.com',
                password: '12345678'
            })
        });
        
        const loginData = await loginResponse.json();
        if (!loginResponse.ok) {
            throw new Error('Login failed: ' + loginData.error);
        }
        
        console.log('✅ Login successful!');
        console.log('Token:', loginData.token.substring(0, 20) + '...');
        
        // Create new admin
        console.log('\n2. Creating new admin...');
        const createResponse = await fetch('http://localhost:5000/api/auth/users/admin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${loginData.token}`
            },
            body: JSON.stringify({
                name: 'Test Admin',
                email: 'testadmin@techhub.com',
                password: 'admin123456',
                phone: '1234567890'
            })
        });
        
        const createData = await createResponse.json();
        console.log('Status:', createResponse.status);
        console.log('Response:', createData);
        
        if (createResponse.ok) {
            console.log('\n✅ Admin created successfully!');
            console.log('Admin ID:', createData.user.id);
            console.log('Admin Name:', createData.user.name);
            console.log('Admin Email:', createData.user.email);
            console.log('Is Admin:', createData.user.is_admin);
        } else {
            console.log('\n❌ Admin creation failed!');
        }
        
        // List all users
        console.log('\n3. Fetching all users...');
        const usersResponse = await fetch('http://localhost:5000/api/auth/users', {
            headers: { 'Authorization': `Bearer ${loginData.token}` }
        });
        
        const users = await usersResponse.json();
        console.log('Total users:', users.length);
        console.log('Admins:', users.filter(u => u.is_admin).map(u => `${u.name} (${u.email})`).join(', '));
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testCreateAdmin();

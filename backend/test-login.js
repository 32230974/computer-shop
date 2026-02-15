const fetch = require('node-fetch');

async function testLogin() {
  console.log('Testing login with mhmd12@gmail.com...\n');
  
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'mhmd12@gmail.com',
        password: '12345678'
      })
    });
    
    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('\n✅ Login successful!');
    } else {
      console.log('\n❌ Login failed!');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testLogin();

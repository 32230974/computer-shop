# TechHub Backend Server

A Node.js/Express backend for the TechHub e-commerce platform with user authentication, product management, shopping cart, and email notifications.

## Features

- ✅ User authentication (Signup/Login with JWT)
- ✅ Product management (CRUD operations)
- ✅ Shopping cart functionality
- ✅ Order management
- ✅ Email notifications for signups and logins
- ✅ SQLite database
- ✅ Admin management system
- ✅ CORS enabled for frontend integration

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file with:
```
PORT=5000
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
EMAIL_USER=aliyo.aoub@gmail.com
EMAIL_PASSWORD=your_app_password_here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
```

3. Start the server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires token)
- `GET /api/auth/users` - Get all users (requires token)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/categories` - Get all categories
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Shopping Cart
- `POST /api/cart/add` - Add item to cart
- `GET /api/cart` - Get cart items
- `DELETE /api/cart/:productId` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get specific order

## Email Setup (Gmail)

1. Enable 2-Step Verification on your Gmail account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the generated password in `.env` as `EMAIL_PASSWORD`

## Database Schema

- **users** - User accounts and admin status
- **products** - Product catalog
- **cart_items** - Shopping cart items
- **orders** - Customer orders
- **order_items** - Items in each order
- **notifications** - Email notifications log

## Running Tests

```bash
curl http://localhost:5000/api/health
```

## License

ISC

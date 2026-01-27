# TechHub E-Commerce Website

A full-stack e-commerce website built with Node.js, Express, and MySQL.

## Features

- User authentication (signup, login, password reset)
- Product catalog with categories
- Shopping cart
- Wishlist
- Order management
- Product reviews
- Admin dashboard
- Contact form
- Special offers

## Quick Start (Local)

1. **Start MySQL** (via XAMPP or standalone)

2. **Import Database**
   - Open phpMyAdmin (http://localhost/phpmyadmin)
   - Import `techhub_mysql_schema.sql`

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Configure Environment**
   - Copy `backend/.env.example` to `backend/.env`
   - Update database credentials if needed

5. **Start Server**
   ```bash
   npm start
   ```
   Or double-click `start-website.bat`

6. **Open Website**
   - Visit http://localhost:5000

## Deployment (Railway)

1. Push code to GitHub
2. Connect Railway to your GitHub repo
3. Add MySQL database in Railway
4. Set environment variables
5. Deploy!

## Environment Variables

| Variable | Description |
|----------|-------------|
| PORT | Server port (default: 5000) |
| DB_HOST | MySQL host |
| DB_PORT | MySQL port (default: 3306) |
| DB_USER | MySQL username |
| DB_PASSWORD | MySQL password |
| DB_NAME | Database name |
| JWT_SECRET | Secret key for JWT tokens |
| EMAIL_USER | Email for notifications |
| EMAIL_PASSWORD | Email password/API key |

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: JWT

## License

ISC

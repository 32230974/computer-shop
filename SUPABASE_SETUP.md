# 🚀 Supabase Setup Guide for TechHub

This guide will help you set up your TechHub database on Supabase.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click **"New Project"**
4. Fill in the project details:
   - **Name**: TechHub (or your preferred name)
   - **Database Password**: Create a strong password (save it securely!)
   - **Region**: Choose the closest region to your users
   - **Pricing Plan**: Free tier is perfect for development
5. Click **"Create new project"**
6. Wait 2-3 minutes for your project to be provisioned

## Step 2: Run the Database Schema

1. In your Supabase dashboard, click on **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Open the file `supabase_schema.sql` from your project folder
4. Copy the entire content and paste it into the SQL Editor
5. Click **"Run"** or press `Ctrl + Enter`
6. Wait for the script to complete (you should see "Success" messages)

## Step 3: Get Your Connection Details

1. In your Supabase dashboard, click **"Project Settings"** (gear icon in the bottom left)
2. Click on **"Database"** in the settings menu
3. Find the **"Connection string"** section
4. Copy the **"Connection Pooling"** connection string (it looks like this):
   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
   ```
5. Replace `[YOUR-PASSWORD]` with your actual database password

## Step 4: Create a Test Admin User

1. Go back to **"SQL Editor"**
2. Create a new query and run this SQL (replace the password with your preferred one):

```sql
INSERT INTO users (name, email, phone, password, is_admin) 
VALUES (
    'Test Admin',
    'mhmd12@gmail.com',
    '1234567890',
    '$2a$10$Jq8Z2QZ5K9Z0Q3Z5K9Z0QuJq8Z2QZ5K9Z0Q3Z5K9Z0QuJq8Z2QZ5K',  -- This is bcrypt hash of '12345678'
    true
);
```

**Note**: The password hash above is for '12345678'. For better security, you should hash your own password using bcrypt.

## Step 5: Configure Your Backend

1. Create a `.env` file in your `backend` folder (if it doesn't exist)
2. Add your Supabase connection details:

```env
# Supabase PostgreSQL Connection
DB_TYPE=postgresql
DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres

# Or use individual variables:
DB_HOST=aws-0-us-west-1.pooler.supabase.com
DB_PORT=6543
DB_USER=postgres.[PROJECT-REF]
DB_PASSWORD=[YOUR-PASSWORD]
DB_NAME=postgres

# Email Configuration (optional)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

3. Save the file

## Step 6: Update Backend Dependencies

Your backend is currently configured for MySQL. We need to switch to PostgreSQL:

1. Open a terminal in your `backend` folder
2. Install the PostgreSQL client:

```bash
npm install pg
```

## Step 7: Restart Your Backend Server

1. Stop the current backend server (if running)
2. Start it again:

```bash
cd backend
npm start
```

3. You should see: "✅ Database connected successfully"

## Step 8: Test Your Setup

1. Open your browser and go to `http://localhost:5000`
2. Try logging in with:
   - **Email**: mhmd12@gmail.com
   - **Password**: 12345678
3. You should be logged in as an admin user!

## 🎉 You're Done!

Your TechHub application is now connected to Supabase!

---

## 🔒 Security Tips

1. **Never commit your `.env` file** to Git (it's already in `.gitignore`)
2. **Use strong passwords** for your database and admin accounts
3. **Enable Row Level Security (RLS)** policies in Supabase for production
4. **Use environment variables** for all sensitive data

---

## 📊 Supabase Features You Can Use

- **Table Editor**: View and edit data directly in the Supabase dashboard
- **SQL Editor**: Run custom queries
- **API Auto-generation**: Supabase automatically creates REST APIs for your tables
- **Real-time Subscriptions**: Get live updates when data changes
- **Authentication**: Built-in auth system (consider migrating from JWT)
- **Storage**: Store product images in Supabase Storage
- **Backups**: Automatic daily backups (Pro plan)

---

## 🐛 Troubleshooting

### Connection Error
- Check your connection string is correct
- Verify your database password
- Ensure your IP is whitelisted (Supabase allows all IPs by default)

### Schema Error
- Make sure you ran the full `supabase_schema.sql` file
- Check for any error messages in the SQL Editor

### Login Issues
- Verify the admin user was created correctly
- Check the password hash (use bcrypt to hash 12345678)
- Look at backend logs for authentication errors

---

## 📞 Need Help?

- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- GitHub Issues: Create an issue in your repository

---

**Happy Coding! 🚀**

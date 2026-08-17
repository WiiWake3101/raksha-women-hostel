# Resident Portal Authentication - Documentation

## ✅ What's Been Created

### 1. **Login Page** (`/resident/login`)
- **Location**: `app/resident/login/page.jsx`
- **Features**:
  - Email and password validation
  - Show/hide password toggle
  - Remember me checkbox
  - Forgot password link
  - Link to registration page
  - Loading states
  - Error handling
  - Responsive design
  - AI Virtual Warden teaser

### 2. **Registration Page** (`/resident/register`)
- **Location**: `app/resident/register/page.jsx`
- **Features**:
  - Multi-step form (2 steps: Basic Info → Security)
  - Form validation for all fields
  - Password strength requirements
  - Emergency contact collection
  - Terms & conditions agreement
  - Step indicator
  - Show/hide password toggles
  - Loading states
  - Error handling
  - Responsive design

### 3. **Forgot Password Page** (`/resident/forgot-password`)
- **Location**: `app/resident/forgot-password/page.jsx`
- **Features**:
  - Email validation
  - Success confirmation screen
  - Link back to login
  - Contact support link
  - Responsive design

### 4. **API Routes** (Backend Stubs)
- **Login API**: `app/api/auth/resident/login/route.js`
- **Register API**: `app/api/auth/resident/register/route.js`
- **Forgot Password API**: `app/api/auth/resident/forgot-password/route.js`

---

## 🎨 Design Features

- **Color Scheme**: Pink to Purple gradient (women's hostel theme)
- **Fully Responsive**: Mobile-first design
- **Tailwind CSS**: Using Tailwind CSS 4
- **Icons**: SVG icons for visual appeal
- **Animations**: Loading spinners, smooth transitions
- **Form Validation**: Client-side + server-side validation
- **Error Messages**: User-friendly error display

---

## 🚀 How to Test

### Start the Development Server
```bash
npm run dev
```

### Access the Pages
- Login: `http://localhost:3000/resident/login`
- Register: `http://localhost:3000/resident/register`
- Forgot Password: `http://localhost:3000/resident/forgot-password`

### Test Credentials (Mock)
For testing the login page with mock authentication:
- **Email**: `test@example.com`
- **Password**: `password123`

---

## 📝 TODO: Backend Implementation

### 1. **Database Setup**
You need to create the following database tables/collections:

#### Users Table (Residents)
```sql
CREATE TABLE residents (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(15) NOT NULL,
  room_number VARCHAR(20) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  emergency_contact VARCHAR(255) NOT NULL,
  emergency_phone VARCHAR(15) NOT NULL,
  role VARCHAR(50) DEFAULT 'resident',
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Password Reset Tokens Table
```sql
CREATE TABLE password_reset_tokens (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL,
  expiry TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. **Install Required Packages**
```bash
# For password hashing
npm install bcryptjs

# For JWT tokens
npm install jsonwebtoken

# For email sending
npm install nodemailer

# For database (choose one)
npm install pg          # PostgreSQL
npm install mysql2      # MySQL
npm install mongoose    # MongoDB
```

### 3. **Environment Variables**
Create a `.env.local` file:
```env
# Database
DATABASE_URL=your_database_connection_string

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Application
APP_URL=http://localhost:3000
NODE_ENV=development
```

### 4. **Update API Routes**

#### Login Route (`app/api/auth/resident/login/route.js`)
Replace mock code with:
```javascript
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '@/lib/database'; // Your DB connection

// Find user by email
const user = await db.residents.findOne({ email });
if (!user) {
  return NextResponse.json(
    { message: 'Invalid credentials' },
    { status: 401 }
  );
}

// Verify password
const isValid = await bcrypt.compare(password, user.password_hash);
if (!isValid) {
  return NextResponse.json(
    { message: 'Invalid credentials' },
    { status: 401 }
  );
}

// Generate JWT
const token = jwt.sign(
  { id: user.id, email: user.email, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: rememberMe ? '30d' : '7d' }
);

return NextResponse.json({
  success: true,
  token,
  user: {
    id: user.id,
    fullName: user.full_name,
    email: user.email,
    roomNumber: user.room_number,
    role: user.role
  }
});
```

#### Register Route (`app/api/auth/resident/register/route.js`)
Replace mock code with:
```javascript
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '@/lib/database';
import { sendVerificationEmail } from '@/lib/email';

// Check if user exists
const existingUser = await db.residents.findOne({ email });
if (existingUser) {
  return NextResponse.json(
    { message: 'Email already registered' },
    { status: 409 }
  );
}

// Hash password
const passwordHash = await bcrypt.hash(password, 10);

// Create user
const user = await db.residents.create({
  full_name: fullName,
  email,
  phone,
  room_number: roomNumber,
  password_hash: passwordHash,
  emergency_contact: emergencyContact,
  emergency_phone: emergencyPhone,
  role: 'resident',
  is_verified: false
});

// Send verification email
await sendVerificationEmail(email, user.id);

// Generate JWT
const token = jwt.sign(
  { id: user.id, email: user.email, role: 'resident' },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

return NextResponse.json({
  success: true,
  token,
  user: {
    id: user.id,
    fullName: user.full_name,
    email: user.email,
    roomNumber: user.room_number
  }
});
```

#### Forgot Password Route
Replace mock code with:
```javascript
import crypto from 'crypto';
import { db } from '@/lib/database';
import { sendPasswordResetEmail } from '@/lib/email';

// Check if user exists
const user = await db.residents.findOne({ email });
if (!user) {
  // Return success anyway for security
  return NextResponse.json({ success: true });
}

// Generate reset token
const resetToken = crypto.randomBytes(32).toString('hex');
const tokenExpiry = new Date(Date.now() + 3600000); // 1 hour

// Store token
await db.passwordResetTokens.create({
  email,
  token: resetToken,
  expiry: tokenExpiry,
  used: false
});

// Send email
const resetLink = `${process.env.APP_URL}/resident/reset-password?token=${resetToken}`;
await sendPasswordResetEmail(email, resetLink);

return NextResponse.json({ success: true });
```

### 5. **Create Email Utility** (`lib/email.js`)
```javascript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendVerificationEmail(email, userId) {
  const verificationLink = `${process.env.APP_URL}/resident/verify?id=${userId}`;
  
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Verify Your Email - Raksha Women\'s Hostel',
    html: `
      <h1>Welcome to Raksha Women's Hostel!</h1>
      <p>Click the link below to verify your email:</p>
      <a href="${verificationLink}">Verify Email</a>
    `,
  });
}

export async function sendPasswordResetEmail(email, resetLink) {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Reset Your Password - Raksha Women\'s Hostel',
    html: `
      <h1>Password Reset Request</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>This link expires in 1 hour.</p>
    `,
  });
}
```

### 6. **Create Database Connection** (`lib/database.js`)
Example for PostgreSQL:
```javascript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = {
  residents: {
    async findOne(criteria) {
      const { email } = criteria;
      const result = await pool.query(
        'SELECT * FROM residents WHERE email = $1',
        [email]
      );
      return result.rows[0];
    },
    async create(data) {
      const result = await pool.query(
        `INSERT INTO residents (full_name, email, phone, room_number, password_hash, emergency_contact, emergency_phone, role, is_verified)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [data.full_name, data.email, data.phone, data.room_number, data.password_hash, data.emergency_contact, data.emergency_phone, data.role, data.is_verified]
      );
      return result.rows[0];
    },
  },
  passwordResetTokens: {
    async create(data) {
      const result = await pool.query(
        `INSERT INTO password_reset_tokens (email, token, expiry, used)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [data.email, data.token, data.expiry, data.used]
      );
      return result.rows[0];
    },
  },
};
```

---

## 🔒 Security Best Practices

1. **Never store passwords in plain text** - Always use bcrypt
2. **Use strong JWT secrets** - Generate with: `openssl rand -base64 32`
3. **Implement rate limiting** - Prevent brute force attacks
4. **Use HTTPS in production** - Never send credentials over HTTP
5. **Validate all inputs** - Both client and server side
6. **Sanitize user inputs** - Prevent SQL injection
7. **Set secure cookie flags** - HttpOnly, Secure, SameSite
8. **Implement CSRF protection** - Use tokens for forms
9. **Add email verification** - Confirm user ownership
10. **Log authentication attempts** - Monitor for suspicious activity

---

## 📱 Next Steps

1. ✅ **Login, Register, Forgot Password pages** - DONE
2. ⏳ **Implement backend database** - TODO
3. ⏳ **Create resident dashboard** - Next
4. ⏳ **Build AI Chat Interface** (Virtual Warden) - Next
5. ⏳ **Add profile management** - Next
6. ⏳ **Implement complaint system** - Next
7. ⏳ **Build booking system** - Next

---

## 🎯 Testing Checklist

- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Register new resident account
- [ ] Test password strength validation
- [ ] Test email format validation
- [ ] Test phone number validation
- [ ] Request password reset
- [ ] Test remember me functionality
- [ ] Test on mobile devices
- [ ] Test on different browsers
- [ ] Test form validation errors
- [ ] Test loading states
- [ ] Test network error handling

---

## 📞 Support

For issues or questions, contact the development team or refer to the main project documentation.

**Created**: August 11, 2026  
**Version**: 1.0  
**Status**: Ready for backend integration

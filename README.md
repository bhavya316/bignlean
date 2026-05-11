# BigNLean E-commerce API Server

A comprehensive Node.js REST API server for BigNLean - a fitness supplements and sports nutrition e-commerce platform. This server provides complete backend functionality for managing products, users, orders, and all e-commerce operations.

## 🚀 Features

### Core E-commerce Features
- **User Management**: Registration, authentication, profile management with OTP verification
- **Product Catalog**: Comprehensive product management with categories, brands, and variants
- **Shopping Cart**: Add/remove items, quantity management, price calculations
- **Order Management**: Complete order processing, tracking, and status updates
- **Payment Integration**: Multiple payment methods (RazorPay, COD, EMI options)
- **Inventory Management**: Stock tracking, low stock alerts, product availability

### Advanced Features
- **Multi-tier Categories**: Brands → Categories → Sub-categories → Products
- **Rating & Reviews**: Product ratings with detailed feedback (taste, mixability, efficacy, value)
- **Wishlist/Favorites**: Save products for later purchase
- **Coupon System**: Discount coupons with validation and usage tracking
- **Referral Program**: User referral system with reward tracking
- **Subscription Plans**: Premium membership with benefits
- **Content Management**: Blogs, FAQs, fitness guides, and promotional banners

### Authentication & Security
- **Firebase Authentication**: Social login (Google, Facebook) integration
- **OTP Verification**: SMS-based phone number verification
- **Admin Panel**: Secure admin authentication and management
- **User Blocking**: Admin capability to block/unblock users

### Notifications & Communication
- **Push Notifications**: Firebase-based push notifications
- **Email Notifications**: Order confirmations and updates
- **Contact Management**: Customer inquiry handling

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL with Sequelize ORM
- **Authentication**: Firebase Admin SDK
- **File Upload**: Multer for image/file handling
- **Payment**: RazorPay integration
- **SMS**: 2Factor API for OTP delivery
- **Validation**: Express Validator
- **Security**: bcrypt for password hashing
- **CORS**: Cross-origin resource sharing enabled

## 📁 Project Structure

```
Server/
├── admin/                      # Admin-specific modules
│   ├── controllers/           # Admin business logic
│   ├── model/                # Admin data models
│   └── routes/               # Admin API routes
├── user/                      # User-specific modules
│   ├── controllers/          # User business logic
│   ├── middleware/           # User middleware (auth, validation)
│   ├── model/               # User data models
│   └── routes/              # User API routes
├── config/                   # Configuration files
│   ├── database.js          # Database connection
│   └── firebaseAdmin.js     # Firebase configuration
├── utils/                    # Utility functions
│   ├── functions.js         # Helper functions
│   ├── helper.js           # General utilities
│   └── delhivery.js        # Shipping integration
├── uploads/                  # File upload directory
├── Database/                 # Database schema
│   └── bignlean.sql         # MySQL database dump
├── migrations/              # Database migrations
├── app.js                   # Application entry point
├── routes.js               # Main route configuration
└── package.json            # Dependencies and scripts
```

## 🔧 Installation Guide

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- Firebase project setup

### Step-by-Step Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Database Setup**
   Start the local MySQL service, then create the database and app user:
   ```powershell
   Start-Service MYSQL80
   mysql -u root -p
   ```
   ```sql
   CREATE DATABASE IF NOT EXISTS bignlean;
   CREATE USER IF NOT EXISTS 'bhavya'@'localhost' IDENTIFIED BY 'bhavya123';
   GRANT ALL PRIVILEGES ON bignlean.* TO 'bhavya'@'localhost';
   FLUSH PRIVILEGES;
   ```
   Import the bundled database dump:
   ```powershell
   mysql -u bhavya -p bignlean < Database\bignlean.sql
   ```

4. **Configure Database Connection**
   Copy `.env.example` to `.env` and update values if your local MySQL credentials differ:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=bignlean
   DB_USER=bhavya
   DB_PASSWORD=bhavya123
   ```

5. **Firebase Setup**
   - Create a Firebase project
   - Generate service account key
   - Place the key file as `firebase-service-account.json`
   - Update `config/firebaseAdmin.js` with your project details

## ⚙️ Setup & Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
PORT=3002
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_NAME=bignlean
DB_USER=bhavya
DB_PASSWORD=bhavya123
TWOFACTOR_API_KEY=your_2factor_api_key
FIREBASE_PROJECT_ID=your_firebase_project_id
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### Firebase Configuration
- Enable Authentication with Phone, Google, and Facebook providers
- Set up Firestore/Realtime Database
- Configure Firebase Cloud Messaging for push notifications

### Payment Gateway Setup
- Create RazorPay account
- Configure webhook endpoints for payment verification
- Set up EMI options and payment methods

## 🚀 How to Run the Project

### Development Mode
```bash
npm start
```
The server will start on `http://localhost:3002`

### Production Mode
```bash
NODE_ENV=production npm start
```

### Database Sync
The application automatically syncs Sequelize models with the database on startup.

## 📚 API Usage Examples

### User Registration
```javascript
POST /createUser
{
  "phone": "9876543210",
  "name": "John Doe",
  "email": "john@example.com"
}
```

### Product Search
```javascript
GET /getAllProducts?query=protein&brands=[1,2]&category=1&minRating=4
```

### Add to Cart
```javascript
POST /addToCart
{
  "user": 1,
  "product": 5,
  "varientId": 1,
  "flavour": "Chocolate",
  "qty": 2
}
```

### Place Order
```javascript
POST /placeOrder
{
  "user": 1,
  "products": [1, 2, 3],
  "address": 1,
  "paymentMethod": "RazorPay",
  "coupon": "SAVE20"
}
```

### Admin Product Management
```javascript
POST /admin/addProduct
{
  "name": "Whey Protein",
  "catId": 1,
  "subCatId": 1,
  "price": 2999,
  "description": "High-quality whey protein"
}
```

## 🤝 Contribution Guide

### Getting Started
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes and commit: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

### Code Standards
- Follow JavaScript ES6+ standards
- Use meaningful variable and function names
- Add comments for complex business logic
- Ensure proper error handling
- Write unit tests for new features

### Database Changes
- Create migration files for schema changes
- Update the main SQL dump file
- Test migrations on development environment

### API Documentation
- Document new endpoints with request/response examples
- Update Postman collection if available
- Include validation rules and error responses

## 📄 License

This project is licensed under the ISC License.

---

## 📞 Support & Contact

For technical support or business inquiries:
- **Developer**: Deepak Kushwaha
- **Customer Support**: 1800-266-1313
- **Email**: contact@bignlean.com

## 🔗 Related Links

- [BigNLean Website](https://bignlean.com)
- [API Documentation](https://api.bignlean.com/docs)
- [Mobile App](https://play.google.com/store/apps/details?id=com.bignlean)

---

**Note**: This is a production-ready e-commerce API server handling real transactions and user data. Ensure proper security measures and regular backups when deploying to production environments.

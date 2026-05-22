# BignLean - Health & Fitness E-commerce Platform

BignLean is a comprehensive e-commerce platform specializing in health and fitness supplements, protein powders, and nutritional products. Built with Next.js 14 and modern web technologies, it provides a seamless shopping experience for fitness enthusiasts and health-conscious consumers.

## 🚀 Features

- **Product Catalog**: Browse extensive collection of supplements, proteins, and health products
- **User Authentication**: Secure login/register with OTP verification
- **Shopping Cart**: Add to cart, wishlist, and product comparison functionality
- **Order Management**: Track orders, order history, and delivery status
- **User Profile**: Manage personal information, addresses, and preferences
- **Wallet System**: Digital wallet for payments and cashback
- **Referral Program**: Refer friends and earn rewards
- **Product Reviews**: Rate and review products
- **Brand & Category Filtering**: Shop by brands, categories, and subcategories
- **Mobile Responsive**: Optimized for all device sizes
- **Real-time Notifications**: Stay updated with order status and offers
- **Payment Integration**: Razorpay payment gateway integration
- **Blog Section**: Health and fitness articles and tips

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: NextUI, Material-UI
- **State Management**: React Context API with useReducer
- **Data Fetching**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **Animations**: Framer Motion
- **Carousel**: Swiper.js
- **Forms**: React Hook Form with validation
- **Notifications**: React Hot Toast

### Backend Integration
- **API**: RESTful API integration
- **Authentication**: JWT-based authentication
- **File Upload**: Image upload functionality
- **Payment**: Razorpay integration
- **Firebase**: Push notifications and analytics

### Development Tools
- **Package Manager**: npm/bun
- **Linting**: ESLint
- **Code Formatting**: Prettier (via ESLint config)
- **Build Tool**: Next.js built-in bundler
- **Deployment**: PM2 ecosystem

## 📁 Project Structure

```
Client/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Authentication pages (login, register, OTP)
│   │   ├── (site)/            # Main site pages
│   │   │   ├── (private)/     # Protected routes (cart, profile, orders)
│   │   │   └── ...            # Public pages (products, blogs, etc.)
│   │   ├── globals.css        # Global styles
│   │   └── layout.tsx         # Root layout
│   ├── components/            # Reusable UI components
│   │   ├── Navbar/           # Navigation components
│   │   ├── Footer/           # Footer components
│   │   ├── Home/             # Homepage sections
│   │   ├── Forms/            # Form components
│   │   ├── ProductDetail/    # Product page components
│   │   └── ...               # Other UI components
│   ├── Icons/                # SVG icon components
│   ├── provider/             # Context providers
│   ├── queries/              # API query functions
│   ├── utils/                # Utility functions and types
│   ├── config/               # Configuration files
│   └── constants/            # Application constants
├── public/                   # Static assets
│   ├── assets/              # Images and media files
│   └── ...                  # Favicon, manifest, etc.
├── package.json             # Dependencies and scripts
├── next.config.js           # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── ecosystem.config.js     # PM2 deployment configuration
```

## 🔧 Installation Guide

### Prerequisites
- Node.js 18+ 
- npm or bun package manager
- Git

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Client
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

## ⚙️ Setup & Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# API Configuration
BASE_URL=https://api.bignlean.com
NEXT_PUBLIC_BASE_URL=https://api.bignlean.com

# Payment Gateway
NEXT_PUBLIC_RAZOR_PAY_KEY=your_razorpay_key
NEXT_PUBLIC_RAZOR_PAY_SECRET=your_razorpay_secret

# Geocoding Service
NEXT_PUBLIC_GEOCODING=your_geocoding_api_key

# Firebase Configuration (if using)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAJBGWLW6blCxLNUzFaZf9pxwrP36PYKTs
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=bignlean-fbffd.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://bignlean-fbffd-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=bignlean-fbffd
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=bignlean-fbffd.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=394356090128
NEXT_PUBLIC_FIREBASE_APP_ID=1:394356090128:web:9b6ae4290fcaa390977195
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-GB5FME9F4M
```

### API Configuration

The application connects to the BignLean API backend. Update the API base URL in:
- `.env` file
- `src/config/api.ts`

## 🚀 How to Run the Project

### Development Mode
```bash
npm run dev
# or
bun dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
# Build the application
npm run build

# Start production server
npm start
```

### Using PM2 (Production Deployment)
```bash
# Install PM2 globally
npm install -g pm2

# Start with ecosystem config
pm2 start ecosystem.config.js

# Monitor processes
pm2 monit

# View logs
pm2 logs BignLean-web
```

## 📱 Usage Examples

### Adding Products to Cart
```typescript
import { useAddToCart } from '@/queries/Cart';

const { mutate: addToCart } = useAddToCart();

const handleAddToCart = (productId: number, quantity: number) => {
  addToCart({
    productId,
    quantity,
    variantId: selectedVariant?.id
  });
};
```

### User Authentication
```typescript
import { useLogin } from '@/queries/Auth';

const { mutate: login, isLoading } = useLogin();

const handleLogin = (credentials: LoginData) => {
  login(credentials, {
    onSuccess: (data) => {
      // Handle successful login
      router.push('/');
    }
  });
};
```

### Product Filtering
```typescript
import { useGetProducts } from '@/queries/Product';

const { data: products } = useGetProducts({
  category: selectedCategory,
  brand: selectedBrand,
  priceRange: [minPrice, maxPrice]
});
```

## 🤝 Contribution Guide

### Getting Started
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Run tests and linting: `npm run lint`
5. Commit your changes: `git commit -m 'Add some feature'`
6. Push to the branch: `git push origin feature/your-feature-name`
7. Submit a pull request

### Code Style Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Implement responsive design
- Write meaningful component names
- Add proper TypeScript types
- Use React Query for data fetching
- Follow the existing folder structure

### Testing
```bash
# Run linting
npm run lint

# Build check
npm run build
```

## 📄 License

This project is proprietary software developed for BignLean. All rights reserved.

**Copyright © 2017-2024 BignLean.com. All Rights Reserved.**

Designed and developed by [Digigoat India](https://digigoatindia.com/)

---

## 📞 Support

For technical support or questions:
- **Email**: support@bignlean.com
- **Phone**: 1800 266 1313
- **Address**: Bignlean Store, Ground Floor, E-Wing, Shop no.16 & 17, Lodha Freshia Building, Kalyan Shil Road, Lodha Heaven, Nilje, Dombivali East, Thane, Mumbai 421204

## 🔗 Links

- **Website**: [https://bignlean.com](https://bignlean.com)
- **API Documentation**: Contact development team
- **Design System**: NextUI + Custom Tailwind Components

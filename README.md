# Bravyn - E-commerce Platform

A modern, full-stack e-commerce application built with React, TypeScript, and Node.js. Bravyn provides a seamless shopping experience with user authentication, product browsing, shopping cart management, and secure order processing.

## 🎯 Features

### Frontend

- **User Authentication** - Sign up, login, and profile management
- **Product Catalog** - Browse products with detailed views
- **Shopping Cart** - Add/remove items, manage quantities
- **Order Management** - View order history and track orders
- **Responsive Design** - Mobile-friendly interface
- **Google Authentication** - Social login support
- **State Management** - Zustand for efficient state handling

### Backend

- **REST API** - Well-structured Express.js endpoints
- **User Management** - Authentication and authorization
- **Product Management** - CRUD operations for products
- **Order Processing** - Order creation and management
- **File Uploads** - Cloudinary integration for image storage
- **Security** - JWT authentication, middleware protection

## 🛠️ Tech Stack

### Frontend

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Zustand** - State management
- **CSS** - Styling

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Cloudinary** - Cloud storage for images
- **Multer** - File upload middleware
- **Axios** - HTTP client

## 📁 Project Structure

```
bravyn/
├── backend/                    # Express.js server
│   ├── src/
│   │   ├── app.js             # Express app setup
│   │   ├── index.js           # Server entry point
│   │   ├── constants.js       # App constants
│   │   ├── controllers/       # Route controllers
│   │   ├── models/            # Database models
│   │   ├── routes/            # API routes
│   │   ├── middlewares/       # Custom middlewares
│   │   ├── utils/             # Utility functions
│   │   ├── lib/               # Third-party integrations
│   │   └── db/                # Database connection
│   ├── public/temp/           # Temporary file storage
│   ├── package.json           # Dependencies
│   └── .env.example           # Environment variables template
│
├── client/                     # React TypeScript frontend
│   ├── src/
│   │   ├── main.tsx           # React entry point
│   │   ├── App.tsx            # Main App component
│   │   ├── app/
│   │   │   ├── router.tsx     # Route definitions
│   │   │   ├── provider.tsx   # Context providers
│   │   │   └── pages/         # Page components
│   │   ├── components/        # Reusable components
│   │   ├── stores/            # Zustand stores
│   │   ├── lib/               # Utilities and helpers
│   │   ├── api/               # API calls
│   │   ├── types/             # TypeScript types
│   │   └── assets/            # Static assets
│   ├── public/                # Public assets
│   ├── package.json           # Dependencies
│   ├── vite.config.ts         # Vite configuration
│   └── tsconfig.json          # TypeScript configuration
│
└── README.md                  # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB instance
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Abhishekkumarpaswan/Bravyn.git
   cd Bravyn
   ```

2. **Setup Backend**

   ```bash
   cd backend
   npm install
   ```

   Create `.env` file:

   ```bash
   cp .env.example .env
   ```

   Configure your environment variables:

   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

   Start the backend server:

   ```bash
   npm start
   ```

3. **Setup Frontend**

   ```bash
   cd ../client
   npm install
   ```

   Start the development server:

   ```bash
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173 (or your Vite dev server port)
   - Backend API: http://localhost:5000

## 📚 API Endpoints

### User Routes

- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Products Routes

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders Routes

- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id` - Update order status (admin)

## 📋 Environment Variables

### Backend (.env)

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bravyn
JWT_SECRET=your_secret_key_here
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
```

### Frontend (.env.local)

```
VITE_API_BASE_URL=http://localhost:5000/api
```

## 🔧 Available Scripts

### Backend

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm test           # Run tests
```

### Frontend

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected routes with middleware
- Environment variable protection
- CORS configuration
- Input validation and sanitization

## 📝 Pages & Components

### Frontend Pages

- **Home** - Product listing and featured items
- **Product Details** - Detailed product information
- **Cart** - Shopping cart management
- **Checkout** - Order checkout and payment
- **Login/Register** - User authentication
- **Profile** - User profile and settings
- **Orders** - Order history and tracking
- **About** - About the platform
- **Contact** - Contact information

### Key Components

- `Header` - Navigation bar
- `ProductCard` - Product display card
- `ProductGrid` - Product grid layout
- `Footer` - Footer component
- `GoogleAuthButton` - Google authentication button
- `NotificationBar` - Alert/notification display

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Abhishek Kumar Paswan**

- GitHub: [@Abhishekkumarpaswan](https://github.com/Abhishekkumarpaswan)

## 🙏 Acknowledgments

- React community for excellent libraries
- Express.js documentation
- MongoDB for reliable database
- Cloudinary for image hosting
- Zustand for state management

## 📞 Support

For support, open an issue on GitHub or contact the maintainer.

---

**Happy Shopping! 🛍️**

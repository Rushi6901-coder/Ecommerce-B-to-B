# B2B E-commerce Platform

A comprehensive B2B e-commerce platform where vendors (wholesalers) and shopkeepers (retailers) interact through a structured digital system.

## Features

### User Roles
- **Admin**: Manage categories, subcategories, users, and view all orders
- **Vendor**: Manage products, receive orders, chat with shopkeepers
- **Shopkeeper**: Browse products, place orders, chat with vendors

### Core Functionality
- JWT-based authentication with role-based access control
- Two order types: Direct orders and Chat-based orders
- Real-time chat system between vendors and shopkeepers
- Product catalog with categories and subcategories
- Order management and tracking
- File upload for product images

## Technology Stack

### Backend
- Spring Boot 3.5.8
- Spring Security with JWT
- Spring Data JPA
- MySQL Database
- Maven

### Frontend
- React 19.2.0
- Vite
- React Router
- Axios for API calls
- Bootstrap for styling

## Prerequisites

1. **Java 21** or higher
2. **Node.js 18** or higher
3. **MySQL 8.0** or higher
4. **Maven 3.6** or higher

## Database Setup

1. Install and start MySQL server
2. Create a database named `B2BEcom`:
   ```sql
   CREATE DATABASE B2BEcom;
   ```
3. Update database credentials in `spring_boot_mvc_template/src/main/resources/application.properties` if needed:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/B2BEcom
   spring.datasource.username=root
   spring.datasource.password=cdac
   ```

## Installation & Setup

### Method 1: Using Batch Scripts (Windows)

1. **Start Backend**:
   ```bash
   cd "d:\Final Project\Spring boot"
   start-backend.bat
   ```

2. **Start Frontend** (in a new terminal):
   ```bash
   cd "d:\Final Project\Spring boot"
   start-frontend.bat
   ```

### Method 2: Manual Setup

#### Backend Setup
```bash
cd "d:\Final Project\Spring boot\spring_boot_mvc_template"
mvn clean install
mvn spring-boot:run
```

#### Frontend Setup
```bash
cd "d:\Final Project\Spring boot\frontend"
npm install
npm run dev
```

## Default Credentials

The system creates a default admin user on first startup:
- **Email**: admin@b2b.com
- **Password**: admin123

## API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `POST /api/users/vendor-register` - Complete vendor registration
- `POST /api/users/shopkeeper-register` - Complete shopkeeper registration
- `GET /api/users/me` - Get current user info

### Admin Endpoints (Requires ADMIN role)
- `GET /api/admin/orders` - View all orders
- `GET /api/admin/dashboard/stats` - Get dashboard statistics
- `GET /api/users/vendors` - Get all vendors
- `GET /api/users/shopkeepers` - Get all shopkeepers
- `DELETE /api/users/vendors/{id}` - Delete vendor
- `DELETE /api/users/shopkeepers/{id}` - Delete shopkeeper

### Categories (Admin can modify, others can view)
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin only)
- `PUT /api/categories/{id}` - Update category (Admin only)
- `DELETE /api/categories/{id}` - Delete category (Admin only)

### Products
- `GET /api/products` - Get all products (Public)
- `POST /api/VendorProduct` - Create product (Vendor only)
- `PUT /api/VendorProduct/{id}` - Update product (Vendor only)
- `DELETE /api/VendorProduct/{id}` - Delete product (Vendor only)

### Orders
- `POST /api/orders` - Place order (Shopkeeper)
- `GET /api/orders/shopkeeper/{id}` - Get shopkeeper orders
- `GET /api/orders/vendor/{id}` - Get vendor orders
- `PUT /api/orders/{id}/status` - Update order status (Vendor)

### Chat
- `GET /api/chat/rooms` - Get chat rooms
- `POST /api/chat/send` - Send message
- `GET /api/chat/messages/{roomId}` - Get chat messages

## Project Structure

```
├── spring_boot_mvc_template/          # Backend (Spring Boot)
│   ├── src/main/java/com/cdac/
│   │   ├── controller/                # REST Controllers
│   │   ├── entity/                    # JPA Entities
│   │   ├── repository/                # Data Repositories
│   │   ├── service/                   # Business Logic
│   │   ├── security/                  # Security Configuration
│   │   ├── dto/                       # Data Transfer Objects
│   │   └── config/                    # Configuration Classes
│   └── src/main/resources/
│       └── application.properties     # App Configuration
├── frontend/                          # Frontend (React)
│   ├── src/
│   │   ├── components/               # React Components
│   │   ├── services/                 # API Services
│   │   ├── context/                  # React Context
│   │   └── views/                    # Page Components
│   └── package.json
├── start-backend.bat                 # Backend startup script
├── start-frontend.bat                # Frontend startup script
└── README.md                         # This file
```

## Usage Flow

### For Vendors:
1. Register as a user with VENDOR role
2. Complete vendor registration with business details
3. Login and manage products
4. Receive and manage orders
5. Chat with shopkeepers

### For Shopkeepers:
1. Register as a user with SHOPKEEPER role
2. Complete shopkeeper registration with shop details
3. Login and browse products
4. Place direct orders or chat with vendors
5. View order history

### For Admins:
1. Login with admin credentials
2. Manage categories and subcategories
3. View and manage all users
4. Monitor all orders
5. Access dashboard statistics

## Security Features

- JWT-based authentication
- Role-based access control
- Password encryption using BCrypt
- CORS configuration for frontend integration
- Protected API endpoints based on user roles

## Development Notes

- The application uses H2 database for development (can be switched to MySQL)
- JWT tokens include userId and role for proper authorization
- File uploads are stored in the `uploads/` directory
- The frontend uses Vite for fast development builds

## Troubleshooting

1. **Database Connection Issues**: Ensure MySQL is running and credentials are correct
2. **Port Conflicts**: Backend runs on port 8080, frontend on port 5173
3. **JWT Issues**: Check if the JWT secret is properly configured
4. **CORS Issues**: Verify CORS configuration in SecurityConfig.java

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes.

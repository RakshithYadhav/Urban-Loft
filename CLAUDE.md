# URBAN LOFT - E-Commerce Furniture Platform

## Project Overview
Urban Loft is a modern furniture-themed e-commerce application designed with a microservices architecture. The platform enables users to browse, purchase, and manage furniture orders with a focus on user experience and scalability.

## Technology Stack

### Frontend
- **Framework**: React with React Router
- **State Management**: Redux or Context API
- **Styling**: Responsive design for mobile and desktop
- **Authentication**: JWT token-based authentication stored in localStorage

### Backend Services
- **API Server**: Node.js with Express
- **Data Service**: C# with ASP.NET Core and Entity Framework Core
- **Database**: MySQL
- **Authentication**: JWT tokens
- **Payment**: Stripe integration

### Architecture Pattern
- **Frontend**: React SPA communicating via REST APIs
- **Backend**: Node.js handles business logic, user authentication, and external integrations
- **Data Layer**: C# service manages database operations using repository pattern
- **Database**: MySQL with normalized schema design

## System Architecture

```
┌─────────────────┐    HTTP/HTTPS     ┌─────────────────┐    HTTP/REST     ┌─────────────────┐
│                 │ ────────────────> │                 │ ──────────────> │                 │
│   React App     │                   │  Node.js API    │                 │  C# Data Service│
│   (Frontend)    │ <──────────────── │   (Backend)     │ <────────────── │  (Repository)   │
│                 │    JSON Response  │                 │   Data Models   │                 │
└─────────────────┘                   └─────────────────┘                 └─────────────────┘
         │                                       │                                   │
         │                                       │                                   │
         ▼                                       ▼                                   ▼
┌─────────────────┐                   ┌─────────────────┐                 ┌─────────────────┐
│  localStorage   │                   │ External APIs   │                 │   MySQL DB      │
│  (JWT Token)    │                   │ (Stripe, etc.)  │                 │  (Persistent)   │
└─────────────────┘                   └─────────────────┘                 └─────────────────┘
```

## Database Schema

### Core Tables
1. **users** - User account information
2. **user_address** - Multiple addresses per user
3. **product** - Furniture product catalog
4. **product_review** - User reviews and ratings
5. **order** - Order transactions
6. **order_item** - Items within each order
7. **inventory** - Stock level management
8. **productcategory** - Product categorization

### Key Relationships
- Users (1:M) UserAddresses
- Users (1:M) Orders
- Orders (1:M) OrderItems
- Products (1:1) Inventory
- Products (1:M) ProductReviews
- Products (M:1) ProductCategory

### Database Schema Details
```sql
-- Users table structure
CREATE TABLE user(
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255)
);

-- Products with category relationship
CREATE TABLE product(
  product_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url VARCHAR(255),
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  category_id INT,
  size VARCHAR(50),
  color VARCHAR(50),
  brand VARCHAR(100)
);

-- Product categories for furniture types
CREATE TABLE productcategory (
  category_id INT AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(255) NOT NULL,        -- Bed, Chair, Sofa, Table, etc.
  utility VARCHAR(255),              -- Bedroom, Living, Office, etc.
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(255)
);
```

## Core Features & User Stories

### Authentication
- **Registration**: Email/password with validation and confirmation email
- **Login**: JWT token-based authentication with protected routes
- **Account Management**: Profile updates and order history

### Product Management
- **Home Page**: Featured products carousel and navigation
- **Product Detail**: Images, description, price, reviews, ratings, availability
- **Product Browsing**: Category-based navigation and search functionality

### Shopping Experience
- **Cart Management**: Add/remove items, update quantities, dynamic pricing
- **Checkout Process**: Shipping address, payment integration (Stripe)
- **Order Confirmation**: Order details, tracking, email notifications

### Inventory Management (C# Service)
- **Stock Tracking**: Automatic deduction on order placement
- **Reorder Alerts**: Threshold-based inventory warnings
- **Manual Adjustments**: Admin controls for stock corrections

## API Endpoints Structure

### Node.js API Routes
```
Authentication:
POST /api/register       - User registration
POST /api/login          - User login (returns JWT)

Products:
GET /api/products        - List all products
GET /api/products/:id    - Product details
GET /api/products/category/:categoryId - Products by category
GET /api/products/search - Search products

Cart & Orders:
GET /api/cart           - Get user cart
POST /api/cart          - Add to cart
PUT /api/cart/item      - Update cart item
POST /api/checkout      - Process order

User:
GET /api/user           - User profile and order history
```

### C# Data Service Endpoints
```
Inventory:
GET /api/inventory/{productId}        - Get stock levels
POST /api/inventory/reserve           - Reserve/deduct stock
PUT /api/inventory/{productId}/adjust - Manual stock adjustment
```

## Development Guidelines

### Security Requirements
- HTTPS for all communications
- JWT tokens for authentication
- Password hashing with bcrypt
- Input validation and sanitization
- SQL injection prevention
- XSS protection

### Performance Considerations
- Redis caching for frequent queries
- Database indexing on commonly queried fields
- Asynchronous operations for external API calls
- Image optimization and CDN usage
- Database connection pooling

### Code Standards
- Repository pattern for data access
- Dependency injection in C# service
- Error handling with proper HTTP status codes
- Logging for audit trails and debugging
- Transaction management for data consistency

## Current Development Status

### Completed
- ✅ User stories and acceptance criteria defined
- ✅ Database schema design with normalization
- ✅ ER diagram created
- ✅ Sample data for product categories
- ✅ Login functionality implementation plan

### In Progress
- 🔄 Dashboard development (navbar, sidebar, carousels)

### Upcoming Features
- 📋 Product catalog implementation
- 📋 Shopping cart functionality
- 📋 Payment integration
- 📋 Order management system
- 📋 Inventory service development

## Folder Structure Recommendation
```
urban-loft/
├── frontend/           # React application
├── backend/           # Node.js API server
├── data-service/      # C# data service
├── database/          # SQL scripts and migrations
├── docs/             # Project documentation
└── README.md
```

## Testing Strategy
- Unit tests for business logic
- Integration tests for API endpoints
- End-to-end tests for user workflows
- Database transaction testing
- Payment integration testing

## Deployment Considerations
- Containerization with Docker
- Environment-specific configuration
- Database migration strategies
- Load balancing for scalability
- Monitoring and logging setup

---

*This document serves as the primary reference for the Urban Loft e-commerce platform development. Update as the project evolves.*
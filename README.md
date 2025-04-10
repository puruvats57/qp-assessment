# Grocery Booking API

A RESTful API for managing grocery items and orders, with separate functionalities for admin and regular users.

## Features

### Admin Features
- Add new grocery items
- View existing grocery items
- Remove grocery items
- Update grocery item details (name, price)
- Manage inventory levels

### User Features
- View available grocery items
- Place orders with multiple items
- View order history

## Tech Stack
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication

## Prerequisites
- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn

## Setup

1. Clone the repository
```bash
git clone <repository-url>
cd grocery-booking-api
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
DIRECT_URL="postgresql://user:password@localhost:5432/dbname"
JWT_SECRET="your-secret-key"
```

4. Run database migrations
```bash
npx prisma migrate dev
```

5. Start the development server
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "role": "USER" // or "ADMIN"
  }
  ```

- `POST /auth/login` - Login and get JWT token
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

### Grocery Management (Admin Only)
- `POST /groceries` - Add new grocery item
  ```json
  {
    "name": "Apple",
    "price": 1.99,
    "quantity": 100
  }
  ```

- `GET /groceries` - List all grocery items

- `PUT /groceries/:id` - Update grocery item
  ```json
  {
    "name": "Apple",
    "price": 2.99,
    "quantity": 150
  }
  ```

- `DELETE /groceries/:id` - Delete grocery item

- `PATCH /groceries/:id/inventory` - Update inventory
  ```json
  {
    "quantity": 200
  }
  ```

### Order Management
- `POST /orders` - Place a new order
  ```json
  {
    "items": [
      {
        "groceryId": 1,
        "quantity": 2
      },
      {
        "groceryId": 2,
        "quantity": 1
      }
    ]
  }
  ```

## Authentication
- All endpoints except `/auth/register` and `/auth/login` require authentication
- Include the JWT token in the Authorization header:
  ```
  Authorization: Bearer <token>
  ```

## Error Handling
The API returns appropriate HTTP status codes and error messages:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Database Schema

### User
- id: Int (Primary Key)
- email: String (Unique)
- password: String
- role: String
- orders: Order[]

### Grocery
- id: Int (Primary Key)
- name: String
- price: Float
- quantity: Int
- orderItems: OrderItem[]

### Order
- id: Int (Primary Key)
- userId: Int (Foreign Key)
- createdAt: DateTime
- status: String
- orderItems: OrderItem[]

### OrderItem
- id: Int (Primary Key)
- orderId: Int (Foreign Key)
- groceryId: Int (Foreign Key)
- quantity: Int
- price: Float

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

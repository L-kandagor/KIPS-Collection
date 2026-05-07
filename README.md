# KIPS Collection - Vercel Deployment

## Setup

1. **Create MongoDB Atlas account** and get a connection string.
2. **Deploy to Vercel** and set environment variable:
   - `MONGODB_URI` = your MongoDB connection string
3. **Seed the database** (optional, run locally):
   ```bash
   npm install
   npm run seed
   ```

## API Endpoints

- `POST /api/users/signup` - Create user
- `POST /api/users/login` - Login user
- `GET /api/users` - Get all users
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `GET /api/products/[id]` - Get product by ID
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product
- `GET /api/cart` - Get cart items
- `POST /api/cart/add` - Add to cart
- `PUT /api/cart/update/[productId]` - Update cart item
- `DELETE /api/cart/[productId]` - Remove from cart
- `GET /api/orders` - Get orders
- `POST /api/orders` - Create order

## Notes

- Cart is global (not per user).
- Passwords are stored in plain text (not secure for production).
- Use a real JWT token for authentication in production.

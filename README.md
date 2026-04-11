# E-Commerce Website

ElectroStore is a full-stack electronics storefront prepared for a university MERN-style submission. The default project path now matches the rubric directly:

- `client/`: React + Vite + React Router
- `server/`: Node.js + Express REST APIs
- `MongoDB`: Mongoose models for users, carts, orders, addresses, and wishlists

## Features

- React component-based customer and admin UI
- Responsive storefront
- Forms and validation
- Routing using React Router
- Signup and login with JWT authentication
- Password hashing with bcrypt
- Role-based access control
- Product listing and product details
- Cart persistence for logged-in users
- Wishlist management
- Saved addresses
- Checkout and order history
- Admin dashboard with order status updates
- Node.js and Express REST APIs
- MongoDB schema design with CRUD operations
- Error handling for API failures
- Environment variable based configuration

## Tech Stack

- Frontend: React, React Router, Vite, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB, Mongoose
- Authentication: JWT, bcryptjs

## Project Structure

```text
client/
  src/
    App.tsx
    pages/
    shims/
server/
  src/
    index.ts
    routes/
app/
components/
lib/
models/
```

## Environment Variables

Create a `.env` file in the project root using `.env.example`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
ADMIN_EMAILS=your_email@example.com
CLIENT_URL=http://localhost:5173
VITE_API_BASE_URL=
PORT=5000
```

## Run the MERN Version Locally

Install dependencies:

```bash
npm install
```

Start frontend and backend together:

```bash
npm run dev:mern
```

This starts:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

Useful scripts:

```bash
npm run dev
npm run build
npm run start
npm run client:dev
npm run client:build
npm run server:dev
npm run server:start
npm run dev:mern
npm run legacy:dev
```

- `npm run dev` starts the MERN submission stack
- `npm run build` builds the Vite client for production
- `npm run start` starts the Express server, which also serves the built frontend from `client/dist`
- `npm run legacy:*` commands keep the older Next.js backup available without making it the default path

## Deployment Notes

- The production flow is same-origin by default: Express serves the built Vite frontend and the REST API from one app.
- If you deploy the frontend separately, set `VITE_API_BASE_URL` to the deployed backend origin before building the client.

## API Areas

- `/api/auth`
- `/api/cart`
- `/api/addresses`
- `/api/wishlist`
- `/api/orders`
- `/api/admin`

## Submission Notes

- The MERN-oriented submission path is `client/` + `server/`
- MongoDB is used for schema design and CRUD operations
- JWT, bcrypt, and admin/customer role separation are implemented
- The legacy Next.js app remains only as a fallback while the MERN path is being finalized
- The repository includes README documentation and a deployable full-stack production path

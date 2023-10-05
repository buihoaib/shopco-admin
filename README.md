# About this app
<img width="627" alt="admin" src="https://github.com/buihoaib/shopco-admin/assets/48377794/09925754-0534-4c50-b253-e03a300aa8ca">

# Key Features

- Create, update, and delete categories.
- Create, update, and delete products.
- View orders.
- View sales analytics of the store, which includes total sales, revenue, and remaining stock.

# Tech Stack

The website is built in Tech Stack below and deployed on [Vercel](https://vercel.com)

- [Next.js](https://nextjs.org) for building React Components.
- [tailwindcss](https://tailwindcss.com) for styling.
- [MongoDB](https://www.mongodb.com/) for database.
- [Prisma](https://vercel.com) for object–relational mapping.
- [Stripe](https://stripe.com/) for payment.
- [Vercel](https://vercel.com) for deployments and CI/CD.

  
# How to run the app

## Getting Started
- Clone the repository using `git clone https://github.com/buihoaib/shopco-admin`
- Install all the modules by using `npm i` or `npm install` or `yarn`

## Setup .env file

```js
FRONTEND_STORE_URL=http://localhost:3001/

# Nextauth - please config your own nextauth secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=""

# Database - please config your own database
DATABASE_URL=""

# JWT token - please config your own JWT token
SECRET_KEY=""

# Cloudinary cloud name - please config your own Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=""

# Stripe - please config your own Stripe
STRIPE_API_KEY=""
STRIPE_WEBHOOK_SECRET=""
```

## Connect to MongoDB and Push Prisma
- `npx prisma generate`
- `npx prisma db push`

## Run the local development server
- Run the local development server by using `npm run dev` or `yarn dev`
- Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy on Vercel

Deployment can be done in 3 easy steps.

- Login to [Vercel](https://vercel.com) or signup for an account if you don't have one.
- Create a `New Project` and select YOUR GitHub repository of the portfolio project.
- Wait for Vercel to deploy your project to production.

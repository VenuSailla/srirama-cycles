# Sri Rama Cycles & Auto Spares 🚲

> A modern, responsive Full-Stack E-Commerce & CMS Management Web Application for Sri Rama Cycles & Auto Spares (Hanumakonda / Kazipet, Telangana). Built with Next.js 14 App Router, React, Tailwind / Custom Design System, and MongoDB Atlas.

---

## 🌟 Key Features

### 🛍️ Customer Storefront
- **Dynamic Hero Slider**: High-resolution cycle showcase with auto-advance and mobile touch gestures.
- **Product Catalog**: Explore Road Bikes, Mountain MTBs, Ladies Cruisers, Kids Cycles, City/Hybrid Bikes, and Genuine Auto Spare Parts.
- **Instant Search & Category Filters**: Real-time debounce search with live thumbnail previews.
- **Cart & Seamless Checkout**: Persistent cart management with doorstep delivery calculation.
- **Live 7-Stage Order Tracking**: Real-time status updates (*Order Placed* → *Confirmed* → *Assembly* → *Packed* → *Shipped* → *Out for Delivery* → *Delivered*).
- **Heritage & Contact Pages**: 50-year Golden Jubilee story (est. 1976), physical showroom location (SSS Complex B-3, Kazipet), WhatsApp integration, and interactive enquiry form.

### 🛡️ CMS Admin Panel (`/admin`)
- **Protected Super Admin Authentication**: Encrypted bcrypt passwords and server-verified JWT cookies.
- **Real-Time KPI Dashboard**: MongoDB metrics for Total Products, Total Orders, Pending Dispatches, Low-Stock Alerts, Registered Customers, and Total Revenue.
- **Full Inventory & Stock Manager**: One-click quick stock adjustment (`-1`, `+5`, `+10`) and stock health indicators.
- **Home Page & Slider CMS**: Publish, edit, reorder, or toggle promotional banner slides with verified presets.
- **Order Dispatch Workflow**: Progress customer orders through all 7 delivery stages with full printable invoice view.
- **Contact & Inquiries Manager**: Filter incoming inquiries by status (*New*, *In Progress*, *Resolved*, *Spam*) with direct WhatsApp and phone call triggers.
- **Security & Account Settings**: Secure in-panel admin password change and global website policy updates.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Route Handlers, Server-Side Rendering)
- **Frontend**: React 18, Lucide React Icons
- **Database & ODM**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) with [Mongoose](https://mongoosejs.com/)
- **Authentication**: JWT Cookies, Bcrypt.js password hashing
- **Deployment Ready**: Optimized for [Vercel](https://vercel.com/)

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) v18.17+ or v20+
- A [MongoDB Atlas](https://www.mongodb.com/atlas) Cluster or local MongoDB instance

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/<your-username>/sriramacycles-web.git
cd sriramacycles-web

# Install dependencies
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory (see `.env.example`):

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.qjpviol.mongodb.net/srirama_cycles?retryWrites=true&w=majority&appName=Cluster0
SESSION_SECRET=your_jwt_secret_key_here
ADMIN_EMAIL=saillavenu012@gmail.com
ADMIN_PASSWORD=your_admin_password
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Database Setup & Seeding
```bash
# Setup admin account
node scripts/setup-admin.js

# Seed initial catalog products and slides
node scripts/seed.js
```

### 5. Running the Application
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```
Open [http://localhost:3000](http://localhost:3000) to view the storefront, or [http://localhost:3000/admin](http://localhost:3000/admin) for the CMS panel.

---

## ☁️ Deploying to Vercel

1. Push this repository to GitHub.
2. In [Vercel](https://vercel.com/), click **Add New Project** and import this repository.
3. Add the following **Environment Variables** in Vercel project settings:
   - `MONGODB_URI`
   - `SESSION_SECRET`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
4. In your MongoDB Atlas dashboard under **Network Access**, ensure `0.0.0.0/0` (Allow Access from Anywhere) is enabled so Vercel serverless functions can connect.
5. Click **Deploy**.

---

## 📄 License
Private commercial project for **Sri Rama Cycle Store & Auto Spares, Kazipet**. All rights reserved.


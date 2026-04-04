# 🌿 Eco Spark

**Eco Spark** is a community-driven idea-sharing platform — think Reddit or daily.dev, but focused on innovative ideas. Members can post, discover, vote on, and discuss ideas. Ideas can be free or paid, with a built-in payment system to unlock premium content.

---

## 🔗 Live URLs

| Service  | URL |
|----------|-----|
| Frontend | [https://assignment5-portal-frontend.vercel.app](https://assignment5-portal-frontend.vercel.app) |
| Backend API | [https://assignment5-portal-backend.vercel.app/api/v1](https://assignment5-portal-backend.vercel.app/api/v1) |

---

## 🔐 Test Credentials

| Role   | Email              | Password   |
|--------|--------------------|------------|
| Admin  | admin2@gmail.com   | 12345678   |
| Member | member@gmail.com   | 12345678   |

---

## ✨ Features

- **Idea Management** — Members can create, edit, and delete their own ideas from a personal dashboard
- **Free & Paid Ideas** — Idea owners can set an idea as Free (publicly viewable) or Paid (requires payment to unlock)
- **Payment Integration** — Paid ideas show a "Pay Now" button; users must complete payment before accessing the full details
- **Voting System** — Community members can upvote or downvote any idea
- **Comments** — Users can comment and discuss under any idea
- **Category Support** — Ideas are organized by categories for easy discovery
- **Image Upload** — Ideas support multiple image attachments
- **Publish Control** — Authors can choose to publish or keep an idea as a draft

---

## 🛠️ Technologies Used

### Frontend
- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** — Component library
- **TanStack Query** — Server state management
- **TanStack Form** — Form handling & validation
- **Sonner** — Toast notifications

### Backend
- **Node.js** with **Express.js** (or NestJS)
- **PostgreSQL** — Database
- **Prisma** — ORM
- **JWT** — Authentication
- **Multer / Cloudinary** — Image upload & storage
- **Stripe / SSLCommerz** — Payment gateway

---

## ⚙️ Setup Instructions

### Prerequisites

- Node.js v18+
- PostgreSQL database
- Package manager: `npm` or `yarn`

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/eco-spark.git
cd eco-spark
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/eco_spark
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PAYMENT_SECRET_KEY=your_payment_key
```

Run database migrations:

```bash
npx prisma migrate dev
```

Start the backend server:

```bash
npm run dev
```

Backend will run at: `http://localhost:5000/api/v1`

---

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_BASE_API=http://localhost:5000/api/v1
```

Start the frontend development server:

```bash
npm run dev
```

Frontend will run at: `http://localhost:3000`

---

## 📁 Project Structure

```
eco-spark/
├── frontend/        # Next.js frontend application
│   ├── app/         # App Router pages
│   ├── components/  # Reusable UI components
│   └── service/     # API service functions
│
└── backend/         # Express/NestJS backend API
    ├── src/
    │   ├── modules/ # Feature modules (ideas, users, payments)
    │   └── prisma/  # Database schema & migrations
```

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
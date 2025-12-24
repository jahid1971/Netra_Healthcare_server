# Netra Healthcare Server

Backend API for Netra Healthcare, a comprehensive telemedicine platform connecting patients with specialists.

## 🔗 Quick Links
- **Live Site**: [https://netra-health-care.vercel.app](https://netra-health-care.vercel.app)

- **Frontend Repository**: [Netra Healthcare Client](https://github.com/jahid1971/Netra_Health_Care_Client)

## 🌟 Features

### Core Functionalities
- User authentication and authorization with role-based access control
- Appointment scheduling and management system
- Virtual consultation support with session management
- Medical records storage and access control
- Prescription management system
- Payment processing integration with SSLCommerz
- Notifications system (email, in-app)

### Technical Features
- RESTful API architecture
- Real-time communication with Socket.IO
- Secure file storage with Cloudinary
- Data validation and sanitization
- Error handling and logging
- Rate limiting and security measures
- Comprehensive API documentation

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.IO
- **Email**: Nodemailer
- **File Storage**: Cloudinary
- **Validation**: Zod


## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/netra-healthcare-server.git
cd netra-healthcare-server
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Configure environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Set up the database
```bash
npx prisma migrate dev
npx prisma db seed
```

5. Start the development server
```bash
npm run dev
# or
yarn dev
```

6. The API will be available at http://localhost:5000/api/v1

## 🧩 Project Structure

```
/
├── src/
│   ├── app/                # Application setup
│   ├── config/             # Configuration files
│   ├── controllers/        # API controllers
│   │   ├── auth/           # Authentication controllers
│   │   ├── appointment/    # Appointment controllers
│   │   ├── user/           # User management controllers
│   │   └── ...             # Other domain controllers
│   ├── helpers/            # Helper functions
│   ├── interfaces/         # TypeScript interfaces
│   ├── middlewares/        # Express middlewares
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── utils/              # Utility functions
│   └── server.ts           # Entry point
├── prisma/                 # Database schema and migrations
│   ├── schema.prisma       # Prisma schema
│   └── seed.ts             # Database seeding
└── docs/                   # API documentation
```



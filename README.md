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



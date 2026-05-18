# 🎓 Academy ERP - Enterprise Resource Planning System

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![Node.js](https://img.shields.io/badge/Node.js-18+-success)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)

## 📖 About The Project

Academy ERP is a decoupled, full-stack enterprise resource planning system engineered to centralize fragmented academic data. It provides a secure, single source of truth for university records, replacing manual spreadsheets with a real-time web portal. 

The system features robust Role-Based Access Control (RBAC), secure stateless session management, and a dynamic front-end calculation engine for academic metrics.

### 🌟 Key Features
* **Secure Authentication:** Stateless JSON Web Token (JWT) architecture with bcrypt password hashing (salt rounds: 10).
* **Role-Based Access Control:** Distinct, guarded dashboards for Admins, Teachers, and Students.
* **Compound Data Indexing:** Advanced MongoDB indexing (Course Code + Section) to handle complex, real-world academic scheduling without data collisions.
* **Dynamic CGPA Engine:** Client-side, mathematically accurate grading engine strictly following the official UGC 10-point scale.
* **Cascade Deletions:** Safe database management ensuring that deleting a teacher requires mandatory course reassignment to prevent orphaned data.

---

## 💻 Tech Stack

**Frontend (Client)**
* HTML5, CSS3 (CSS Flexbox, Custom Properties)
* Vanilla JavaScript (ES6+)
* Axios (HTTP Client with Interceptors)
* Vite (Build Tool & Dev Server)
* **Hosted on:** Vercel

**Backend (REST API)**
* Node.js & Express.js
* JSON Web Tokens (jsonwebtoken) & bcryptjs
* **Hosted on:** Render

**Database**
* MongoDB (NoSQL)
* Mongoose ODM
* **Hosted on:** MongoDB Atlas

---

## 🖥️ Graphical User Interface (GUI)

> **Note:** Replace the `image-url.png` links below with the actual paths to your screenshots (e.g., `./docs/login.png`).

### 1. Secure Authentication Portal
The gateway to the ERP. Determines role (Admin/Teacher/Student) upon successful login and routes traffic accordingly.
![Login Portal](image-url.png)

### 2. Admin Dashboard
Provides full system control. Allows administrators to create accounts, generate courses, enroll students, and safely manage database deletions.
![Admin Dashboard](image-url.png)

### 3. Teacher Dashboard
Displays real-time student rosters based on course assignments and features a secure portal for submitting grades and remarks.
![Teacher Dashboard](image-url.png)

### 4. Student Dashboard
Provides a comprehensive academic transcript with color-coded grading and real-time CGPA calculation.
![Student Dashboard](image-url.png)

---

## ⚙️ System Architecture (MVC)

The backend follows a strict **Model-View-Controller (MVC) + Service Layer** architecture.
1. **Routes:** Direct incoming HTTP traffic.
2. **Controllers:** Handle requests and responses.
3. **Services:** Contain 100% of the business logic (password hashing, DB queries).
4. **Models:** Define MongoDB data schemas.

---

## 🚀 Getting Started (Local Development)

To run this project locally, you will need to start both the frontend and backend servers.

### Prerequisites
* Node.js (v18 or higher)
* MongoDB Atlas Cluster (or local MongoDB instance)

### 1. Clone the repository
```bash
git clone [https://github.com/xenonat54/ERP_Project.git](https://github.com/xenonat54/ERP_Project.git)
cd ERP_Project

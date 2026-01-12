# 💰 MERN Expense & Budget Management App

A full-stack **MERN** application for managing expenses, budgets, and recurring payments with secure authentication, modern UI components, and efficient data handling.

---

### Project Name

![ProjectName](./screenshots/project-name.png)

## 🚀 Tech Stack

### 🎨 Frontend

- ⚛️ **React** (Vite)
- 🧭 **React Router** – Client-side routing
- 🧠 **Redux** – Global state management
- 🔄 **TanStack Query** – Server state & caching
- 📝 **React Hook Form** – Form handling
- 🎯 **React Icons** – Icon library
- 🌐 **Axios** – API communication

### 💅 UI & Styling

- 🎨 **Tailwind CSS** – Utility-first styling
- 🧩 **ShadCN UI** – Reusable UI components
- 📊 **Charts & Graphs** – Data visualization

---

## 🛠 Backend

- 🟢 **Node.js**
- 🚂 **Express.js**
- 🍃 **MongoDB** (Mongoose)

---

## 🔐 Authentication & Security

- 🔑 **JWT Authentication**
- 🛂 **Passport.js**
- 🔵 **Google OAuth 2.0**
- 🔒 **bcryptjs** – Password encryption
- 🧬 **crypto** – Secure hash/token generation
- ✅ **Express Validator** – Incoming request validation

---

## 📦 Core Features

### 🔐 Authentication & User Management

- 👤 User authentication using **JWT & Google OAuth**
- 📩 Secure signup with **OTP verification**
- 🔁 Password reset via **email OTP**
- ⚙️ User settings page:
  - Profile picture upload
  - Email, username & full name update
  - Password change

---

### 💰 Expense & Income Management

- 💸 **Expense tracking** with category & date support
- 💵 **Income tracking**
- 🔄 **Recurring expenses** management
- 📅 Automatic monthly resets for recurring expenses _(paid only)_
- 🎯 **Budgeting system**
  - Yearly budget creation
  - Monthly budget distribution

---

### ✈️ Trips & Goals

- 🧳 Create **trips** with a dedicated **trip details page**
- 📍 Track **trip-based expenses**
- 🏆 Create **savings goals**
  - With or without a deadline
  - Visual progress tracking

---

### 📊 Analytics & Insights

- 📊 Interactive analytics dashboard
- 📈 Graph-based comparisons:
  - Income vs Expenses
  - Expenses vs Budget
  - Category-wise expense tracking

#### 🕒 Global Time-Range Filter

A centralized time filter applied across expenses, income, trips, and analytics.

**Supported Ranges:**

- 📅 This Year
- 📆 This Month
- ⏳ Last 9 Months
- ⏳ Last 6 Months
- ⏳ Last 3 Months
- 🗓 Last 30 Days
- 🗓 Last 15 Days
- 🗓 Last 7 Days
- 📊 By Year _(year-wise aggregation)_
- 📈 By Month _(month-wise aggregation)_

---

### 🔔 Notifications & Reminders

- 🔔 Toast-based feedback system
- ⏰ Budget reminder on **year change**
- 📌 Recurring payment reminders:
  - Upcoming payments
  - Due today
  - Overdue payments

---

### 🖼 File & Media Handling

- 🖼 Profile picture upload & management

---

## ⏱ Scheduling & Automation

- ⏰ **node-cron**
  - 🔄 Reset recurring expenses **monthly** _(paid only)_
  - 🗓 Reset budgets **every new year**

---

## 📧 Email Services

- ✉️ **Nodemailer**
  - OTP for signup verification
  - OTP for password reset

---

## 📊 Utilities

- 📅 **Moment.js** – Date & time formatting
- 💲 **Numeral.js** – Amount & currency formatting

---

## 🌐 API & Data Flow

- 🔁 **RESTful API architecture**
- 🌍 **Axios** for frontend API calls
- 🔓 **CORS** enabled

---

## 🗂 File Uploads

- 📁 **Multer**
  - Secure profile image upload

---

## 📁 Project Structure

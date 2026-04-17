# 📱 2D Manager Frontend

<p align="center">
  <img src="https://img.shields.io/badge/React%20Native-Mobile-blue?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Django-Backend-green?style=for-the-badge&logo=django" />
  <img src="https://img.shields.io/badge/API-REST-orange?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Status-Production%20Grade-success?style=for-the-badge" />
</p>

---

# 📱 Download App (Android APK)

<p align="center">
  <a href="https://expo.dev/accounts/minkhant2938/projects/2d-manager/builds">
    <img src="https://img.shields.io/badge/📦%20Download%20APK-Expo%20EAS%20Build-blue?style=for-the-badge&logo=expo" />
  </a>
</p>

👉 Open builds page to download the latest Android APK.

---

## ⚡ Latest Build Access

All production and preview builds are managed via Expo EAS:

🔗 <https://expo.dev/accounts/minkhant2938/projects/2d-manager/builds>

- 📱 Latest Android APK available here
- 🔄 Automatically updated after each build
- 🧪 Includes preview and production builds

---

## 🚀 Installation Steps

1. Open the builds page link above
2. Select the latest successful build
3. Download the APK file
4. Install on Android device
5. Install on Android device
6. Allow “Install unknown apps” if prompted

---

# 🚀 Overview

**2D Manager** is a production-grade React Native application powered by a Django REST API backend.

It is designed for managing **2-digit lottery operations**, including:

- Daily & weekly statistics tracking
- Number management (00–99)
- Commission & resold user handling
- Sales analytics per user
- Profile & account management

The system is optimized with a **custom query-based cache layer** to reduce API calls and improve performance.

---

# ⚡ Cache Management System

A lightweight query-based caching system is used to optimize API performance.

### How it works

- Each API request is assigned a query key
- Responses are cached locally
- Cached data is reused when the same query is triggered
- Cache is invalidated on create/update/delete operations

### Benefits

- 🚀 Faster UI response
- 📉 Reduced API requests
- ⚡ Better performance under heavy usage
- 🔄 Synchronized UI state

---

# ✨ Key Features

- 📊 Real-time statistics dashboard
- 🗓️ Daily / Weekly analytics system
- 🔢 00–99 number management system
- 👥 Commission & Resold user management
- ➕ Create & edit number entries
- 📜 Number history tracking
- 🔐 Authentication system
- 👤 Profile management

---

# 📊 Manage Module

## 🗓️ Daily Overview

<p align="center">
  <img src="./screenshots/manage_1.jpg" width="45%" />
  <img src="./screenshots/manage_2.jpg" width="45%" />
</p>

- Full-day statistics
- Morning & evening breakdown
- Date picker support

---

## 📅 Weekly Overview

<p align="center">
  <img src="./screenshots/manage_3_week.jpg" width="45%" />
  <img src="./screenshots/manage_4_week.jpg" width="45%" />
</p>

- Weekly summary analytics
- Per-day breakdown
- Week navigation

---

## ✏️ Edit Section

<p align="center">
  <img src="./screenshots/manage_edit.jpg" width="45%" />
  <img src="./screenshots/manage_edit_2.jpg" width="45%" />
</p>

- Edit draw numbers
- Update lottery time slots
- Auto recalculation system

---

## 🗑️ Delete Action

<p align="center">
  <img src="./screenshots/manage_delete.jpg" width="80%" />
</p>

- Deletes section data
- Triggers automatic recalculation

---

# 🔢 Number Management System

Supports full **00–99 tracking system**.

<p align="center">
  <img src="./screenshots/normal_2d_list.jpg" width="45%" />
  <img src="./screenshots/normal_2d_list_1.jpg" width="45%" />
</p>

<p align="center">
  <img src="./screenshots/resold_2d_list.jpg" width="90%" />
</p>

### Features

- Amount tracking per number
- Support limit system
- Normal & resold modes
- Segmented control filtering

---

# 👥 User Management

## Commission & Resold Users

<p align="center">
  <img src="./screenshots/commission_users.jpg" width="45%" />
  <img src="./screenshots/resold_users.jpg" width="45%" />
</p>

- User listing system
- Create users via + button
- Role-based separation

---

## ➕ Create User

<p align="center">
  <img src="./screenshots/create_commission_user.jpg" width="80%" />
</p>

- Simple user creation form
- Commission assignment support

---

## 👤 User Details

<p align="center">
  <img src="./screenshots/commission_user_1.jpg" width="30%" />
  <img src="./screenshots/commission_user_2.jpg" width="30%" />
  <img src="./screenshots/commission_user_3.jpg" width="30%" />
</p>

<p align="center">
  <img src="./screenshots/commission_user_edit.jpg" width="45%" />
  <img src="./screenshots/delete_commission_user_1.jpg" width="45%" />
</p>

- View user analytics
- Edit & delete functionality
- Detailed activity tracking

---

# ➕ Number Creation System

<p align="center">
  <img src="./screenshots/create_number_1.jpg" width="45%" />
  <img src="./screenshots/create_number_2.jpg" width="45%" />
</p>

- Custom keyboard input
- Paste support
- Fast number entry system

---

# 📜 Number History

<p align="center">
  <img src="./screenshots/number_history_1.jpg" width="45%" />
  <img src="./screenshots/number_history_2.jpg" width="45%" />
</p>

## 📊 Format View

<p align="center">
  <img src="./screenshots/number_history_2d_format.jpg" width="80%" />
</p>

- History tracking system
- Card-based UI
- Structured data view

---

# 📊 Section Sales

- User-specific analytics
- Same logic as Manage page
- Filtered per individual user

---

# 👤 Profile System

<p align="center">
  <img src="./screenshots/profile.jpg" width="45%" />
  <img src="./screenshots/edit_profile.jpg" width="45%" />
  <img src="./screenshots/change_password.jpg" width="45%" />
</p>

- Profile editing
- Password management
- Secure account controls

---

# 🔐 Authentication

## Login

<p align="center">
  <img src="./screenshots/login.jpg" width="45%" />
</p>

## Sign Up

<p align="center">
  <img src="./screenshots/sign_in.jpg" width="45%" />
</p>

---

# 🧠 Tech Stack

- React Native
- Django REST API
- RESTful architecture
- Async state management
- Modular UI system
- Custom query-based cache layer

---

# 📌 Notes

- Production-grade architecture
- Actively developed system
- Backend handles all calculations
- Mobile-first design
- Optimized with caching for performance

---

# ⭐ Portfolio Value

This project demonstrates:

- Mobile app architecture
- Backend API integration
- Complex data management systems
- Real-time statistical computation
- Scalable UI structure
- Performance optimization techniques (cache system)

- Real-time statistical computation
- Scalable UI structure
- Performance optimization techniques (cache system)

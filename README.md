# 🎬 Cinema Seating Prototype - React Application

Welcome to the **Cinema Seating Prototype** — a dynamic, role-aware React app designed to simulate real-world cinema seat booking with a rich set of user types, seat categories, and booking constraints. 

This project demonstrates a practical approach to building an interactive UI for seat selection, user authentication, and group booking — perfect for cinema managers, developers, or anyone curious about complex UI logic in React!

---

## 🚀 Features

- **Role-Based Access:** Users can sign in as regular users, VIPs, seniors, people with disabilities, children, or admins, with customized seat access and booking permissions.
- **Dynamic Seat Layout:** Seats are categorized into VIP, Accessible, No-Children zones, and include randomly generated broken seats.
- **Group Seat Selection:** Book seats for yourself or groups (1-7 people) with automatic adjacency checks.
- **Price Calculation:** Real-time ticket pricing based on selected movie and seat count.
- **Booking Confirmation:** Clear summary modal with booking details including ticket type, seat numbers, and total cost.
- **Seat Status Visualization:** Interactive seat map showing available, booked, broken, and special seat types with intuitive color-coded legend.
- **Authentication:** Simple sign-in and sign-up forms with role selection for testing different user experiences.
- **Logout & User Role Switching:** Seamlessly log out or switch between user roles without page reload.

---

## 💻 Technologies Used

- React (Functional Components & Hooks)
- CSS for styling
- JavaScript ES6+ features
- Local state management with React useState
- Basic form handling and validation

---

## 🎨 UI Preview

![Cinema Seating Prototype](./screenshots/cinema-seating-screenshot.png)  
*Example of the seat selection interface showing different seat types and booking summary.*

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (v14 or later recommended)
- npm or yarn package manager

### Installation

```bash
git clone https://github.com/your-username/cinema-seating-prototype.git
cd cinema-seating-prototype
npm install
npm start

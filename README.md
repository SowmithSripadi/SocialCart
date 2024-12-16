# SocialCart
## Table of Contents

- [📖 About](#-about)
- [🚀 Features](#-features)
- [🛠️ Technologies](#️-technologies)
- [💻 Installation](#-installation)
- [📸 Screenshots](#-screenshots)

## 📖 About

**SocialCart** is a **collaborative e-commerce platform** designed to enhance the online shopping experience by fostering user connections and interactions. In SocialCart, users can create and join sessions where they can connect with others, share products, and engage in real-time chats. This seamless integration of social networking and e-commerce empowers users to shop together, seek recommendations, and make informed purchasing decisions collaboratively.

## 🚀 Features

- **User Authentication:** Secure sign-up and login.
- **Session Creation:** Create and join shopping sessions to collaborate with friends or other users.
- **Real-time Chat:** Communicate with other users within a session through instant messaging.
- **Product Catalog:** Browse and search through a vast range of products.
- **Responsive Design:** Optimized for both desktop and mobile devices.
- **Secure Payments:** Multiple payment gateway integrations ensuring secure transactions.

## 🛠️ Technologies

- **Frontend:** React.js, Redux, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT, OAuth 2.0 (Coming soon)
- **Real-time Communication:** Socket.io
- **Deployment:** (Coming soon) AWS, Docker.

## 💻 Installation

Follow these steps to get a local copy of the project up and running.

### Prerequisites

- [Node.js](https://nodejs.org/) 
- [MongoDB](https://www.mongodb.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [ReactJS](https://react.dev/)

### Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/SocialCart.git
   ```
2. **Install dependencies**

   ```bash
   #Server
   cd Server
   npm install
   ```
   ```bash
   #Client
   cd Client
   npm install
   ```
4. **Set up environment variables**
   ```bash
   #Client
   VITE_BACKEND_API_URL = http://localhost:8000/api
   VITE_BACKEND_URL = http://localhost:8000

   ```
   ```bash
   #Server
   MONGODB_CONNECTION_URL = PasteYourMongoDBConnectionString
   FRONTEND_HOST = http://localhost:5173
   ```
5. **Run the application**
   ```bash
   #Client
   npm run dev
   ```
   ```bash
   #Server
   npm run dev
   ```

## 📸 Screenshots

Coming soon
   

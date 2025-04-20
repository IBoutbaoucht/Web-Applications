# 🔥 Vue Chat App

A real-time chat application built using **Vue.js** and **Firebase**. Supports 1-on-1 private messaging, public and private group chatrooms, and Firebase Authentication.
---

## ✨ Features

- 🔐 Firebase Authentication (Google sign-in)
- 💬 Real-time messaging
- 🢑 Private 1-on-1 chat
- 🧵 Group chatrooms (public & private)
- 🌐 Firestore database integration
- 🔔 Live typing indicators (optional)
- 📱 Responsive design

---

## 📦 Tech Stack

- **Frontend:** Vue 3 + Vue Router + Tailwind CSS
- **Backend & Auth:** Firebase Authentication, Firestore Database
- **Hosting (optional):** Firebase Hosting or Vercel

---

## 🛠️ Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/vue-chat-app.git
   cd vue-chat-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project at [firebase.google.com](https://firebase.google.com).
   - Enable **Authentication** (Google sign-in) and **Firestore**.
   - Create a `firebaseConfig.js` file in your `src` folder with your Firebase credentials:
     ```js
     export const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_PROJECT_ID.appspot.com",
       messagingSenderId: "YOUR_SENDER_ID",
       appId: "YOUR_APP_ID"
     };
     ```

4. **Run the app locally**
   ```bash
   npm run dev
   ```

---

## 📁 Folder Structure

```
src/
├── assets/
├── components/
├── views/
├── router/
├── firebaseConfig.js
└── App.vue
```

---

## 📄 License

This project is licensed under the MIT License.

---

## ✉️ By

# Ayoub Moussaif 
# Omar Hafidi
# Walid Mamz
# Imad Boutbaoucht


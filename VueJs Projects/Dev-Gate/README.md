# 🚀 SNS DevGate

**SNS DevGate** is a professional social networking application tailored for developers to **track**, **centralize**, and **visualize** their technical growth. Whether you're a student, junior dev, freelancer, or a self-taught coder, DevGate helps you showcase your progress, projects, and goals — all in one place.

## Realised By :

  **Imad Boutbaoucht**
  **Omar Hafidi**
  **Walid Mamz**
  **Ayoub Moussaif**

## 🌐 Live Demo

👉 [Access DevGate Now](https://dev-g-59bb5.web.app)

---

## 📌 Table of Contents

- [🔍 Features](#-features)
- [👤 Target Audience](#-target-audience)
- [🛠 Tech Stack](#-tech-stack)
- [📷 Screenshots](#-screenshots)
- [🚀 Getting Started](#-getting-started)
- [📚 Project Structure](#-project-structure)
- [💡 Future Improvements](#-future-improvements)
- [📄 License](#-license)

---

## 🔍 Features

### 🛡️ Authentication
- Login/signup with **Firebase Auth**
- Supports Google, email, etc.
- Redirects to personal dashboard upon login

### 📊 Personal Dashboard
- Displays user-specific data:
  - Skills
  - Projects
  - Activity timeline
  - Technical goals

### 🧠 Skill Management
- Add skills (e.g., React, Git, Docker)
- Assign proficiency level (Beginner, Intermediate, Advanced)
- Track acquisition/progression date
- Edit/remove skills

### 🧪 Project Tracking
- Add project with:
  - Title, description, tech stack
  - GitHub link
  - Image (uploaded via Firebase Storage)
- View projects in **gallery** or **list** mode
- Edit/delete projects

### 📆 Timeline / Activity Feed
- Chronological display of:
  - New projects
  - Skill progression
  - Goal achievements
- Filterable by action type

### 🎯 Goal Setting
- Create personal technical goals (e.g., *Learn TypeScript in 30 days*)
- Manual or auto progress tracking
- Status updates (In Progress, Completed)

### 📈 Data Visualization
- Charts and counters for:
  - Monthly skill additions
  - Weekly coding hours
  - Skill levels reached
  - Projects completed

---

## 👤 Target Audience

- 🎓 Web/CS Students  
- 👩‍💻 Junior Developers  
- 🔁 Self-taught developers in career transition  
- 🧑‍💼 Freelancers tracking their evolution  

---

## 🛠 Tech Stack

### 🌐 Frontend
- **Vue.js 3**
- **JavaScript**
- **UI Frameworks**: Vuetify / TailwindCSS / BootstrapVue
- **Routing**: Vue Router

### 🗂 Components
- `Login.vue` – Authentication
- `Dashboard.vue` – User overview
- `SkillTracker.vue` – Manage skills
- `Projects.vue` – Add/view projects
- `Timeline.vue` – View activity
- `Objectives.vue` – Set & track goals

### 🔥 Backend & Database
- **Firebase**
  - Firestore (data storage)
  - Auth (authentication)
  - Storage (project images)
  - Hosting (deployment)

---

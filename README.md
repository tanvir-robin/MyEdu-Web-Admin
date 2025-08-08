# MyEdu - University Suite Admin Panel 🎓🛠️

This is the **Admin Panel** for **MyEdu - University Suite**, a web-based university management platform. It enables university administrators and faculty to manage academic and administrative operations efficiently through a feature-rich and intuitive interface.

Built using **React**, integrated with **Firebase** and **SSLCommerz**, this dashboard simplifies student management, routine scheduling, billing, and much more.
---
<p align="center" style="display: flex; justify-content: center; gap: 10px;">
  <img src="https://github.com/user-attachments/assets/8b733190-0ed9-4a01-bed9-b2c501d5835f" alt="Screenshot 1" style="height: 200px; object-fit: cover;" />
  <img src="https://github.com/user-attachments/assets/ae71c0cd-5053-46fd-8c51-f9cf171a1b9f" alt="Screenshot 2" style="height: 200px; object-fit: cover;" />
  <img src="https://github.com/user-attachments/assets/23a62bf4-e2e7-4d1f-8a7d-c0f3bdf0288a" alt="Screenshot 3" style="height: 200px; object-fit: cover;" />
</p>


---

## 📱 Main Mobile App

This repository is the **Admin Panel** for the **MyEdu** university management system.  
The main **MyEdu** mobile app, which students and faculty use, is available here:  
[https://github.com/tanvir-robin/myedu](https://github.com/tanvir-robin/myedu)

---

## 🧩 Key Features

- **📊 Dashboard Overview** – Total students, faculty, courses, and departments
- **🗓 Routines** – Manage class schedules and timetables
- **📚 Courses** – Curriculum and course structure management
- **📈 Results** – Grade management and result publication
- **📢 Notices** – Send announcements and notifications
- **💵 Academic Bills** – Manage fee collections and billing
- **👨‍🎓 All Students** – Complete student database and profiles
- **👩‍🏫 Faculty** – Faculty information and records
- **🏢 Departments** – Department-level administration
- **📊 Reports** – Analytics and insights for academic and financial data

---

## 🛠️ Tech Stack

- **React** – Frontend Framework  
- **Firebase** – Auth, Firestore, and Storage  
- **SSLCommerz** – Payment Gateway  
- **Tailwind CSS** – UI Styling

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/myedu-admin-panel.git
cd myedu-admin-panel
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Configuration

For **simplicity**, the Firebase configuration is currently **hardcoded** inside:

```
src/firebaseConfig.js
```

**Example:**

```js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "<API_KEY>",
  authDomain: "<AUTH_DOMAIN>",
  projectId: "<PROJECT_ID>",
  storageBucket: "<STORAGE_BUCKET>",
  messagingSenderId: "<SENDER_ID>",
  appId: "<APP_ID>",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
```

> 🔐 **Important:** In production environments, always store sensitive keys and config variables in an `.env` file to avoid exposing them in public repositories.

---

### 4. Start the Development Server

```bash
npm start
```

---


## 🙋‍♂️ About Me

Hi, I'm **Tanvir Robin**, a passionate developer focused on building impactful digital solutions for education and beyond.

- 🔗 **Portfolio:** [tanvirrobin.dev](https://tanvirrobin.dev)
- 💼 **LinkedIn:** [linkedin.com/in/tanvir-robin](https://linkedin.com/in/tanvirrobin)

To know more about my work, projects, and experience, please visit my portfolio or connect with me on LinkedIn!
---

## 📫 Contact

For feedback, support, or contributions:  
**📩 contact@tanvirrobin.dev**

---

## 📝 License

This project is licensed under the [MIT License](LICENSE).

---

> © 2025 Tanvir Robin — All rights reserved.

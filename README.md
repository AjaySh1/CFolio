# 🧠 CPTracker

**CPTracker** is a full-stack web application that helps you **track**, **visualize**, and **analyze** your competitive programming progress across major platforms — **LeetCode**, **Codeforces**, and **CodeChef**.

## 🚀 Features

### 👤 User
- 🔐 Secure signup/login with JWT authentication  
- 🧾 Profile management with coding handles and social links  
- 📈 Dashboard to view CP stats, ratings, and submission activity  
- 📅 Heatmap calendar showing your daily submission patterns  
- ⚙️ Responsive and dark-mode friendly UI  

### 🔗 Platform Integrations
- ✅ LeetCode stats and submissions  
- ✅ Codeforces contests, ratings, and submissions  
- ✅ CodeChef problems and activity  

## 🛠️ Tech Stack

| Layer        | Technologies |
|--------------|--------------|
| **Frontend** | React, Tailwind CSS, Framer Motion, React Router |
| **Backend**  | Node.js, Express.js, MongoDB, Mongoose |
| **Auth**     | JWT-based authentication, custom context |
| **API Layer**| Public APIs + custom scraping services |

## 📁 Project Structure

CFolio/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── node_modules/
│   ├── routes/
│   ├── services/
│   ├── .env
│   ├── db.js
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── node_modules/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── router.jsx
│   ├── .env
│   ├── eslint.config.js
│   ├── index.html
│   └── package-lock.json
│
├── README.md
└── package.json

---

## ⚙️ Environment Variables

### Backend (`CFolio/backend/.env`)
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Frontend (`CFolio/frontend/.env`)
```
VITE_BACKEND_URL=http://localhost:5000
```

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/AjaySh1/CFolio.git
cd CFolio
```

### 2. Setup Backend

```bash
cd CFolio/backend
npm install
# Create a .env file with your MongoDB URI and JWT secret
npm start
```

### 3. Setup Frontend

```bash
cd ../frontend
npm install
# Create a .env file with VITE_BACKEND_URL pointing to your backend (e.g., http://localhost:5000)
npm run dev
```

---

## 🖥️ Usage

- Visit `http://localhost:5173` (or the port shown in your terminal).
- Sign up or log in.
- Fill out your profile with your CP handles.
- Explore your dashboard and stats!

---

## 🧑‍💻 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📜 License

[MIT](LICENSE)

---

## 🙏 Acknowledgements

- [LeetCode API](https://leetcode.com)
- [Codeforces API](https://codeforces.com/api)
- [CodeChef API](https://www.codechef.com)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)

---

> Made with ❤️ for competitive programmers!

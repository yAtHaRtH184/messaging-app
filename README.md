# Messaging App 💬

A real-time chat application built using **Spring Boot, WebSockets, JWT authentication, and React (Vite)**.

---

## 🚀 Tech Stack

* **Frontend:** React (Vite)
* **Backend:** Spring Boot
* **Database:** PostgreSQL (Docker)
* **Authentication:** JWT
* **Realtime:** WebSockets

---

## ⚙️ Setup Instructions

### 1. Clone Repo

```bash
git clone https://github.com/your-username/messaging-app.git
cd messaging-app
```

---

### 2. Setup Environment Variables

Create `.env` file in root:

```env
POSTGRES_DB=your_db
POSTGRES_USER=your_user
POSTGRES_PASSWORD=your_password
```

---

### 3. Run Database (Docker)

```bash
cd docker
docker-compose up
```

---

### 4. Run Backend

```bash
cd backend
./mvnw spring-boot:run
```

---

### 5. Run Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## ✨ Features

* User authentication (JWT)
* Real-time messaging (WebSockets)
* Chat rooms
* Clean UI with React

---

## 📌 Future Improvements

* Deployment (AWS / Railway)
* Message persistence optimization
* Notifications

---

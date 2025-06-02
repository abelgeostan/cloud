# StanDrive — Personal Cloud Drive Application

StanDrive is a full-stack personal cloud drive application that allows users to securely upload, view, and manage their files from anywhere. Built with a Spring Boot backend and a React frontend, StanDrive brings Google Drive-like features to a self-hosted environment.

---

## 🌐 Tech Stack

- **Backend**: Spring Boot, Spring Security, JPA, H2/PostgreSQL
- **Frontend**: React, Axios, React Router
- **Authentication**: JWT-based authentication
- **Others**: Docker (for deployment), Maven, Postman (API testing)

---

## 📁 Features

- 🔐 User Authentication (Register/Login)
- 📤 Upload Files
- 📄 View and Download Files
- ❌ Delete Files
- 📋 List All Files
- 🧑‍💼 Role-based Access Support (Admin/User)

---

## 🛠️ Running Locally

### 1. Clone the repository
```bash
git clone https://github.com/your-username/standrive.git
cd standrive

2. Start the Backend

cd cloud_backend
./mvnw spring-boot:run

3. Start the Frontend

cd cloud_frontend
npm install
npm start

The app will be running at http://localhost:3000.


---

🧪 Testing

Use Postman to test backend APIs

Frontend supports file uploads and viewing file lists via the UI



---

🐳 Docker Support (Coming Soon)

Docker support for both frontend and backend will allow one-click deployment to any server.


---


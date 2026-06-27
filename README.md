# Employee Management System

A full-stack Employee Management System built with **Spring Boot**, **Angular**, **MySQL**, **JWT Authentication**, **Role-Based Access Control**, **Google OAuth2 Login**, and **Forgot Password Email Reset Flow**.

This project is designed as a professional portfolio project to demonstrate secure authentication, employee CRUD operations, role-based permissions, REST API development, frontend integration, and production-ready coding practices.

---

## Features

### Authentication & Security

* User Registration
* JWT-based Login
* Secure Password Encryption using BCrypt
* Role-Based Access Control
* Admin/User Authorization
* Protected Angular Routes
* JWT Interceptor
* Google OAuth2 Login
* Forgot Password via Email Reset Link
* Reset Password with Token Expiry
* Secure environment-variable based secret management

### Employee Management

* Add Employee
* View Employee List
* Edit Employee
* Delete Employee
* Search Employees
* Backend Pagination
* Frontend Pagination Integration
* Admin-only Add/Edit/Delete controls
* User read-only access

### Frontend

* Angular standalone components
* Reactive Forms
* Form Validation
* Premium SweetAlert2 Popups
* Responsive UI
* Loader states
* Password show/hide toggle
* Dashboard and navigation flow

---

## Tech Stack

### Backend

* Java 17
* Spring Boot
* Spring Security
* Spring Data JPA
* MySQL
* JWT
* Google OAuth2
* Java Mail Sender
* Maven
* Swagger/OpenAPI

### Frontend

* Angular
* TypeScript
* HTML
* CSS
* Reactive Forms
* SweetAlert2

### Database

* MySQL

---

## Project Structure

```text
employee-management-system/
│
├── src/
│   └── main/
│       ├── java/com/mdnabi/ems/
│       │   ├── controller/
│       │   ├── dto/
│       │   ├── entity/
│       │   ├── repository/
│       │   ├── security/
│       │   └── service/
│       │
│       └── resources/
│           └── application.properties
│
├── frontend/
│   └── src/app/
│       ├── core/
│       └── pages/
│
├── screenshots/
├── pom.xml
└── README.md
```

---

## Screenshots

### Login Page

![Login Page](screenshots/login-page.png)

### Register Page

![Register Page](screenshots/register-page.png)

### Dashboard

![Dashboard](screenshots/dashboard-page.png)

### Employees List

![Employees List](screenshots/employees-list.png)

### Add Employee

![Add Employee](screenshots/add-employee.png)

### Edit Employee

![Edit Employee](screenshots/edit-employee.png)

### Forgot Password

![Forgot Password](screenshots/forgot-password.png)

### Reset Password

![Reset Password](screenshots/reset-password.png)

### Google Login

![Google Login](screenshots/google-login.png)

---

## API Endpoints

### Authentication

| Method | Endpoint                       | Description                 |
| ------ | ------------------------------ | --------------------------- |
| POST   | `/api/auth/register`           | Register a new user         |
| POST   | `/api/auth/login`              | Login and receive JWT token |
| POST   | `/api/auth/forgot-password`    | Send password reset email   |
| POST   | `/api/auth/reset-password`     | Reset password using token  |
| GET    | `/oauth2/authorization/google` | Start Google OAuth2 login   |

### Employees

| Method | Endpoint              | Description                              |
| ------ | --------------------- | ---------------------------------------- |
| GET    | `/api/employees`      | Get employees with search and pagination |
| GET    | `/api/employees/{id}` | Get employee by ID                       |
| POST   | `/api/employees`      | Create employee                          |
| PUT    | `/api/employees/{id}` | Update employee                          |
| DELETE | `/api/employees/{id}` | Delete employee                          |

---

## Environment Variables

Create a local env file outside the project, for example:

```bash
~/.ems-env
```

Add your local configuration:

```bash
export DB_USERNAME="root"
export DB_PASSWORD="your-db-password"
export JWT_SECRET="your-jwt-secret"

export GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
export GOOGLE_CLIENT_SECRET="your-google-client-secret"

export MAIL_USERNAME="your-email@gmail.com"
export MAIL_PASSWORD="your-gmail-app-password"
export APP_RESET_PASSWORD_URL="http://localhost:4200/reset-password"
```

Load environment variables before running the backend:

```bash
source ~/.ems-env
```

---

## Backend Setup

Go to the project root:

```bash
cd employee-management-system
```

Load environment variables:

```bash
source ~/.ems-env
```

Run backend:

```bash
./mvnw spring-boot:run
```

Backend will run on:

```text
http://localhost:8080
```

Swagger/OpenAPI:

```text
http://localhost:8080/swagger-ui.html
```

---

## Frontend Setup

Go to frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run Angular app:

```bash
npm start
```

Frontend will run on:

```text
http://localhost:4200
```

---

## Database Setup

Create MySQL database:

```sql
CREATE DATABASE employee_management_db;
```

The application uses Hibernate auto-update:

```properties
spring.jpa.hibernate.ddl-auto=update
```

---

## Roles

### ADMIN

* Can view employees
* Can add employees
* Can edit employees
* Can delete employees
* Can access admin-protected routes

### USER

* Can view employees
* Cannot add, edit, or delete employees
* Cannot access admin-only routes

---

## Security Highlights

* Passwords are encrypted using BCrypt
* JWT token is used for protected APIs
* Role is included in JWT claims
* Angular stores token and role in localStorage
* Admin-only frontend routes are protected using route guards
* Google OAuth2 login creates or authenticates users securely
* Forgot Password uses email reset token with expiry
* Secrets are managed through environment variables

---

## Recent Major Features

* JWT Authentication
* Role-Based UI Control
* Search and Pagination
* Google OAuth2 Login
* Forgot Password Email Reset Flow
* Angular Forgot Password and Reset Password Pages

---

## Author

**MD. Nabi Alam**
Java Full Stack Developer

* Email: [nabisiddiquee@gmail.com](mailto:nabisiddiquee@gmail.com)
* GitHub: https://github.com/nabisiddiquee
* LinkedIn: Add your LinkedIn profile link here

---

## Project Status

This project is actively maintained and built as a full-stack portfolio project.

# 🔐 Auth System — Raw SQL Version (No Entity Framework)

A full-stack User Authentication System built with **React.js**, **.NET Core 8 Web API**, and **MySQL** using **raw SQL** (MySqlConnector) — no ORM, no Entity Framework.

---

## 📦 Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18 + Vite + React Router v6   |
| HTTP       | Axios                               |
| Backend    | .NET Core 8 Web API                 |
| Auth       | JWT Bearer Tokens (HS256)           |
| Hashing    | BCrypt.Net                          |
| Database   | MySQL 8                             |
| DB Driver  | **MySqlConnector** (raw SQL, no ORM)|
| Docs       | Swagger / OpenAPI                   |

> **Key difference from the EF Core version:**  
> There is no `DbContext`, no migrations, no LINQ-to-SQL.  
> All database operations are plain `MySqlCommand` + `MySqlDataReader` in `UserRepository.cs`.

---

## 📁 Folder Structure

```
auth-system-raw/
├── frontend/                    # React application (identical to EF version)
│   └── src/
│       ├── pages/               # Register, Login, Dashboard
│       ├── components/          # ProtectedRoute
│       ├── context/             # AuthContext (global state)
│       └── services/            # api.js (Axios instance + JWT attach)
├── backend/
│   ├── Controllers/
│   │   ├── AuthController.cs    # POST /api/auth/register & /login
│   │   └── UserController.cs    # GET  /api/user/profile  [Authorize]
│   ├── Data/
│   │   ├── DatabaseHelper.cs    # Opens MySqlConnection, EnsureTablesCreated
│   │   └── UserRepository.cs    # All raw SQL: FindByEmail, FindById, Create, GetAll
│   ├── Models/
│   │   └── User.cs              # User entity + DTOs
│   ├── Services/
│   │   └── JwtService.cs        # JWT generation & validation
│   └── Program.cs               # Middleware: Auth, JWT, CORS, Swagger
└── database/
    └── schema.sql               # MySQL table definitions
```

---

## ⚙️ Setup Steps

### 1. Database (MySQL)

```sql
-- Option A: run the script
source database/schema.sql;

-- Option B: the app auto-creates the table on first startup
-- (uses CREATE TABLE IF NOT EXISTS inside DatabaseHelper.EnsureTablesCreatedAsync)
```

### 2. Backend (.NET Core)

```bash
cd backend

# 1. Set your MySQL password in appsettings.json:
#    "DefaultConnection": "Server=localhost;Database=authdb;User=root;Password=YOUR_PASSWORD;"

dotnet restore
dotnet run

# API:     https://localhost:7001
# Swagger: https://localhost:7001/swagger
```

### 3. Frontend (React)

```bash
cd frontend
npm install
npm run dev
# App: http://localhost:5173
```

---

## 🔗 API Endpoints

| Method | Endpoint             | Auth Required | Description             |
|--------|----------------------|---------------|-------------------------|
| POST   | `/api/auth/register` | No            | Register a new user     |
| POST   | `/api/auth/login`    | No            | Login, receive JWT      |
| GET    | `/api/user/profile`  | Yes (Bearer)  | Get logged-in user info |
| GET    | `/api/user/all`      | Yes (Admin)   | List all users          |

---

## 🗄️ Raw SQL — How It Works

All queries live in `Data/UserRepository.cs`. No LINQ, no ORM magic:

```csharp
// Find user by email
cmd.CommandText = @"
    SELECT Id, Name, Email, PasswordHash, Role, CreatedAt
    FROM   Users
    WHERE  Email = @Email
    LIMIT  1";
cmd.Parameters.AddWithValue("@Email", email);

// Insert new user
cmd.CommandText = @"
    INSERT INTO Users (Name, Email, PasswordHash, Role)
    VALUES (@Name, @Email, @PasswordHash, @Role);
    SELECT LAST_INSERT_ID();";
```

Parameterised queries prevent SQL injection. `MySqlException` with code `1062` handles duplicate-email conflicts at the DB level.

---

## 🔒 Security

- Passwords hashed with **BCrypt** (work factor 11)
- JWT signed with **HMAC-SHA256**, expires in 60 min (or 30 days for Remember Me)
- Protected routes use `[Authorize]` attribute + `app.UseAuthentication()`
- All queries use `@param` placeholders — no string concatenation
- CORS restricted to dev origins only

---

## 📬 Request / Response Examples

### POST `/api/auth/register`
```json
{ "name": "Jane Doe", "email": "jane@example.com", "password": "secret123" }
// 201 → { "message": "User registered successfully." }
// 409 → { "message": "Email is already registered." }
```

### POST `/api/auth/login`
```json
{ "email": "jane@example.com", "password": "secret123", "rememberMe": false }
// 200 → { "token": "eyJ...", "name": "Jane Doe", "email": "...", "role": "User", "expiresAt": "..." }
// 401 → { "message": "Invalid email or password." }
```

### GET `/api/user/profile`
```
Authorization: Bearer <token>
// 200 → { "id": 1, "name": "Jane Doe", "email": "...", "role": "User", "createdAt": "..." }
```

---

## 🧪 Postman Testing

Import `AuthSystem.postman_collection.json` and run:
1. **Register User** → expect 201
2. **Register Duplicate** → expect 409
3. **Login Valid** → expect 200 + token (auto-saved to `{{token}}`)
4. **Login Wrong Password** → expect 401
5. **Get Profile** (uses `{{token}}`) → expect 200
6. **Get Profile No Token** → expect 401

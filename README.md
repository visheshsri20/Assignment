# PropEquity Assignment 


## Tech Stack

| Layer        | Technology |
|-------------|-----------|
| Frontend     | React 18, Vite, React Router v6 |
| HTTP Client  | Axios |
| Backend      | .NET 8 Web API |
| Authentication | JWT  |
| Password Hashing | BCrypt |
| Database     | MySQL 8 |
| DB Driver    | MySqlConnector |


---
## Project Structure

auth-system-raw/
├── frontend/
│   └── src/
│       ├── pages/
│       ├── components/
│       ├── context/
│       └── services/
│
├── backend/
│   ├── Controllers/
│   ├── Data/
│   ├── Models/
│   ├── Services/
│   └── Program.cs
│
└── database/
    └── schema.sql

---

## Setup Instructions

### Database Setup

Option 1:
source database/schema.sql;

Option 2:
Application auto-creates tables on startup.

---

### Backend Setup

cd backend

Update appsettings.json:

{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=authdb;User=root;Password=YOUR_PASSWORD;"
  }
}

Run:

dotnet restore
dotnet run

API: https://localhost:7001
Swagger: https://localhost:7001/swagger

---

### Frontend Setup

cd frontend
npm install
npm run dev



---

## API Endpoints

| Method | Endpoint             | Auth | Description |
|--------|----------------------|------|-------------|
| POST   | /api/auth/register   | No   | Register user |
| POST   | /api/auth/login      | No   | Login |
| GET    | /api/user/profile    | Yes  | Get user profile |
| GET    | /api/user/all        | Yes  | Get all users |

---

## Script for stored procedures

USE PropEquityAuth;

DELIMITER $$

CREATE PROCEDURE UDSP_CREATE_USER(
    IN p_Name         VARCHAR(100),
    IN p_Email        VARCHAR(100),
    IN p_PasswordHash VARCHAR(255),
    IN p_Role         VARCHAR(20)
)
BEGIN
    INSERT INTO Users (Name, Email, PasswordHash, Role)
    VALUES (p_Name, p_Email, p_PasswordHash, p_Role);

    SELECT LAST_INSERT_ID() AS NewUserId;
END$$

CREATE PROCEDURE UDSP_GET_USER_BY_EMAIL(
    IN p_Email VARCHAR(100)
)
BEGIN
    SELECT Id, Name, Email, PasswordHash, Role, CreatedAt
    FROM Users
    WHERE Email = p_Email
    LIMIT 1;
END$$

CREATE PROCEDURE UDSP_GET_USER_BY_ID(
    IN p_Id INT
)
BEGIN
    SELECT Id, Name, Email, Role, CreatedAt
    FROM Users
    WHERE Id = p_Id
    LIMIT 1;
END$$

CREATE PROCEDURE UDSP_CHECK_EMAIL_EXISTS(
    IN p_Email VARCHAR(100)
)
BEGIN
    SELECT COUNT(*) AS EmailCount
    FROM Users
    WHERE Email = p_Email;
END$$

CREATE PROCEDURE UDSP_GET_ALL_USERS()
BEGIN
    SELECT Id, Name, Email, PasswordHash, Role, CreatedAt
    FROM Users
    ORDER BY CreatedAt DESC;
END$$

DELIMITER ;

## Security

- BCrypt password hashing
- JWT authentication 
- Token expiration handling
- Parameterized queries
- Protected routes using authorization middleware

---

## Testing

Postman scenarios:
1. Register user
2. Duplicate registration
3. Login success
4. Login failure
5. Get profile with token
6. Get profile without token

---

## Screenshots

<img width="1919" height="908" alt="image" src="https://github.com/user-attachments/assets/46d834b4-f164-4fa9-b7cc-636351ca93c0" />

<img width="1919" height="913" alt="image" src="https://github.com/user-attachments/assets/7c16ff66-9faf-4748-86ba-7e93b4f9e79f" />

<img width="1919" height="923" alt="image" src="https://github.com/user-attachments/assets/ed01f85e-bd07-4e7f-b033-0641b8a16de7" />








# Auth System — Raw SQL Implementation

A production-ready full-stack user authentication system built with React.js, .NET 8 Web API, and MySQL. This project uses raw SQL via MySqlConnector instead of an ORM, providing full control over database operations and query execution.

---

## Overview

This project demonstrates how to implement a secure authentication system without relying on Entity Framework or any ORM abstraction. All database interactions are performed using parameterized SQL queries.

Key benefits:
- Full control over SQL queries
- Better understanding of database operations
- No hidden ORM overhead
- Explicit and predictable performance

---

## Tech Stack

| Layer          | Technology |
|----------------|-----------|
| Frontend       | React 18, Vite, React Router v6 |
| HTTP Client    | Axios |
| Backend        | .NET 8 Web API |
| Authentication | JWT (HMAC-SHA256) |
| Password Hash  | BCrypt |
| Database       | MySQL 8 |
| DB Driver      | MySqlConnector (raw SQL) |
| API Docs       | Swagger / OpenAPI |

---

## Architecture

This project intentionally avoids ORM-based patterns.

Not used:
- Entity Framework
- DbContext
- LINQ-to-SQL
- Migrations

Instead, all database operations are implemented using:
- MySqlCommand
- MySqlDataReader

This ensures complete visibility and control over how queries are executed.

---

## Project Structure

auth-system-raw/
├── frontend/
│   └── src/
│       ├── pages/         # Login, Register, Dashboard
│       ├── components/    # Route protection
│       ├── context/       # Authentication state
│       └── services/      # API calls and Axios config
│
├── backend/
│   ├── Controllers/       # API endpoints
│   ├── Data/              # DB connection and SQL queries
│   ├── Models/            # Entities and DTOs
│   ├── Services/          # JWT logic
│   └── Program.cs         # Middleware and configuration
│
└── database/
    └── schema.sql         # Database schema

---

## Setup Instructions

### Database Setup

Option 1: Run schema manually

```sql
source database/schema.sql;

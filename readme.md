# 🏫 School Management  API (Node.js + MySQL)

This is a backend API built using **Node.js**, **Express**, and **MySQL** for managing schools and retrieving them based on geographical proximity. It supports:

- Adding schools with their location (latitude & longitude)
- Listing all schools sorted by how near they are to a given location

---

## 🔧 Technologies Used

- **Node.js**: JavaScript runtime
- **Express**: Web framework for Node.js
- **MySQL2**: Node.js driver for MySQL database
- **dotenv**: To manage environment variables securely

---

## 📂 Folder Structure
```
school-api/
├── node_modules/          
├── routes/
│   └── schoolRoutes.js
├── sql/
│   └── init.sql              
├── .env                      
├── .env.example              
├── db.js                     
├── index.js                  
├── package.json             
├── package-lock.json         
├── README.md                 
```

---

## 🗃️ Database Schema

Run the `sql/init.sql` file to create your database:

```sql
CREATE DATABASE IF NOT EXISTS school_db;

USE school_db;

CREATE TABLE IF NOT EXISTS schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL
);
```

## 📘 School Table Schema

Each record in the `schools` table contains the following fields:

| Field      | Type              | Description                          |
|------------|-------------------|--------------------------------------|
| `id`       | INT (Auto Increment, Primary Key) | Unique identifier for each school |
| `name`     | VARCHAR            | Name of the school                   |
| `address`  | TEXT               | Full address of the school           |
| `latitude` | DECIMAL(10, 8)     | Geographical latitude of the school  |
| `longitude`| DECIMAL(11, 8)     | Geographical longitude of the school |

> 📍 `latitude` and `longitude` are used to calculate geographical proximity between schools.

## 📡 API Documentation

### 1️⃣ POST `/addSchool`
➕ **Add a new school to the database**

- **Method:** `POST`  
- **Content-Type:** `application/json`

---

### ✅ Request Body Example:

```json
{
  "name": "Springdale High School",
  "address": "Sector 45, Gurgaon",
  "latitude": 28.4595,
  "longitude": 77.0266
}
```
---

### 🧠 How It Works:
- Validates that all required fields (`name`, `address`, `latitude`, `longitude`) are present.
- Inserts the new school into the `schools` table using a **parameterized query** to prevent SQL injection.

---

### 🔁 Success Response:

```json
{
  "message": "School added successfully"
}
```
### 2️⃣ GET `/listSchools?lat=LAT&lng=LNG`
📍 **Get all schools sorted by distance from a given location**

- **Method:** `GET`  
- **Query Parameters:**
  - `lat`: Latitude of the current user (required)
  - `lng`: Longitude of the current user (required)

---

### ✅ Example Request:
```bash
GET /listSchools?lat=28.456&lng=77.044
```
---

### 🧠 How It Works:
- The API receives your `latitude` and `longitude` as query parameters.
- It calculates the distance between your coordinates and each school's coordinates using the **Haversine Formula**.
- A `distance` field is added to each school object in the response.
- The schools are sorted by distance in **ascending order** (nearest schools first).

---

### 📦 Response Format:

```json
[
  {
    "id": 1,
    "name": "Springdale High School",
    "address": "Sector 45, Gurgaon",
    "latitude": 28.4595,
    "longitude": 77.0266,
    "distance": 1.78
  },
  {
    "id": 2,
    "name": "Blue Bells School",
    "address": "Sector 14, Gurgaon",
    "latitude": 28.4597,
    "longitude": 77.034,
    "distance": 2.10
  }
]
```
---

### 📐 Haversine Formula (How Distance Is Calculated)

To calculate the distance between two points on the Earth's surface using their latitude and longitude, the **Haversine Formula** is used:

```text
d = 2 * r * asin(
      √(sin²((lat2 - lat1) / 2) + 
         cos(lat1) * cos(lat2) * sin²((lng2 - lng1) / 2))
    )
```
 ## Deployment

You can view the live version of this application by clicking on the following link:

[Live Application](https://school-management-api-n8gk.onrender.com)

# User Management API

## Features

- CRUD operations for users
- Request validation and error handling
- Horizontal scaling using Node.js Cluster API
- Environment-based configuration
- Basic API test scenarios
- UUID validation

---

## Requirements

- Node.js (v22.14.0 or upper)

---

## Installation

1. **Clone the repository**

```bash
git clone https://github.com/potatosim/CRUD-api.git
git checkout development
```

2. **Install dependencies**

```bash
npm install
```

---

## Running the Application

### Development Mode

Uses `ts-node-dev` :

```bash
npm run start:dev
```

### Production Mode

Builds the application and runs the bundled JavaScript:

```bash
npm run start:prod
```

### Multi-Instance Mode (Horizontal Scaling)

Runs the app using Node.js Cluster API with a load balancer:

```bash
npm run start:multi
```

> This starts a load balancer on `BALANCER_PORT=4000`, and worker instances on `BALANCER_PORT+1`, `BALANCER_PORT+2`, etc.

### Production Multi-Instance Mode

Builds the application and runs the app using Cluster API with a load balancer:

```bash
npm run start:multi-prod
```

---

## Testing

```bash
npm run test
```

---

## Example Scenario:

1. `GET /api/users` — should return an empty array initially.
2. `POST /api/users` — creates a new user.
3. `GET /api/users/{userId}` — retrieves the created user.
4. `PUT /api/users/{userId}` — updates the user and returns updated data.
5. `DELETE /api/users/{userId}` — deletes the user.
6. `GET /api/users` — should return an empty array after deletion.

---

## API Usage

BaseURL:

```
http://localhost:<PORT>/api/users
```

> `PORT` value is stored in the `.env` file.

## Notes

- Invalid UUIDs, Invalid data return `400`.
- Non-existent endpoints return `404`.
- Server errors return `500` .

---

## Endpoints

### GET `/api/users`

- **Description**: Retrieve all user records.
- **Response**:
  - `200 OK`: Returns an array of user objects.

---

### GET `/api/users/{userId}`

- **Description**: Retrieve a single user by ID.
- **Responses**:
  - `200 OK`: Returns the user object.
  - `400 Bad Request`: `userId` is not a valid UUID.
  - `404 Not Found`: User with the specified `userId` does not exist.

---

### POST `/api/users`

- **Description**: Create a new user.
- **Request Body** (JSON):

```json
{
  "username": "string",
  "age": number,
  "hobbies": ["string"]
}
```

- `username`: Required.
- `age`: Required.
- `hobbies`: Required array of strings (can be empty).

- **Responses**:
  - `201 Created`: Returns the newly created user object.
  - `400 Bad Request`: Missing required fields/Invalid fields/data.

---

### PUT `/api/users/{userId}`

- **Description**: Update an existing user .
- **Request Body** (JSON)

```json
{
  "username": "string",
  "age": number,
  "hobbies": ["string"]
}
```

- `username`: optional.
- `age`: optional.
- `hobbies`: optional.

- **Responses**:
  - `200 OK`: Returns the updated user object.
  - `400 Bad Request`: `userId` is not a valid UUID/Invalid fields/data.
  - `404 Not Found`: User with the specified `userId` does not exist.

---

### DELETE `/api/users/{userId}`

- **Description**: Delete a user by ID.
- **Responses**:
  - `204 No Content`: User deleted successfully.
  - `400 Bad Request`: `userId` is not a valid UUID.
  - `404 Not Found`: User with the specified `userId` does not exist.

---

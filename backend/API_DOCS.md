# 🔐 TalentHub Authentication API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication Endpoints

### 1. User Registration
**POST** `/auth/register`

Register a new user (developer or employer).

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "DEVELOPER", // or "EMPLOYER"
  "bio": "Full-stack developer with 5 years of experience",
  "location": "San Francisco, CA",
  "skills": ["JavaScript", "React", "Node.js"],
  "experience": "5 years in web development",
  "education": "BS Computer Science",
  "website": "https://johndoe.dev",
  "github": "johndoe",
  "linkedin": "johndoe"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "user_id_here",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "DEVELOPER",
    "bio": "Full-stack developer with 5 years of experience",
    "location": "San Francisco, CA",
    "skills": ["JavaScript", "React", "Node.js"],
    "experience": "5 years in web development",
    "education": "BS Computer Science",
    "website": "https://johndoe.dev",
    "github": "johndoe",
    "linkedin": "johndoe",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt_token_here"
}
```

### 2. User Login
**POST** `/auth/login`

Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "user_id_here",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "DEVELOPER",
    // ... other user fields
  },
  "token": "jwt_token_here"
}
```

### 3. Get User Profile
**GET** `/auth/profile`

Get the current user's profile (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "user": {
    "id": "user_id_here",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "DEVELOPER",
    // ... other user fields
  }
}
```

### 4. Update User Profile
**PUT** `/auth/profile`

Update the current user's profile (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "bio": "Updated bio text",
  "location": "New York, NY",
  "skills": ["JavaScript", "React", "Node.js", "TypeScript"]
}
```

**Response (200):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "user_id_here",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "DEVELOPER",
    "bio": "Updated bio text",
    "location": "New York, NY",
    "skills": ["JavaScript", "React", "Node.js", "TypeScript"],
    // ... other updated fields
  }
}
```

### 5. Logout
**POST** `/auth/logout`

Logout the current user (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "message": "Logout successful",
  "note": "Token has been invalidated on the client side"
}
```

### 6. Refresh Token
**POST** `/auth/refresh`

Check if the current token is still valid (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "message": "Token is still valid",
  "expiresIn": "7 days"
}
```

### 7. Health Check
**GET** `/auth/health`

Check the authentication service health.

**Response (200):**
```json
{
  "status": "OK",
  "service": "Authentication Service",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Error Responses

### Validation Error (400)
```json
{
  "error": "Validation error",
  "details": [
    {
      "field": "email",
      "message": "\"email\" must be a valid email",
      "value": "invalid-email"
    }
  ]
}
```

### Authentication Error (401)
```json
{
  "error": "Access token required",
  "message": "Please provide a valid authentication token"
}
```

### User Already Exists (409)
```json
{
  "error": "User already exists with this email"
}
```

### Internal Server Error (500)
```json
{
  "error": "Internal server error during registration"
}
```

## Authentication

All protected endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## Token Expiration

JWT tokens expire after 7 days. When a token expires, the user will receive a 401 error and must login again to get a new token.

## Testing

You can test the authentication endpoints using the provided test script:

```bash
cd backend
npm run test:auth
```

This will run comprehensive tests on all authentication endpoints.

## Security Features

- **Password Hashing**: Passwords are hashed using bcrypt with 12 salt rounds
- **JWT Tokens**: Secure JSON Web Tokens for authentication
- **Input Validation**: Comprehensive validation using Joi
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS Protection**: Configured CORS for security
- **Helmet**: Security headers middleware
- **Role-Based Access**: Different user roles (DEVELOPER, EMPLOYER)

## Next Steps

The following endpoints are planned for implementation:
- `/api/jobs` - Job management (CRUD operations)
- `/api/applications` - Job application management
- `/api/users` - User management and search

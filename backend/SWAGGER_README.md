# 📚 TalentHub API Documentation with Swagger

## 🚀 **Overview**

TalentHub now includes comprehensive API documentation using **Swagger/OpenAPI 3.0**. This provides an interactive, user-friendly interface for developers to understand and test our API endpoints.

## 🌐 **Access Points**

### **Swagger UI (Interactive Documentation)**
```
http://localhost:5000/api-docs
```

### **OpenAPI JSON Specification**
```
http://localhost:5000/api-docs.json
```

## ✨ **Features**

- **Interactive API Testing** - Test endpoints directly from the browser
- **Request/Response Examples** - Pre-filled examples for all endpoints
- **Authentication Support** - JWT token management in Swagger UI
- **Schema Validation** - Complete request/response schemas
- **Error Documentation** - All possible error responses documented
- **Search & Filter** - Easy navigation through endpoints

## 🔧 **Setup Instructions**

### **1. Install Dependencies**
```bash
cd backend
npm install
```

### **2. Start the Server**
```bash
npm run dev
```

### **3. Access Documentation**
Open your browser and navigate to:
```
http://localhost:5000/api-docs
```

## 📖 **How to Use Swagger UI**

### **1. Authentication**
1. Click the **"Authorize"** button at the top
2. Enter your JWT token in the format: `Bearer YOUR_TOKEN_HERE`
3. Click **"Authorize"**
4. Close the modal

### **2. Testing Endpoints**
1. **Expand** any endpoint you want to test
2. Click **"Try it out"**
3. **Fill in** the required parameters
4. Click **"Execute"**
5. View the **response** and **status code**

### **3. Request Examples**
- Each endpoint includes **pre-filled examples**
- **Copy/paste** examples for quick testing
- **Modify** examples to test different scenarios

## 🔐 **Authentication in Swagger**

### **Getting a JWT Token**
1. Use the **`/auth/register`** or **`/auth/login`** endpoint
2. Copy the `token` from the response
3. Click **"Authorize"** in Swagger UI
4. Enter: `Bearer YOUR_TOKEN_HERE`

### **Protected Endpoints**
- Endpoints requiring authentication show a **lock icon** 🔒
- Use the **Authorize** button to set your token
- All subsequent requests will include the token automatically

## 📋 **Documented Endpoints**

### **Authentication Endpoints**
- `POST /auth/register` - User registration
- `POST /auth/login` - User authentication
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update user profile
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Token validation
- `GET /auth/health` - Service health check

## 🧪 **Testing with Swagger**

### **1. Test User Registration**
```json
{
  "email": "test@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "DEVELOPER",
  "bio": "Full-stack developer",
  "location": "San Francisco, CA",
  "skills": ["JavaScript", "React", "Node.js"]
}
```

### **2. Test User Login**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

### **3. Test Protected Endpoints**
- After login, copy the JWT token
- Click **"Authorize"** and enter: `Bearer YOUR_TOKEN`
- Test protected endpoints like `/auth/profile`

## 🔍 **Schema Definitions**

### **User Schema**
- Complete user object structure
- All field types and constraints
- Example values for testing

### **Request/Response Schemas**
- Input validation rules
- Response data structures
- Error response formats

## 🛠 **Development Workflow**

### **Adding New Endpoints**
1. **Document** the endpoint in the route file using JSDoc comments
2. **Define** request/response schemas in `swagger.js`
3. **Test** the documentation in Swagger UI
4. **Update** this README if needed

### **Example JSDoc Comment**
```javascript
/**
 * @swagger
 * /api/endpoint:
 *   get:
 *     summary: Endpoint description
 *     tags: [TagName]
 *     responses:
 *       200:
 *         description: Success response
 */
```

## 🚨 **Troubleshooting**

### **Common Issues**

#### **1. Swagger UI Not Loading**
- Check if the server is running
- Verify port 5000 is available
- Check browser console for errors

#### **2. Endpoints Not Showing**
- Ensure JSDoc comments are properly formatted
- Check file paths in `swagger.js` configuration
- Restart the server after changes

#### **3. Authentication Issues**
- Verify JWT token format: `Bearer TOKEN`
- Check if token is expired
- Ensure token is valid

### **Debug Commands**
```bash
# Test Swagger endpoints
npm run test:swagger

# Test authentication
npm run test:auth

# Check server logs
npm run dev
```

## 📚 **Additional Resources**

- **OpenAPI 3.0 Specification**: https://swagger.io/specification/
- **Swagger JSDoc**: https://github.com/Surnet/swagger-jsdoc
- **Swagger UI Express**: https://github.com/scottie1984/swagger-ui-express

## 🎯 **Next Steps**

With Swagger documentation complete, we can now:
1. **Test all authentication endpoints** using the interactive UI
2. **Move to implementing job management endpoints**
3. **Document new endpoints** as we build them
4. **Share API documentation** with frontend developers

---

**Happy API Testing! 🚀**

For questions or issues, check the troubleshooting section or refer to the main project README.

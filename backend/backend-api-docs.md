# EyeNet Backend API Documentation

This document provides a detailed description of the EyeNet backend API endpoints, their parameters, and expected responses.

## User Routes (`/api/users`)

### 1. Create a new user (`POST /api/users/`)

**Description:** Creates a new user. Only accessible to admin users.

**Request Body:**

*   `username` (String, required): The username of the new user.
*   `email` (String, required): The email address of the new user.
*   `password` (String, required): The password of the new user.
*   `role` (String, required, enum: `admin`, `user`): The role of the new user.
*   `department` (String, optional): The department of the new user.

**Response:**

*   201 (Created): Returns the newly created user object.
*   400 (Bad Request): Returns an error message if the request is invalid.
*   403 (Forbidden): Returns an error message if the user is not an admin.

### 2. Get all users (`GET /api/users/`)

**Description:** Retrieves all users.

**Response:**

*   200 (OK): Returns an array of user objects.
*   401 (Unauthorized): Returns an error message if the user is not authenticated.

### 3. Get a specific user by ID (`GET /api/users/:id`)

**Description:** Retrieves a specific user by ID.

**Path Parameter:**

*   `id` (String, required): The ID of the user to retrieve.

**Response:**

*   200 (OK): Returns the user object.
*   401 (Unauthorized): Returns an error message if the user is not authenticated.
*   404 (Not Found): Returns an error message if the user is not found.

### 4. Update a user by ID (`PATCH /api/users/:id`)

**Description:** Updates a specific user by ID.

**Path Parameter:**

*   `id` (String, required): The ID of the user to update.

**Request Body:**

*   `username` (String, optional): The new username of the user.
*   `email` (String, optional): The new email address of the user.
*   `password` (String, optional): The new password of the user.
*   `role` (String, optional, enum: `admin`, `user`): The new role of the user.
*    `department` (String, optional): The new department of the user.

**Response:**

*   200 (OK): Returns the updated user object.
*   400 (Bad Request): Returns an error message if the request is invalid.
*   401 (Unauthorized): Returns an error message if the user is not authenticated.
*   404 (Not Found): Returns an error message if the user is not found.

### 5. Delete a user by ID (`DELETE /api/users/:id`)

**Description:** Deletes a specific user by ID.

**Path Parameter:**

*   `id` (String, required): The ID of the user to delete.

**Response:**

*   200 (OK): Returns a success message.
*   401 (Unauthorized): Returns an error message if the user is not authenticated.
*   404 (Not Found): Returns an error message if the user is not found.

### 6. Login a user (`POST /api/users/login`)

**Description:** Logs in a user and returns a JWT token.

**Request Body:**

*   `email` (String, required): The email address of the user.
*   `password` (String, required): The password of the user.

**Response:**

*   200 (OK): Returns a JWT token in the `auth-token` header and in the response body.
*   400 (Bad Request): Returns an error message if the email or password is invalid.

### 7. Forgot password (`POST /api/users/forgot-password`)

**Description:** Sends a password reset link to the user's email address.

**Request Body:**

*   `email` (String, required): The email address of the user.

**Response:**

*   200 (OK): Returns a success message.
*   404 (Not Found): Returns an error message if the user is not found.

## Department Routes (`/api/departments`)

### 1. Create a new department (`POST /api/departments/`)

**Description:** Creates a new department.

**Request Body:**

*   `name` (String, required): The name of the new department.

**Response:**

*   201 (Created): Returns the newly created department object.
*   400 (Bad Request): Returns an error message if the request is invalid.

### 2. Get all departments (`GET /api/departments/`)

**Description:** Retrieves all departments.

**Response:**

*   200 (OK): Returns an array of department objects.

### 3. Get a specific department by ID (`GET /api/departments/:id`)

**Description:** Retrieves a specific department by ID.

**Path Parameter:**

*   `id` (String, required): The ID of the department to retrieve.

**Response:**

*   200 (OK): Returns the department object.
*   404 (Not Found): Returns an error message if the department is not found.

### 4. Update a department by ID (`PATCH /api/departments/:id`)

**Description:** Updates a specific department by ID.

**Path Parameter:**

*   `id` (String, required): The ID of the department to update.

**Request Body:**

*   `name` (String, optional): The new name of the department.

**Response:**

*   200 (OK): Returns the updated department object.
*   400 (Bad Request): Returns an error message if the request is invalid.
*   404 (Not Found): Returns an error message if the department is not found.

### 5. Delete a department by ID (`DELETE /api/departments/:id`)

**Description:** Deletes a specific department by ID.

**Path Parameter:**

*   `id` (String, required): The ID of the department to delete.

**Response:**

*   200 (OK): Returns a success message.
*   404 (Not Found): Returns an error message if the department is not found.

## IP Routes (`/api/ips`)

### 1. Create a new IP (`POST /api/ips/`)

**Description:** Creates a new IP address.

**Request Body:**

*   `address` (String, required): The IP address.
*   `department` (String, optional): The department associated with the IP address.
*   `usage` (Number, optional): The usage of the IP address.

**Response:**

*   201 (Created): Returns the newly created IP object.
*   400 (Bad Request): Returns an error message if the request is invalid.

### 2. Get all IPs (`GET /api/ips/`)

**Description:** Retrieves all IP addresses.

**Response:**

*   200 (OK): Returns an array of IP objects.

### 3. Get a specific IP by address (`GET /api/ips/:address`)

**Description:** Retrieves a specific IP address by its address.

**Path Parameter:**

*   `address` (String, required): The IP address to retrieve.

**Response:**

*   200 (OK): Returns the IP object.
*   404 (Not Found): Returns an error message if the IP address is not found.

### 4. Update an IP by address (`PATCH /api/ips/:address`)

**Description:** Updates a specific IP address by its address.

**Path Parameter:**

*   `address` (String, required): The IP address to update.

**Request Body:**

*   `department` (String, optional): The new department associated with the IP address.
*   `usage` (Number, optional): The new usage of the IP address.

**Response:**

*   200 (OK): Returns the updated IP object.
*   400 (Bad Request): Returns an error message if the request is invalid.
*   404 (Not Found): Returns an error message if the IP address is not found.

### 5. Delete an IP by address (`DELETE /api/ips/:address`)

**Description:** Deletes a specific IP address by its address.

**Path Parameter:**

*   `address` (String, required): The IP address to delete.

**Response:**

*   200 (OK): Returns a success message.
*   404 (Not Found): Returns an error message if the IP address is not found.

## Report Routes (`/api/reports`)

### 1. Create a new report (`POST /api/reports/`)

**Description:** Creates a new report.

**Request Body:**

*   `type` (String, required, enum: `Performance`, `Network Usage`, `IP`): The type of the report.
*   `startDate` (Date, required): The start date of the report.
*   `endDate` (Date, required): The end date of the report.
*   `data` (Mixed, required): The data of the report.
*   `generatedBy` (String, optional): The ID of the user who generated the report.

**Response:**

*   201 (Created): Returns the newly created report object.
*   400 (Bad Request): Returns an error message if the request is invalid.

### 2. Get all reports (`GET /api/reports/`)

**Description:** Retrieves all reports.

**Response:**

*   200 (OK): Returns an array of report objects.

### 3. Get a specific report by ID (`GET /api/reports/:id`)

**Description:** Retrieves a specific report by ID.

**Path Parameter:**

*   `id` (String, required): The ID of the report to retrieve.

**Response:**

*   200 (OK): Returns the report object.
*   404 (Not Found): Returns an error message if the report is not found.

### 4. Delete a report by ID (`DELETE /api/reports/:id`)

**Description:** Deletes a specific report by ID.

**Path Parameter:**

*   `id` (String, required): The ID of the report to delete.

**Response:**

*   200 (OK): Returns a success message.
*   404 (Not Found): Returns an error message if the report is not found.

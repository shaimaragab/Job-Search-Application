# Job-Search-Application
# Project Title

he Job Search App is designed to help users find jobs relevant to their domain or area of interest. The app consists of various components under index.js, which serves as the root file. These components handle API calls, job postings, and error messages for incorrect entries.

Features

Filter Option: Users can filter jobs based on their requirements.

User Data Management: Handles user profile data securely.

Company Data Management: Stores and manages company details.

Job Applications: Enables users to apply for jobs easily.

## Tech Stack

*Node.js: Backend runtime environment

Express.js: Web framework for handling API requests

Mongoose: ODM for MongoDB

Nodemailer: Email service for sending emails (e.g., confirm email, password resets)

Joi: Data validation library for request validation

JSON Web Token (JWT): Authentication and authorization mechanism

Cloudinary: Cloud storage for file uploads (images, PDFs, etc.)

OAuth: Social login authentication

Socket.io: Real-time communication for chat features

CryptoJS: Encryption for securing sensitive data

bcrypt: Hashing for password security

Helmet: Security middleware for HTTP headers

Express Rate Limit: Middleware for rate limiting API requests

Node Cron: Scheduled tasks for deleting expired OTPs
## API Reference

#### Get all items

API Endpoints

User Endpoints

POST /signup - User signup

PATCH /confirm-email - Confirm email

POST /login - User login

POST /googleLogin - Google login

POST /google-signup - Google signup

PATCH /forget-password - Forgot password

POST /reset-password - Reset password

GET /refresh-token - Refresh authentication token

PATCH /profile - Update user profile

GET /profile - Get logged-in user profile

PATCH /profile/update-Password - Update user password

PATCH /profile/image - Upload profile picture

PATCH /profile/image/cover - Upload cover picture

DELETE /profile/image - Delete profile picture

DELETE /profile/image/cover - Delete cover picture

GET /profile/:profileId - Get another user's profile

Admin Endpoints(Admin Dashboard)

PATCH /admin/:userId/ban-user - Ban/unban user

PATCH /admin/:companyId/ban-company - Ban/unban company

PATCH /admin/:companyId/approve-company - Approve company

Job Endpoints

POST / - Add job

PATCH /:jobId - Update job

DELETE /:jobId - Delete job

GET /by-filter - Get jobs by filter

GET /:jobId? - Get all jobs or a specific job

Company Endpoints

POST / - Add company

PATCH /:companyId - Update company data

DELETE /:companyId - Soft delete company

GET /:companyId - Get specific company with related jobs

GET /search - Search for a company by name

PATCH /:companyId/logo - Upload company logo

PATCH /:companyId/cover - Upload company cover picture

DELETE /:companyId/logo - Delete company logo

DELETE /:companyId/cover - Delete company cover picture

Application Endpoints

POST /:jobId - Apply for a job

GET /:jobId - Get all applications for a job

PATCH /:applicationId - Accept or reject an application


## Documentation
https://documenter.getpostman.com/view/39098282/2sAYdhLWJE


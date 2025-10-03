# Neighborly Backend API

A comprehensive backend API for a neighborhood management system built with Node.js, TypeScript, Express, and Supabase.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
  - [Authentication Routes](#authentication-routes)
  - [Complaint Management](#complaint-management)
  - [Service Management](#service-management)
  - [Booking Management](#booking-management)
  - [Notice Management](#notice-management)
  - [Poll Management](#poll-management)
  - [Event Management](#event-management)
  - [Emergency Services](#emergency-services)
  - [Emergency Management](#emergency-management)
  - [Chatbot](#chatbot)
- [Error Handling](#error-handling)
- [Development](#development)

## Features

- 🔐 **User Authentication** - Multi-role authentication (Owner, Resident, Staff)
- 📝 **Complaint Management** - Create and track complaints with role-based access
- 🛠️ **Service Management** - Manage community services
- 📅 **Booking System** - Book and manage service appointments  
- 📢 **Notice Board** - Community announcements and notices
- 🗳️ **Polling System** - Create and participate in community polls
- 📆 **Event Management** - Organize community events
- 🚨 **Emergency Services** - Emergency contact management
- 💬 **AI Chatbot** - Intelligent assistance using LangChain and Groq
- �️ **Society Management** - Multi-society support with unique codes

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with JWT
- **AI/ML**: LangChain + Groq for chatbot functionality
- **Validation**: Custom middleware
- **Security**: CORS, cookie-parser, role-based access control

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd neighborly-backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create .env file with the following variables:
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key  
SUPABASE_SERVICE_KEY=your_supabase_service_key
GROQ_API_KEY=your_groq_api_key
CORS_ORIGINS=http://localhost:3000
NODE_ENV=development
```

4. Build and run:
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## Authentication

The API uses Supabase authentication with role-based access control. Users can register as:
- **Owner**: Society owner with full administrative privileges
- **Resident**: Society member with limited access
- **Staff**: Staff member with specific permissions

Authentication is handled via HTTP-only cookies with JWT tokens.

## API Endpoints

### Authentication Routes
**Base URL**: `/api/auth`

#### Register Owner
- **POST** `/register/owner`
- **Description**: Register a new society owner and create society
- **Authentication**: None required
- **Request Body**:
```json
{
  "email": "owner@example.com",
  "password": "securePassword123",
  "fullName": "John Doe",
  "phone_number": "+1234567890",
  "societyName": "Green Valley Society",
  "address": "123 Main Street",
  "city": "Springfield",
  "state": "Illinois", 
  "postal_code": "62701"
}
```
- **Response**:
```json
{
  "message": "Owner and society created successfully",
  "society": {
    "id": "uuid",
    "name": "Green Valley Society",
    "society_code": "ABC-123",
    "owner_id": "uuid"
  }
}
```

#### Register Resident
- **POST** `/register/resident`
- **Description**: Register a new resident to existing society
- **Authentication**: None required
- **Request Body**:
```json
{
  "email": "resident@example.com",
  "password": "securePassword123",
  "fullName": "Jane Smith",
  "phone_number": "+1234567891",
  "society_code": "ABC-123",
  "flat_number": "A-101"
}
```

#### Register Staff
- **POST** `/register/staff`
- **Description**: Register new staff member
- **Authentication**: None required
- **Request Body**:
```json
{
  "email": "staff@example.com", 
  "password": "securePassword123",
  "fullName": "Mike Johnson",
  "phone_number": "+1234567892",
  "society_code": "ABC-123",
  "department": "Maintenance"
}
```

#### Login
- **POST** `/login`
- **Description**: Authenticate user and receive session cookie
- **Authentication**: None required
- **Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```
- **Response**:
```json
{
  "message": "Logged in successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "resident"
  }
}
```

#### Logout
- **POST** `/logout`
- **Description**: Clear authentication session
- **Authentication**: Required
- **Response**:
```json
{
  "message": "Logged out successfully"
}
```

---

### Complaint Management
**Base URL**: `/api/complaints`

#### Create Complaint (Resident Only)
- **POST** `/`
- **Description**: Create a new complaint
- **Authentication**: Required (Resident role)
- **Request Body**:
```json
{
  "title": "Water Leakage in A-Block",
  "description": "There is a major water leakage in the A-Block corridor that needs immediate attention."
}
```
- **Response**:
```json
{
  "id": "uuid",
  "title": "Water Leakage in A-Block", 
  "description": "There is a major water leakage...",
  "status": "open",
  "user_id": "uuid",
  "created_at": "2024-01-01T10:00:00Z"
}
```

#### Get My Complaints (Resident Only)  
- **GET** `/my`
- **Description**: Get all complaints created by the authenticated resident
- **Authentication**: Required (Resident role)
- **Response**:
```json
[
  {
    "id": "uuid",
    "title": "Water Leakage in A-Block",
    "status": "in_progress", 
    "created_at": "2024-01-01T10:00:00Z"
  }
]
```

#### Get All Complaints (Owner Only)
- **GET** `/`
- **Description**: Get all complaints with optional status filter
- **Authentication**: Required (Owner role)
- **Query Parameters**: `?status=open` (optional)
- **Response**:
```json
[
  {
    "id": "uuid",
    "title": "Water Leakage in A-Block",
    "status": "open",
    "user_id": "uuid",
    "assigned_to": null,
    "created_at": "2024-01-01T10:00:00Z"
  }
]
```

#### Get Assigned Complaints (Staff Only)
- **GET** `/assigned` 
- **Description**: Get complaints assigned to the authenticated staff member
- **Authentication**: Required (Staff role)
- **Response**:
```json
[
  {
    "id": "uuid",
    "title": "Elevator Maintenance",
    "status": "in_progress",
    "assigned_to": "staff-uuid",
    "created_at": "2024-01-01T10:00:00Z"
  }
]
```

#### Get Complaint Details
- **GET** `/:id`
- **Description**: Get detailed information about a specific complaint
- **Authentication**: Required (authorization handled in controller)
- **Response**:
```json
{
  "id": "uuid",
  "title": "Water Leakage in A-Block",
  "description": "Detailed description...",
  "status": "in_progress", 
  "user_id": "uuid",
  "assigned_to": "staff-uuid",
  "created_at": "2024-01-01T10:00:00Z",
  "updated_at": "2024-01-02T15:30:00Z"
}
```

#### Assign Complaint (Owner Only)
- **PATCH** `/:id/assign`
- **Description**: Assign a complaint to a staff member
- **Authentication**: Required (Owner role)
- **Request Body**:
```json
{
  "staffId": "staff-uuid"
}
```

#### Update Complaint Status (Owner/Staff Only)
- **PATCH** `/:id/status`
- **Description**: Update the status of a complaint
- **Authentication**: Required (Owner or Staff role)
- **Request Body**:
```json
{
  "status": "resolved"
}
```

---

### Service Management  
**Base URL**: `/api/services`

#### Create Service
- **POST** `/createservice`
- **Description**: Create a new service
- **Authentication**: Required
- **Request Body**:
```json
{
  "name": "Plumbing Service",
  "description": "Professional plumbing repairs and maintenance",
  "price": 500,
  "category": "Maintenance",
  "available": true
}
```

#### Update Service
- **PUT** `/updateservice`
- **Description**: Update an existing service
- **Authentication**: Required
- **Request Body**:
```json
{
  "serviceId": "uuid",
  "name": "Updated Service Name",
  "price": 600,
  "available": false
}
```

#### Delete Service
- **DELETE** `/deleteservice`
- **Description**: Delete a service
- **Authentication**: Required
- **Request Body**:
```json
{
  "serviceId": "uuid"
}
```

#### Get All Services
- **GET** `/fetchservices`
- **Description**: Retrieve all available services
- **Authentication**: Required
- **Response**:
```json
[
  {
    "id": "uuid",
    "name": "Plumbing Service",
    "description": "Professional plumbing repairs",
    "price": 500,
    "category": "Maintenance",
    "available": true,
    "created_at": "2024-01-01T10:00:00Z"
  }
]
```

---

### Booking Management
**Base URL**: `/api/bookings`

#### Book Service
- **POST** `/book`  
- **Description**: Book a service for a specific date
- **Authentication**: Required
- **Request Body**:
```json
{
  "serviceId": "uuid",
  "bookingDate": "2024-01-15",
  "details": "Need plumbing service for kitchen sink"
}
```
- **Response**:
```json
{
  "message": "Service booked successfully",
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "service_id": "uuid", 
    "requested_date": "2024-01-15",
    "status": "pending",
    "created_at": "2024-01-01T10:00:00Z"
  }
}
```

#### Edit Booking
- **PUT** `/editbooking`
- **Description**: Update booking date
- **Authentication**: Required  
- **Request Body**:
```json
{
  "bookingId": "uuid",
  "bookingDate": "2024-01-20"
}
```

#### Cancel Booking
- **DELETE** `/cancelbooking`
- **Description**: Cancel an existing booking
- **Authentication**: Required
- **Request Body**:
```json
{
  "bookingId": "uuid"
}
```

#### Get All Bookings
- **GET** `/fetchbooking`
- **Description**: Retrieve all bookings
- **Authentication**: Required
- **Response**:
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "service_id": "uuid",
    "requested_date": "2024-01-15",
    "status": "confirmed",
    "created_at": "2024-01-01T10:00:00Z"
  }
]
```

---

### Notice Management
**Base URL**: `/api/notice`

#### Create Notice
- **POST** `/createnotice`
- **Description**: Create a new community notice
- **Authentication**: Required
- **Request Body**:
```json
{
  "title": "Maintenance Notice",
  "content": "Water supply will be interrupted on Sunday from 10 AM to 2 PM for maintenance work.",
  "priority": "high",
  "expires_at": "2024-02-01T00:00:00Z"
}
```

#### Edit Notice
- **PUT** `/editnotice`
- **Description**: Update an existing notice
- **Authentication**: Required
- **Request Body**:
```json
{
  "noticeId": "uuid",
  "title": "Updated Notice Title",
  "content": "Updated notice content...",
  "priority": "medium"
}
```

#### Delete Notice
- **DELETE** `/deletenotice` 
- **Description**: Remove a notice
- **Authentication**: Required
- **Request Body**:
```json
{
  "noticeId": "uuid"
}
```

#### Get All Notices
- **GET** `/fetchnotices`
- **Description**: Retrieve all active notices
- **Authentication**: None required
- **Response**:
```json
[
  {
    "id": "uuid",
    "title": "Maintenance Notice",
    "content": "Water supply will be interrupted...",
    "priority": "high",
    "created_at": "2024-01-01T10:00:00Z",
    "expires_at": "2024-02-01T00:00:00Z"
  }
]
```

---

### Poll Management
**Base URL**: `/api/poll`

#### Create Poll
- **POST** `/createpoll`
- **Description**: Create a new community poll
- **Authentication**: Required
- **Request Body**:
```json
{
  "question": "Should we install CCTV cameras in the lobby?",
  "options": ["Yes", "No", "Need more information"],
  "expires_at": "2024-02-15T23:59:59Z",
  "description": "This poll is to gather community opinion on security improvements."
}
```

#### Edit Poll
- **PUT** `/editpoll`
- **Description**: Update an existing poll (only if no votes yet)
- **Authentication**: Required
- **Request Body**:
```json
{
  "pollId": "uuid",
  "question": "Updated poll question?",
  "options": ["Updated Option 1", "Updated Option 2"]
}
```

#### Close Poll  
- **PUT** `/closepoll`
- **Description**: Manually close an active poll
- **Authentication**: Required
- **Request Body**:
```json
{
  "pollId": "uuid"
}
```

#### Get All Polls
- **GET** `/getpolls`
- **Description**: Retrieve all polls (active and closed)
- **Authentication**: None required
- **Response**:
```json
[
  {
    "id": "uuid",
    "question": "Should we install CCTV cameras?",
    "options": ["Yes", "No", "Need more info"],
    "status": "active",
    "votes_count": 45,
    "created_at": "2024-01-01T10:00:00Z",
    "expires_at": "2024-02-15T23:59:59Z"
  }
]
```

---

### Event Management  
**Base URL**: `/api/events`

#### Create Event
- **POST** `/addevent`
- **Description**: Create a new community event
- **Authentication**: Required
- **Request Body**:
```json
{
  "title": "Annual Society Meeting",
  "description": "Mandatory meeting for all residents to discuss society matters.",
  "date": "2024-02-20T18:00:00Z",
  "location": "Community Hall",
  "organizer": "Society Management",
  "max_participants": 100
}
```

#### Delete Event
- **DELETE** `/removeevent`
- **Description**: Remove an event
- **Authentication**: Required  
- **Request Body**:
```json
{
  "eventId": "uuid"
}
```

#### Get All Events
- **GET** `/fetchevents`
- **Description**: Retrieve all upcoming events
- **Authentication**: Required
- **Response**:
```json
[
  {
    "id": "uuid",
    "title": "Annual Society Meeting", 
    "description": "Mandatory meeting...",
    "date": "2024-02-20T18:00:00Z",
    "location": "Community Hall",
    "organizer": "Society Management",
    "max_participants": 100,
    "current_participants": 23,
    "created_at": "2024-01-01T10:00:00Z"
  }
]
```

---

### Emergency Services
**Base URL**: `/api/availemergency`

#### Get Emergency Services
- **GET** `/fetchsemergencyervices` 
- **Description**: Get all available emergency services
- **Authentication**: None required
- **Response**:
```json
[
  {
    "id": "uuid",
    "name": "Fire Department",
    "phone": "101", 
    "description": "Emergency fire services",
    "available_24_7": true
  }
]
```

#### Book Emergency Service
- **POST** `/bookemergencyservice`
- **Description**: Request an emergency service
- **Authentication**: None required  
- **Request Body**:
```json
{
  "serviceId": "uuid",
  "emergency_type": "fire",
  "location": "Building A, Floor 3",
  "description": "Small fire in kitchen",
  "contact_number": "+1234567890"
}
```

#### Close Emergency Service
- **DELETE** `/closeemergencyservice`
- **Description**: Mark emergency as resolved
- **Authentication**: None required
- **Request Body**:
```json
{
  "emergencyId": "uuid"
}
```

---

### Emergency Management
**Base URL**: `/api/emergencies`

#### Add Emergency Service
- **POST** `/addemergencyservice`
- **Description**: Add a new emergency service to the system
- **Authentication**: Required
- **Request Body**:
```json
{
  "name": "Ambulance Service",
  "phone": "108",
  "description": "Medical emergency services",  
  "available_24_7": true,
  "response_time": "15 minutes"
}
```

#### Delete Emergency Service
- **DELETE** `/deleteemergencyservice`
- **Description**: Remove an emergency service
- **Authentication**: Required
- **Request Body**:
```json
{
  "serviceId": "uuid"
}
```

#### Get Emergency Services
- **GET** `/getemergencyservices`  
- **Description**: Get all emergency services in the system
- **Authentication**: Required
- **Response**:
```json
[
  {
    "id": "uuid",
    "name": "Fire Department",
    "phone": "101",
    "description": "Emergency fire services",
    "available_24_7": true,
    "response_time": "10 minutes",
    "created_at": "2024-01-01T10:00:00Z"
  }
]
```

---

### Chatbot
**Base URL**: `/api/chatbot`

#### Ask Query
- **POST** `/`
- **Description**: Send a message to the AI chatbot for assistance
- **Authentication**: None required
- **Request Body**:
```json
{
  "message": "How do I register a complaint about noise?",
  "context": "resident_help"
}
```
- **Response**:
```json
{
  "response": "To register a noise complaint, you can use the complaint system by going to /api/complaints and creating a new complaint. Make sure to provide details about the noise issue, including time, location, and description of the problem.",
  "timestamp": "2024-01-01T10:00:00Z"
}
```

---

## Error Handling

The API uses consistent error response format:

```json
{
  "message": "Error description",
  "error": "Additional error details (in development mode)",
  "statusCode": 400
}
```

### Common Status Codes
- `200` - Success
- `201` - Created successfully  
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

### Authentication Errors
```json
{
  "message": "Authentication required",
  "statusCode": 401
}
```

### Validation Errors
```json
{
  "message": "Missing required fields: email, password",
  "statusCode": 400  
}
```

### Permission Errors
```json
{
  "message": "Forbidden: Insufficient permissions for this action",
  "statusCode": 403
}
```

## Development

### Project Structure
```
src/
├── config/          # Database and external service configurations
├── controllers/     # Request handlers and business logic
├── middleware/      # Authentication, validation, error handling
├── routes/          # API route definitions  
├── services/        # Database operations and external API calls
├── types/           # TypeScript type definitions
└── index.ts         # Application entry point
```

### Available Scripts
```bash
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript  
npm start            # Start production server
```

### Environment Variables
```bash
PORT=5000                    # Server port
SUPABASE_URL=               # Supabase project URL
SUPABASE_ANON_KEY=          # Supabase anonymous key
SUPABASE_SERVICE_KEY=       # Supabase service role key  
GROQ_API_KEY=               # Groq AI API key for chatbot
CORS_ORIGINS=               # Allowed origins for CORS
NODE_ENV=development        # Environment mode
```

### Role-Based Access Control

#### Owner Role
- Full access to all endpoints
- Can manage complaints, assign to staff
- Can create/manage services, events, polls, notices
- Society management permissions

#### Resident Role  
- Can create and view own complaints
- Can book services 
- Can participate in polls
- Read access to notices and events

#### Staff Role
- Can view assigned complaints
- Can update complaint status  
- Limited service management
- Can view bookings and notices

### Database Schema (Supabase)

The application uses the following main tables:
- `profiles` - User profiles with role information
- `societies` - Society/community information  
- `complaints` - Complaint management
- `services` - Available services
- `bookings` - Service bookings
- `notices` - Community notices
- `polls` - Community polls  
- `events` - Community events
- `emergency_services` - Emergency contact information

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)  
5. Open a Pull Request

### License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Support

For support or questions about the API, please create an issue in the repository or contact the development team.

🔑 Role-Based Access

Residents (Users): Raise complaints, vote in polls, view notices, book services.

Committee (Owners/Admin): Manage complaints, budgets, polls, notices, and services.

Staff: Execute assigned tasks (resolve complaints, update booking status).

#📋 Complaint Management

Residents file complaints (e.g., “Lift not working”).

Complaints move through statuses → Pending → In Progress → Resolved.

Auto-escalation if unresolved after X days.

💰 Society Budget & Expenses

Transparent view of maintenance collections, allocations, and expenses.

Residents see charts of where funds are used.

📢 Digital Forum (Community Hub)

Notice Board: Committee posts updates.

Polls: Residents vote on society decisions (e.g., repaint building, install solar).

Events: Announcements for celebrations and gatherings.

#🚖 Services & Bookings

Book cabs, ambulances, halls, or society amenities.

Track bookings & status updates by staff/admin.

🛡️ Role-Based Functions (RBAC)

| Feature           | User (Resident) | Staff (Worker)          | Owner (Admin/Committee)       |
| ----------------- | --------------- | ----------------------- | ----------------------------- |
| Complaints        | Create, Track   | Update status           | Assign staff, Close issue     |
| Polls             | View, Vote      | View,Vote               | Create, Close poll            |
| Notices           | View            | View                    | Create, Edit, Delete          |
| Services/Bookings | Book, Track     | Update assigned booking | Add service, Approve bookings |

⚡USP's

✅ Role-based login (Resident/Admin)
✅ Complaint filing + tracking
✅ Polls for community decisions
✅ Notice board
✅ Services (e.g., ambulance booking, hall booking, pool booking, etc.)


📌 Future Enhancements
Visitor management (digital gate entry, delivery logs) for admins.

Community marketplace (food vendors, electricians).

Event RSVPs & interest-based groups.

Budget and fund tracking for societie's management group

Enhanced RBAC.



# COMP3421 Final Project – Hostels Reservation Website Outline

## Group Members

1. Ho Siu Wang, 24036797d (Frontend)
2. Lai Yuen Wang, 24138896d (Backend)

## Background

Online booking platforms are growing rapidly. Tourists prefer them for convenience, transparency, and trust. New York City is a top tourism destination with millions of visitors annually. Few platforms focus exclusively on premium (4-star+) hotels. This project creates a high-end hotel booking website for NYC luxury accommodations.

## Purposes

### High-class Hotel Reservation Service

- Exclusively 4-star and above hotels in New York City
- Verified partner hotels with authentic high-quality imagery
- Consistent premium service standards

### Seamless Transactions Experience

- Secure, fast, user-friendly booking process
- Reliable payment gateways
- Automated confirmation emails and receipts

## Potential Stakeholders

| Stakeholder              | Description                                        |
| ------------------------ | -------------------------------------------------- |
| Travelers / Customers    | High-spending individuals seeking premium services |
| Hotel Partners (4★+ NYC) | Businesses listing properties on the platform      |

## Client-Side Components

### 1. Website Architecture

- **Frontend Layer**: HTML, CSS, JavaScript – handles UI, search, booking, account management
- **Backend Layer**: Node.js – processes logic, bridges frontend and database
- **Database Layer**: MySQL – stores hotels, users, bookings, reviews

### 2. Website Pages

| Page                   | Description                    | Main Features                                           |
| ---------------------- | ------------------------------ | ------------------------------------------------------- |
| Home                   | Landing page                   | Search function, Featured premium listings              |
| Hotel Lists            | Filtered hotel results         | Sorting & filter panel, Scrollable list                 |
| Hotel Details          | Selected hotel profile         | Room types & prices, Ratings & reviews, Interactive map |
| Booking / Checkout     | Complete reservation & payment | Input validation                                        |
| User Dashboard         | View bookings & manage profile | Update details, Booking history & status                |
| Login / Create Account | Authentication & registration  | Detect user status, Retrieve from DB                    |
| Forgot Password        | Reset password                 | Update password in DB                                   |
| Contact / Support      | Customer support & feedback    | Inquiry form, FAQs                                      |

## Server-Side Components

### 1. Database (MySQL)

Tables:

- Users
- Hotels
- Bookings
- Reviews

(ER Diagram: Hotels ← Bookings → Users ← Reviews)

### 2. Scripts (Node.js)

| Layer         | Purpose                        | Files                | Description                         |
| ------------- | ------------------------------ | -------------------- | ----------------------------------- |
| Controller    | Validate input, business rules | userController.js    | Registration, login, reset password |
|               |                                | hotelController.js   | Retrieve hotels, filters            |
|               |                                | bookingController.js | Create bookings                     |
| Model         | Execute SQL queries            | userModel.js         | User CRUD                           |
|               |                                | hotelModel.js        | Hotel listing & details             |
| Configuration | DB connection setup            | db.js                | MySQL connection & credentials      |

_Note: Original document contains figures (architecture diagram, page hierarchy tree, ER diagram) which cannot be reproduced here._

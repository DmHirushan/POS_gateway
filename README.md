# SmartPOS Frontend

A modern Point of Sale (POS) frontend application built with React, designed to interact with microservices for managing customers, items, and orders.

## Features

- Item Management
  - View all items
  - Add new items
  - Update item details
  - Delete items

- Customer Management
  - View customer records
  - Add new customers
  - Update customer information
  - Delete customers

- Order Management
  - Create orders
  - View order history
  - Manage order details

- Responsive user interface
- REST API integration
- Microservices-based architecture support

## Tech Stack

- React
- JavaScript
- Axios
- Tailwind CSS
- REST APIs

## Project Structure

```text
src/
├── components/
├── pages/
├── services/
├── assets/
├── App.tsx
└── main.tsx
```

## Prerequisites

Before running the application, ensure you have installed:

- Node.js
- npm

## Installation

1. Clone the repository

```bash
git clone <repository-url>
```

2. Navigate to the project directory

```bash
cd smartpos-frontend
```

3. Install dependencies

```bash
npm install
```

4. Start the development server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

## Backend Services

The frontend communicates with the following microservices:

| Service | Technology |
|----------|------------|
| Item Service | Node.js & Express |
| Customer Service | Spring Boot |
| Order Service | Spring Boot |
| Databases | MySQL & MongoDB |

## API Integration

Configure the API base URLs in your service files or environment variables.

Example:

```env
VITE_ITEM_API=http://localhost:3000/api
VITE_CUSTOMER_API=http://localhost:8081
VITE_ORDER_API=http://localhost:3001/api
```

## Future Enhancements

- Authentication & Authorization
- Dashboard Analytics
- Inventory Reports
- Payment Processing
- Role-Based Access Control

## Author

Dimuth Samaranayake

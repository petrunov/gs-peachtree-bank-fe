# Peachtree Bank Frontend

A modern, responsive banking application frontend built with Vue 3, TypeScript, and Tailwind CSS. This application provides a clean and intuitive interface for managing bank accounts and transactions.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Features](#features)
- [Architecture](#architecture)
  - [Component Structure](#component-structure)
  - [State Management](#state-management)
  - [API Integration](#api-integration)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Future Improvements](#future-improvements)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Peachtree Bank Backend API running (see [Backend Repository](https://github.com/petrunov/gs-peachtree-bank))

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/gs-peachtree-bank-FE.git
   cd gs-peachtree-bank-FE
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Running the Application

1. Ensure the Peachtree Bank Backend API is running first.

2. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

3. Open your browser and navigate to `http://localhost:5173` (or the URL shown in your terminal).

4. For production build:
   ```bash
   npm run build
   # or
   yarn build
   ```

## Features

- **Account Management**: View account details, balances, and transaction history
- **Transaction Handling**:
  - View recent transactions with filtering and sorting
  - Create new transactions between accounts
  - Categorize transactions by type (Card Payments, Transaction, Online transfer)
- **Search Functionality**: Search across accounts and transactions
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Transaction list updates automatically when new transactions are added
- **Robust Error Handling**: Clear error messages and graceful error recovery
- **Security Features**: Input sanitization and CSRF protection

## Architecture

### Component Structure

The application follows a modular component-based architecture, breaking down the UI into small, reusable components. This approach improves:

- **Maintainability**: Each component has a single responsibility
- **Reusability**: Components can be reused across different parts of the application
- **Testability**: Smaller components are easier to test in isolation

Key components include:

- **Layout Components**: Handle the overall structure of the application
- **Transaction Components**: Manage the display and interaction with transaction data
- **Form Components**: Handle user input for creating new transactions

### State Management

The application uses Vue's Composition API for state management, with:

- **Component-level state**: Using `ref` and `reactive` for local component state
- **Props and events**: For parent-child component communication
- **API services**: For data fetching and persistence

This approach keeps the application simple and maintainable without introducing additional state management libraries.

### API Integration

The frontend communicates with the backend through a dedicated API service layer:

- **API Client**: Centralized Axios instance with interceptors for error handling
- **Service Classes**: Organized by domain (AccountService, TransactionService)
- **Type Definitions**: Strong TypeScript typing for API requests and responses
- **Error Handling**: Consistent error processing and user-friendly messages

## Technologies Used

- **Vue 3**: Progressive JavaScript framework with Composition API
- **TypeScript**: For type safety and improved developer experience
- **Vite**: Next-generation frontend tooling for fast development and optimized builds
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Axios**: Promise-based HTTP client for API requests
- **ESLint & Prettier**: For code quality and consistent formatting

## Project Structure

```
src/
├── assets/            # Static assets (images, icons)
├── components/        # Reusable UI components
│   ├── layout/        # Layout components
│   └── transactions/  # Transaction-related components
├── services/          # API services
│   ├── api/           # API client and interceptors
│   ├── AccountService.ts  # Account service class
│   └── TransactionService.ts  # Transaction service class
├── utils/             # Utility functions
│   └── security.ts    # Security utilities (sanitization, CSRF)
├── views/             # Page components
│   ├── HomeView.vue   # Main transactions view
│   ├── DetailView.vue # Transaction details view
│   └── NotFoundView.vue # 404 error page
├── App.vue            # Root component
└── main.ts            # Application entry point with routing
```

## Future Improvements

- Add authentication and user management
- Implement account creation functionality
- Add transaction categories and analytics
- Enhance search with filters and advanced options
- Add unit and integration tests
- Implement internationalization (i18n) support

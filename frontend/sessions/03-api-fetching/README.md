# 🚀 Modern API Integration Workshop

A comprehensive full-stack application demonstrating different approaches to API integration in React, from basic native fetch to advanced React Query patterns.

## 📋 Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [API Integration Approaches](#api-integration-approaches)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Examples & Patterns](#examples--patterns)
- [Best Practices](#best-practices)

## 🎯 Overview

This project showcases **4 different approaches** to handle API integration in a React application, each building upon the previous to demonstrate evolution from basic to advanced patterns:

1. **Native Fetch API** - Raw JavaScript fetch implementation
2. **Axios** - Popular HTTP client library
3. **Axios Improved** - Enhanced with interceptors and error handling
4. **React Query** - Modern data fetching with caching and state management

The backend provides a RESTful API for managing blog posts with full CRUD operations.

## 📁 Project Structure

```
├── README.md
├── backend/                    # Express.js API Server
│   ├── src/
│   │   ├── app.ts             # Main server configuration
│   │   ├── controllers/        # Request handlers
│   │   │   └── post-controller.ts
│   │   ├── db/                # JSON file database
│   │   │   └── post.json
│   │   ├── routes/            # API route definitions
│   │   │   └── post.route.ts
│   │   ├── services/          # Business logic
│   │   │   └── post.service.ts
│   │   └── types/             # TypeScript interfaces
│   │       └── post.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/                   # React + TypeScript + Vite
│   ├── src/
│   │   ├── App.tsx            # Main app with tab navigation
│   │   ├── main.tsx           # App entry point
│   │   ├── api/               # API integration layer
│   │   │   └── posts.ts
│   │   ├── components/        # Integration approach components
│   │   │   ├── native.tsx
│   │   │   ├── axios.tsx
│   │   │   ├── axios-improved.tsx
│   │   │   └── react-query.tsx
│   │   ├── examples/          # HTTP content-type examples
│   │   │   └── native/
│   │   │       ├── json.ts
│   │   │       ├── form.ts
│   │   │       ├── file.ts
│   │   │       ├── text.ts
│   │   │       └── xml.ts
│   │   ├── providers/         # React context providers
│   │   │   └── react-query-provider.tsx
│   │   ├── types/             # Shared TypeScript types
│   │   │   └── post.ts
│   │   └── utils/             # Utility functions
│   │       └── custom-axios.ts
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
```

## 🛠 Technologies Used

### Backend

- **Runtime**: Bun
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: JSON file storage
- **CORS**: Enabled for cross-origin requests
- **UUID**: For unique post identification

### Frontend

- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **HTTP Clients**:
  - Native Fetch API
  - Axios
  - React Query (@tanstack/react-query)
- **Development**: React Query Devtools

## ✨ Features

### 🎨 Interactive UI

- **Tab Navigation**: Switch between different API integration approaches
- **Real-time Updates**: Live post management with optimistic updates
- **Loading States**: Comprehensive loading and error handling
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

### 📝 CRUD Operations

- ✅ **Create**: Add new blog posts
- 📖 **Read**: View all posts with real-time data
- ✏️ **Update**: Edit posts inline with instant feedback
- 🗑️ **Delete**: Remove posts with confirmation dialogs

### 🔄 Advanced Features

- **Caching**: Smart data caching with React Query
- **Background Refetching**: Automatic data synchronization
- **Optimistic Updates**: Instant UI updates before server confirmation
- **Error Boundaries**: Comprehensive error handling and user feedback
- **Request Interceptors**: Automatic request/response logging and transformation

## 🔗 API Integration Approaches

### 1. 🟦 Native Fetch

Basic JavaScript fetch API implementation demonstrating:

- Manual request configuration
- JSON parsing and error handling
- Loading state management
- Raw HTTP status code handling

```typescript
const response = await fetch(`${BASE_URL}/posts`, {
	method: "POST",
	headers: { "Content-Type": "application/json" },
	body: JSON.stringify(data),
});
```

### 2. 🟩 Axios

Popular HTTP client with enhanced features:

- Automatic JSON parsing
- Better error handling with `axios.isAxiosError()`
- Built-in timeout and request configuration
- Simplified API calls

```typescript
const response = await axios.post("/posts", data, {
	timeout: 10000,
	headers: { "Content-Type": "application/json" },
});
```

### 3. 🟥 Axios Improved

Production-ready Axios setup featuring:

- **Request/Response Interceptors**: Automatic logging and auth handling
- **Centralized Error Handling**: Consistent error processing
- **Base URL Configuration**: Environment-based API endpoints
- **Retry Logic**: Automatic request retries on failure

```typescript
api.interceptors.request.use((config) => {
	console.log(`Request 📤 ${config.method?.toUpperCase()} ${config.url}`);
	return config;
});
```

### 4. 🟪 React Query

Modern data fetching with advanced features:

- **Smart Caching**: Automatic data caching and invalidation
- **Background Updates**: Silent data synchronization
- **Optimistic Updates**: Instant UI feedback
- **Loading States**: Built-in loading, error, and success states
- **DevTools Integration**: Visual debugging and cache inspection

```typescript
const { data, isLoading, error } = useQuery({
	queryKey: ["posts"],
	queryFn: getAllPostsHandler,
	staleTime: 5 * 60 * 1000,
});
```

## 🚦 Getting Started

### Prerequisites

- **Bun** installed on your system
- **Node.js** 18+ (alternative to Bun)

### 🖥️ Backend Setup

```bash
cd backend
bun install
bun run dev
```

Server runs on: `http://localhost:8080`

### 🌐 Frontend Setup

```bash
cd frontend
bun install
bun run dev
```

Client runs on: `http://localhost:5173`

### 🔧 Development

Both servers support hot reload for seamless development experience.

## 📡 API Endpoints

Base URL: `http://localhost:8080/api`

| Method   | Endpoint     | Description             |
| -------- | ------------ | ----------------------- |
| `GET`    | `/posts`     | Retrieve all posts      |
| `GET`    | `/posts/:id` | Get specific post by ID |
| `POST`   | `/posts`     | Create new post         |
| `PUT`    | `/posts/:id` | Update existing post    |
| `DELETE` | `/posts/:id` | Delete post by ID       |

### 📋 Post Schema

```typescript
interface IPost {
	id: string; // UUID v4
	title: string; // Post title
	content: string; // Post content
	date: string; // ISO date string
}
```

## 📚 Examples & Patterns

### Content-Type Examples

The project includes examples for different HTTP content types:

- **JSON**: `application/json` - Standard API communication
- **Form Data**: `application/x-www-form-urlencoded` - Form submissions
- **File Upload**: `multipart/form-data` - File uploads
- **Plain Text**: `text/plain` - Simple text data
- **XML**: `application/xml` - XML data exchange

### Error Handling Patterns

```typescript
// Centralized error handling
const handleApiError = (err: any, defaultMessage: string) => {
	if (axios.isAxiosError(err)) {
		const status = err.response?.status;
		switch (status) {
			case 400:
				return "Bad Request";
			case 401:
				return "Unauthorized";
			case 404:
				return "Resource not found";
			case 500:
				return "Server error";
			default:
				return err.message;
		}
	}
	return defaultMessage;
};
```

## 🎯 Best Practices Demonstrated

### ✅ Frontend

- **TypeScript**: Full type safety across the application
- **Component Separation**: Clean separation of concerns
- **Custom Hooks**: Reusable logic with React Query
- **Error Boundaries**: Graceful error handling
- **Loading States**: Comprehensive UX feedback
- **Optimistic Updates**: Immediate user feedback

### ✅ Backend

- **MVC Pattern**: Clear separation of routes, controllers, and services
- **Type Safety**: Shared TypeScript interfaces
- **Error Handling**: Consistent API error responses
- **CORS Configuration**: Proper cross-origin setup
- **RESTful Design**: Standard HTTP methods and status codes

### ✅ Development

- **Hot Reload**: Fast development iteration
- **ESLint**: Code quality enforcement
- **Tailwind CSS**: Utility-first styling
- **Vite**: Lightning-fast build tool
- **Bun**: High-performance JavaScript runtime

## 🎨 UI Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Interactive Tabs**: Switch between integration approaches
- **Real-time Feedback**: Loading spinners and success/error messages
- **Inline Editing**: Edit posts directly in the interface
- **Confirmation Dialogs**: Safe delete operations
- **Form Validation**: Required field validation
- **Auto-refresh**: Manual and automatic data synchronization

## 🔮 Learning Outcomes

This project demonstrates the evolution from basic API integration to production-ready patterns:

1. **Foundation**: Understanding raw fetch API and HTTP fundamentals
2. **Enhancement**: Leveraging libraries like Axios for better DX
3. **Optimization**: Implementing interceptors and centralized error handling
4. **Mastery**: Using React Query for advanced data management and caching

Perfect for developers looking to understand modern API integration patterns and best practices in React applications.

---

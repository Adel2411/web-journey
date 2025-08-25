# 🎯 Frontend Challenge 2: **Authentication & API Integration**

> **Build login/register forms and connect to the backend API for real note management**

Welcome to your second frontend challenge! You'll enhance your existing CollabNote React app from Challenge 1 by adding user authentication and real API integration. Say goodbye to mock data - you'll now fetch real notes from your backend!

---

## 🎯 Challenge Objectives

By completing this challenge, you'll enhance your existing app with:

- 🔐 **Authentication system** with login and register forms
- 🔗 **Real API integration** using fetch or axios to connect with your backend
- 🎫 **JWT token management** for authenticated requests
- 📝 **Dynamic note loading** from the backend API (no more mock data!)
- 🛡️ **Protected routes** that require user authentication
- 🎨 **Enhanced UI** with loading states, error handling, and user feedback

---

## 🛠️ Prerequisites

- Completed Frontend Challenge 1 (React components and note display)
- Completed Backend Challenge 2 (JWT authentication API) - or access to the API
- Your existing React app structure with Tailwind CSS
- Understanding of React hooks (useState, useEffect)

---

## 📋 Challenge Tasks

### 🔐 **Task 1: Authentication Context Setup**

Create a global authentication state that all components can access.

1. **Create authentication context** (`src/contexts/AuthContext.jsx`):
   - Store current user and authentication status
   - Provide login, register, and logout functions
   - Handle JWT token storage in localStorage
   - Automatically check for existing tokens on app startup

### 🎨 **Task 2: Authentication UI Components**

**Create Login Component** (`src/components/auth/LoginForm.jsx`):

1. **Login form with validation:**
   - Email input with proper validation
   - Password input
   - Form submission handling
   - Loading state during authentication
   - Error message display
   - "Remember me" checkbox (optional)

2. **Integration with backend:**
   - POST request to `/api/auth/login`
   - Handle success/error responses
   - Store JWT token and user data
   - Redirect to main app after successful login

**Create Register Component** (`src/components/auth/RegisterForm.jsx`):

1. **Registration form with validation:**
   - Email input with format validation
   - Password input with confirmation
   - Name input
   - Age input with minimum age validation (18+)
   - Form validation matching backend requirements

2. **Integration with backend:**
   - POST request to `/api/auth/register`
   - Handle validation errors from backend
   - Automatic login after successful registration

**Create Auth Layout** (`src/components/auth/AuthLayout.jsx`):
- Shared layout for login/register pages
- Toggle between login and register forms
- Beautiful design matching your app's theme

### 🔗 **Task 3: API Integration Service**

**Create API service** (`src/services/api.js`):

1. **Base API configuration:**
   - Base URL for your backend (http://localhost:5000)
   - Axios instance or fetch wrapper
   - Request/response interceptors

2. **Authentication API methods:**
   - `loginUser(email, password)`
   - `registerUser(userData)`
   - `getCurrentUser()` (if needed)

3. **Notes API methods:**
   - `getAllNotes()` - with Authorization header
   - `createNote(noteData)` - with Authorization header
   - `updateNote(id, noteData)` - with Authorization header
   - `deleteNote(id)` - with Authorization header

4. **Automatic token handling:**
   - Add Authorization header to all authenticated requests
   - Handle 401 responses (redirect to login)

### 📝 **Task 4: Update Note Components for Real Data**

**Update NoteList Component** (`src/components/notes/NoteList.jsx`):

1. **Replace mock data with API calls:**
   - Remove import of `sampleNotes.js`
   - Use `useEffect` to fetch notes from API on component mount
   - Handle loading states while fetching data
   - Handle error states if API fails
   - Show empty state when user has no notes

2. **Add CRUD operations:**
   - Add "Create New Note" button
   - Add edit functionality to existing notes
   - Add delete functionality with confirmation
   - Optimistic updates for better UX

**Update NoteItem Component** (`src/components/notes/NoteItem.jsx`):

1. **Display real user data:**
   - Show note creator's name from user relationship
   - Display real timestamps from API
   - Handle cases where user data might be missing

2. **Add interactive elements:**
   - Edit button (opens edit form)
   - Delete button (with confirmation)
   - Only show edit/delete for user's own notes

### 🎨 **Task 5: Create Note Management Forms**

**Create Note Form Component** (`src/components/notes/NoteForm.jsx`):

1. **Versatile form for create/edit:**
   - Title input with validation
   - Content textarea with character limit
   - Public/Private toggle
   - Submit and cancel buttons

2. **Handle both create and edit modes:**
   - Pre-populate fields when editing
   - Different submit behavior for create vs update
   - Loading states during API calls

3. **Integration with API:**
   - Create new notes via POST /api/notes
   - Update existing notes via PUT /api/notes/:id
   - Handle success and error responses

### 🛡️ **Task 6: Protected Route Logic**

**Update App Component** (`src/App.jsx`):

1. **Conditional rendering based on authentication:**
   - Show AuthLayout if user not logged in
   - Show main app (Header + NoteList) if user is authenticated
   - Handle loading state while checking authentication

2. **Add user information display:**
   - Show logged-in user's name in header
   - Add logout functionality
   - Display user's note count

3. **Error handling:**
   - Network error states
   - API error messages
   - Graceful fallbacks

---

## 🎯 Required Features

### Authentication Flow:
- [ ] User can register with email, password, name, and age
- [ ] Form validation matches backend requirements (age >= 18, passwords match)
- [ ] User can login with email and password
- [ ] JWT token is stored and used for subsequent requests
- [ ] User can logout (clears token and redirects to login)
- [ ] App remembers logged-in user on page refresh

### Notes Management:
- [ ] Fetches and displays user's notes from backend API
- [ ] Can create new notes through the UI
- [ ] Can edit existing notes inline or through forms
- [ ] Can delete notes with confirmation dialog
- [ ] Shows loading states during API operations
- [ ] Handles errors gracefully with user-friendly messages

### UI/UX:
- [ ] Beautiful, responsive design consistent with Challenge 1
- [ ] Loading spinners/skeletons during API calls
- [ ] Error messages for failed operations
- [ ] Success messages for completed actions
- [ ] Smooth transitions between authentication and main app

---

## 🔗 API Integration Examples

### Authentication Service (`src/services/api.js`):

```javascript
// Example API service implementation
const BASE_URL = VITE_API_URL || 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Login user
export const loginUser = async (email, password) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }
  
  return response.json();
};

// Get user's notes
export const getAllNotes = async () => {
  const token = getToken();
  const response = await fetch(`${BASE_URL}/notes`, {
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
      return;
    }
    throw new Error('Failed to fetch notes');
  }
  
  return response.json();
};
```

### Authentication Context (`src/contexts/AuthContext.jsx`):

```javascript
// Example context structure
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on app startup
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token is valid and get user data
      checkAuthStatus();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await loginUser(email, password);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

---

## 📱 Updated UI Flow

### Authentication Flow:
1. **App loads** → Check if user has valid token
2. **Not authenticated** → Show login/register forms
3. **User logs in** → Store token, fetch user data, show main app
4. **User registers** → Create account, auto-login, show main app

### Main App Flow:
1. **User authenticated** → Fetch user's notes from API
2. **Display notes** → Show loading state, then real notes
3. **User creates note** → POST to API, update local state
4. **User edits note** → PUT to API, update local state
5. **User deletes note** → DELETE to API, remove from local state

---

## ✅ Testing Your Implementation

### Authentication Testing:
- [ ] Registration form validates all fields correctly
- [ ] Cannot register with age < 18 or mismatched passwords
- [ ] Registration creates account and logs user in
- [ ] Login form validates email and password
- [ ] Login with correct credentials works
- [ ] Login with wrong credentials shows error
- [ ] Token is stored and used for subsequent requests
- [ ] User stays logged in after page refresh
- [ ] Logout clears token and returns to login screen

### Notes Integration Testing:
- [ ] Notes load from backend API when user logs in
- [ ] Creating a note sends POST request and updates UI
- [ ] Editing a note sends PUT request and updates UI
- [ ] Deleting a note sends DELETE request and updates UI
- [ ] Loading states show during API operations
- [ ] Error messages appear for failed API calls
- [ ] Only user's own notes are displayed

### Cross-Browser Testing:
- [ ] Works in Chrome, Firefox, Safari
- [ ] Responsive design works on mobile devices
- [ ] localStorage token persistence works correctly

---

## 🚀 Bonus Challenges (Optional)

1. **Enhanced UX:**
   - Add skeleton loading components for notes
   - Implement optimistic updates (update UI before API confirms)
   - Add search and filter functionality for notes
   - Implement infinite scrolling or pagination

2. **Advanced Features:**
   - "Remember me" functionality with longer token expiration
   - Auto-logout when token expires
   - Offline support with local caching
   - Real-time note updates (prepare for WebSocket integration)

3. **Error Handling:**
   - Network offline detection
   - Retry failed API calls
   - Better error messages based on specific API errors
   - Global error boundary for unhandled errors

---

## 📁 Updated Project Structure

```
project/frontend/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx (new)
│   │   │   ├── RegisterForm.jsx (new)
│   │   │   └── AuthLayout.jsx (new)
│   │   ├── notes/
│   │   │   ├── NoteList.jsx (updated - API integration)
│   │   │   ├── NoteItem.jsx (updated - real data)
│   │   │   └── NoteForm.jsx (new)
│   │   └── layout/
│   │       └── Header.jsx (updated - user info, logout)
│   ├── contexts/
│   │   └── AuthContext.jsx (new)
│   ├── services/
│   │   └── api.js (new)
│   ├── data/
│   │   └── sampleNotes.js (remove - no longer needed)
│   ├── App.jsx (updated - authentication logic)
│   └── main.jsx (updated - wrap with AuthProvider)
├── package.json
└── README.md (updated with authentication instructions)
```

---

## 📤 Submission

1. **Test authentication flow** completely (register → login → logout)
2. **Verify API integration** by creating, editing, and deleting notes
3. **Test error cases** (wrong credentials, network errors, etc.)
4. **Ensure responsive design** works on different screen sizes
5. **Remove all references** to `sampleNotes.js` mock data
6. **Document your API endpoints** and authentication flow
7. **Commit your code** with clear, descriptive commit messages
8. **Create a pull request** following the [Contributing Guide](../../CONTRIBUTING.md)

---

## 🆘 Need Help?

- 📖 **Review Frontend Session 3** for API integration concepts
- 🔐 **Check Backend Challenge 2** to understand the API endpoints
- 💬 **Ask questions** in [Discussions](https://github.com/Adel2411/web-journey/discussions)
- 🔍 **Debug network requests** using browser dev tools
- 🐛 **Report issues** if you encounter API connection problems

---

**🎉 Ready to bring real authentication and data to CollabNote? Let's connect the full stack!**
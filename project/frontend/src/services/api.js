
// const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// // Utility function to get JWT token from localStorage
// const getToken = () => localStorage.getItem('token');

// // Generic request handler with error handling
// // const makeRequest = async (url, options = {}) => {
// //   try {
// //     const response = await fetch(`${BASE_URL}${url}`, {
// //       ...options,
// //       headers: {
// //         'Content-Type': 'application/json',
// //         ...options.headers,
// //       },
// //     });

// //     // Handle different response statuses
// //     if (!response.ok) {
// //       if (response.status === 401) {
// //         // Token expired or invalid - redirect to login
// //         localStorage.removeItem('token');
// //         window.location.href = '/';
// //         return;
// //       }

// //       let errorData;
// //       try {
// //         errorData = await response.json();
// //       } catch {
// //         errorData = { message: 'Network error occurred' };
// //       }

// //       throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
// //     }

// //     // Return parsed JSON data
// //     return await response.json();
// //   } catch (error) {
// //     if (error.name === 'TypeError' && error.message.includes('fetch')) {
// //       throw new Error('Network error - please check your internet connection');
// //     }
// //     throw error;
// //   }
// // };

// // Add this debugging to your makeRequest function in api.js
// const makeRequest = async (url, options = {}) => {
//   // 🔍 DEBUG: Log all the details
//   console.log('🔍 DEBUG - API REQUEST:');
//   console.log('  - import.meta.env.VITE_API_URL:', import.meta.env.VITE_API_URL);
//   console.log('  - BASE_URL:', BASE_URL);
//   console.log('  - url parameter:', url);
//   console.log('  - Final URL:', `${BASE_URL}${url}`);
  
//   try {
//     const response = await fetch(`${BASE_URL}${url}`, {
//       ...options,
//       headers: {
//         'Content-Type': 'application/json',
//         ...options.headers,
//       },
//     });

//     console.log('🔍 Response status:', response.status);
//     console.log('🔍 Response URL:', response.url);

//     // Handle different response statuses
//     if (!response.ok) {
//       if (response.status === 401) {
//         // Token expired or invalid - redirect to login
//         localStorage.removeItem('token');
//         window.location.href = '/';
//         return;
//       }

//       let errorData;
//       try {
//         errorData = await response.json();
//       } catch {
//         errorData = { message: 'Network error occurred' };
//       }

//       throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
//     }

//     // Return parsed JSON data
//     return await response.json();
//   } catch (error) {
//     console.error('🔍 Request failed:', error);
//     if (error.name === 'TypeError' && error.message.includes('fetch')) {
//       throw new Error('Network error - please check your internet connection');
//     }
//     throw error;
//   }
// };
// // Authentication API methods
// export const authAPI = {
//   // User login
//   login: async (email, password) => {
//     const response = await makeRequest('/auth/login', {
//       method: 'POST',
//       body: JSON.stringify({ email, password }),
//     });
//     return response;
//   },

//   // User registration
//   register: async (userData) => {
//     const response = await makeRequest('/auth/register', {
//       method: 'POST',
//       body: JSON.stringify(userData),
//     });
//     return response;
//   },

//   // Verify current user token
//   verifyToken: async () => {
//     const token = getToken();
//     if (!token) return null;

//     const response = await makeRequest('/auth/verify', {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//       },
//     });
//     return response;
//   },

//   // Get current user profile
//   getCurrentUser: async () => {
//     const token = getToken();
//     if (!token) return null;

//     const response = await makeRequest('/auth/me', {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//       },
//     });
//     return response;
//   },
// };

// // Notes API methods
// export const notesAPI = {
//   // Get all user's notes
//   getAllNotes: async () => {
//     const token = getToken();
//     const response = await makeRequest('/notes', {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//       },
//     });
//     return response;
//   },

//   // Create a new note
//   createNote: async (noteData) => {
//     const token = getToken();
//     const response = await makeRequest('/notes', {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//       },
//       body: JSON.stringify(noteData),
//     });
//     return response;
//   },

//   // Update an existing note
//   updateNote: async (noteId, noteData) => {
//     const token = getToken();
//     const response = await makeRequest(`/notes/${noteId}`, {
//       method: 'PUT',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//       },
//       body: JSON.stringify(noteData),
//     });
//     return response;
//   },

//   // Delete a note
//   deleteNote: async (noteId) => {
//     const token = getToken();
//     const response = await makeRequest(`/notes/${noteId}`, {
//       method: 'DELETE',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//       },
//     });
//     return response;
//   },

//   // Get a specific note by ID
//   getNoteById: async (noteId) => {
//     const token = getToken();
//     const response = await makeRequest(`/notes/${noteId}`, {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//       },
//     });
//     return response;
//   },

//   // Search notes (bonus feature)
//   searchNotes: async (query) => {
//     const token = getToken();
//     const response = await makeRequest(`/notes/search?q=${encodeURIComponent(query)}`, {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//       },
//     });
//     return response;
//   },

//   // Get notes with pagination (bonus feature)
//   getNotesWithPagination: async (page = 1, limit = 10) => {
//     const token = getToken();
//     const response = await makeRequest(`/notes?page=${page}&limit=${limit}`, {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//       },
//     });
//     return response;
//   },
// };

// // Network status checker (bonus feature)
// export const networkUtils = {
//   isOnline: () => navigator.onLine,
  
//   // Retry a failed request
//   retryRequest: async (requestFn, maxRetries = 3, delay = 1000) => {
//     let lastError;
    
//     for (let i = 0; i < maxRetries; i++) {
//       try {
//         return await requestFn();
//       } catch (error) {
//         lastError = error;
//         if (i < maxRetries - 1) {
//           await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
//         }
//       }
//     }
    
//     throw lastError;
//   },
// };

// // Export all APIs
// export default {
//   auth: authAPI,
//   notes: notesAPI,
//   network: networkUtils,
// };

// console.log('🔍 Environment check:');
// console.log('  - import.meta.env:', import.meta.env);
// console.log('  - VITE_API_URL RAW:', JSON.stringify(import.meta.env.VITE_API_URL));
// console.log('  - VITE_API_URL LENGTH:', import.meta.env.VITE_API_URL?.length);

// // Fix the BASE_URL - handle the missing /api issue
// let BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// // Workaround: If env var is missing /api, add it
// if (BASE_URL === 'http://localhost:5000') {
//   BASE_URL = 'http://localhost:5000/api';
// }

// console.log('  - Final BASE_URL:', BASE_URL);
// console.log('  - Final BASE_URL LENGTH:', BASE_URL?.length);

// // Utility function to get JWT token from localStorage
// const getToken = () => localStorage.getItem('token');

// // FIXED: Updated makeRequest function
// const makeRequest = async (url, options = {}) => {
//   // 🔍 DEBUG: Log all the details
//   console.log('🔍 DEBUG - API REQUEST:');
//   console.log('  - import.meta.env.VITE_API_URL:', import.meta.env.VITE_API_URL);
//   console.log('  - BASE_URL:', BASE_URL);
//   console.log('  - url parameter:', url);
//   console.log('  - Final URL:', `${BASE_URL}${url}`);
  
//   try {
//     const response = await fetch(`${BASE_URL}${url}`, {
//       ...options,
//       headers: {
//         'Content-Type': 'application/json',
//         ...options.headers,
//       },
//     });

//     console.log('🔍 Response status:', response.status);
//     console.log('🔍 Response URL:', response.url);

//     // Handle different response statuses
//     if (!response.ok) {
//       if (response.status === 401) {
//         // Token expired or invalid - redirect to login
//         localStorage.removeItem('token');
//         window.location.href = '/';
//         return;
//       }

//       let errorData;
//       try {
//         errorData = await response.json();
//       } catch {
//         errorData = { message: 'Network error occurred' };
//       }

//       throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
//     }

//     // Return parsed JSON data
//     return await response.json();
//   } catch (error) {
//     console.error('🔍 Request failed:', error);
//     if (error.name === 'TypeError' && error.message.includes('fetch')) {
//       throw new Error('Network error - please check your internet connection');
//     }
//     throw error;
//   }
// };

// // Authentication API methods
// export const authAPI = {
//   // User login
//   login: async (email, password) => {
//     console.log('🔍 LOGIN REQUEST DATA:', { email, password });
//     const response = await makeRequest('/auth/login', {
//       method: 'POST',
//       body: JSON.stringify({ email, password }),
//     });
//     return response;
//   },

//   // User registration
//   register: async (userData) => {
//     const response = await makeRequest('/auth/register', {
//       method: 'POST',
//       body: JSON.stringify(userData),
//     });
//     return response;
//   },

//   // Verify current user token
//   verifyToken: async () => {
//     const token = getToken();
//     if (!token) return null;

//     const response = await makeRequest('/auth/verify', {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//       },
//     });
//     return response;
//   },

//   // Get current user profile
//   getCurrentUser: async () => {
//     const token = getToken();
//     if (!token) return null;

//     const response = await makeRequest('/auth/me', {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//       },
//     });
//     return response;
//   },
// };

// // FIXED: Notes API with proper error handling and response format
// export const notesAPI = {
//   getAllNotes: async () => {
//     try {
//       const token = localStorage.getItem('token');
//       console.log('🔐 Using token for getAllNotes:', token ? 'Token exists' : 'No token');

//       const response = await fetch('http://localhost:5000/api/notes', {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           ...(token && { 'Authorization': `Bearer ${token}` })
//         }
//       });

//       console.log('📋 getAllNotes Response status:', response.status);

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('❌ getAllNotes HTTP Error:', response.status, errorText);
//         throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//       }

//       const data = await response.json();
//       console.log('📋 getAllNotes Raw data:', data);

//       // FIXED: Handle the new backend response format
//       if (data.success && Array.isArray(data.data)) {
//         return {
//           success: true,
//           data: data.data, // Backend already formats the data correctly
//           message: 'Notes loaded successfully'
//         };
//       } else if (Array.isArray(data)) {
//         // Fallback for direct array response
//         return {
//           success: true,
//           data: data.map(note => ({
//             ...note,
//             _id: note.id || note._id,
//             createdAt: note.createdAt || note.created_at || new Date().toISOString(),
//             updatedAt: note.updatedAt || note.updated_at || new Date().toISOString(),
//             tags: note.tags || []
//           })),
//           message: 'Notes loaded successfully'
//         };
//       } else {
//         return data;
//       }
//     } catch (error) {
//       console.error('❌ getAllNotes Error:', error);
//       throw error; // Let the component handle the error
//     }
//   },

//   createNote: async (noteData) => {
//     try {
//       const token = localStorage.getItem('token');
//       console.log('🔐 Using token for createNote:', token ? 'Token exists' : 'No token');
//       console.log('📝 Creating note with data:', noteData);

//       // FIXED: Clean data validation
//       if (!noteData.title || !noteData.title.trim()) {
//         throw new Error('Title is required');
//       }
      
//       if (!noteData.content || !noteData.content.trim()) {
//         throw new Error('Content is required');
//       }

//       const cleanNoteData = {
//         title: noteData.title.trim(),
//         content: noteData.content.trim(),
//         tags: Array.isArray(noteData.tags) ? noteData.tags : [],
//         isPublic: Boolean(noteData.isPublic || false)
//       };

//       console.log('📝 Cleaned note data:', cleanNoteData);

//       const response = await fetch('http://localhost:5000/api/notes', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           ...(token && { 'Authorization': `Bearer ${token}` })
//         },
//         body: JSON.stringify(cleanNoteData)
//       });

//       console.log('📝 createNote Response status:', response.status);

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         console.log('❌ createNote Error response:', errorData);
//         throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
//       }

//       const data = await response.json();
//       console.log('✅ createNote Success data:', data);

//       // FIXED: Handle the new backend response format
//       if (data.success && data.data) {
//         return data.data; // Return the note directly for the component
//       } else {
//         // Fallback format
//         return {
//           ...data,
//           _id: data.id || data._id,
//           createdAt: data.createdAt || new Date().toISOString(),
//           updatedAt: data.updatedAt || new Date().toISOString(),
//           tags: data.tags || []
//         };
//       }
//     } catch (error) {
//       console.error('❌ createNote Error:', error);
//       throw error; // Let the component handle the error
//     }
//   },

//   updateNote: async (noteId, noteData) => {
//     try {
//       const token = localStorage.getItem('token');
//       console.log('🔐 Using token for updateNote:', token ? 'Token exists' : 'No token');
//       console.log('✏️ Updating note ID:', noteId, 'with data:', noteData);

//       const cleanNoteData = {
//         title: noteData.title?.trim(),
//         content: noteData.content?.trim(),
//         tags: Array.isArray(noteData.tags) ? noteData.tags : [],
//         isPublic: noteData.isPublic !== undefined ? Boolean(noteData.isPublic) : undefined
//       };

//       // Remove undefined values
//       Object.keys(cleanNoteData).forEach(key => {
//         if (cleanNoteData[key] === undefined) {
//           delete cleanNoteData[key];
//         }
//       });

//       console.log('✏️ Cleaned update data:', cleanNoteData);

//       const response = await fetch(`http://localhost:5000/api/notes/${noteId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           ...(token && { 'Authorization': `Bearer ${token}` })
//         },
//         body: JSON.stringify(cleanNoteData)
//       });

//       console.log('✏️ updateNote Response status:', response.status);

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         console.log('❌ updateNote Error response:', errorData);
//         throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
//       }

//       const data = await response.json();
//       console.log('✅ updateNote Success data:', data);

//       // FIXED: Handle the new backend response format
//       if (data.success && data.data) {
//         return data.data; // Return the note directly for the component
//       } else {
//         // Fallback format
//         return {
//           ...data,
//           _id: data.id || data._id,
//           createdAt: data.createdAt || new Date().toISOString(),
//           updatedAt: data.updatedAt || new Date().toISOString(),
//           tags: data.tags || []
//         };
//       }
//     } catch (error) {
//       console.error('❌ updateNote Error:', error);
//       throw error; // Let the component handle the error
//     }
//   },

//   deleteNote: async (noteId) => {
//     try {
//       const token = localStorage.getItem('token');
//       console.log('🔐 Using token for deleteNote:', token ? 'Token exists' : 'No token');
//       console.log('🗑️ Deleting note ID:', noteId);

//       const response = await fetch(`http://localhost:5000/api/notes/${noteId}`, {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//           ...(token && { 'Authorization': `Bearer ${token}` })
//         }
//       });

//       console.log('🗑️ deleteNote Response status:', response.status);

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         console.log('❌ deleteNote Error response:', errorData);
//         throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
//       }

//       const data = await response.json();
//       console.log('✅ deleteNote Success data:', data);

//       return data; // Return the success response
//     } catch (error) {
//       console.error('❌ deleteNote Error:', error);
//       throw error; // Let the component handle the error
//     }
//   }
// };

// // Network status checker (bonus feature)
// export const networkUtils = {
//   isOnline: () => navigator.onLine,
  
//   // Retry a failed request
//   retryRequest: async (requestFn, maxRetries = 3, delay = 1000) => {
//     let lastError;
    
//     for (let i = 0; i < maxRetries; i++) {
//       try {
//         return await requestFn();
//       } catch (error) {
//         lastError = error;
//         if (i < maxRetries - 1) {
//           await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
//         }
//       }
//     }
    
//     throw lastError;
//   },
// };

// // Export all APIs
// export default {
//   auth: authAPI,
//   notes: notesAPI,
//   network: networkUtils,
// };
// FIXED API with better authentication handling
// FIXED API with proper authentication handling

console.log('🔍 Environment check:');
console.log('  - import.meta.env:', import.meta.env);

// Fix the BASE_URL
let BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
if (BASE_URL === 'http://localhost:5000') {
  BASE_URL = 'http://localhost:5000/api';
}

console.log('  - Final BASE_URL:', BASE_URL);

// FIXED: Better token management
const getToken = () => {
  let token = localStorage.getItem('token');
  
  console.log('🔐 Token check:', {
    localStorage: localStorage.getItem('token'),
    finalToken: token,
    tokenExists: !!token
  });
  
  return token;
};

// FIXED: Enhanced makeRequest with better auth handling
const makeRequest = async (url, options = {}) => {
  console.log('🔍 DEBUG - API REQUEST:');
  console.log('  - Final URL:', `${BASE_URL}${url}`);
  
  try {
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    console.log('📤 Request config:', config);

    const response = await fetch(`${BASE_URL}${url}`, config);

    console.log('📥 Response status:', response.status);
    console.log('📥 Response URL:', response.url);

    // Handle different response statuses
    if (!response.ok) {
      if (response.status === 401) {
        console.log('🚨 401 Unauthorized - Token invalid/expired');
        // Clear invalid tokens
        localStorage.removeItem('token');
        
        // Don't redirect immediately, let the component handle it
        const errorData = await response.json().catch(() => ({ message: 'Unauthorized' }));
        throw new Error(errorData.message || 'Authentication failed');
      }

      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: 'Network error occurred' };
      }

      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    // Return parsed JSON data
    return await response.json();
  } catch (error) {
    console.error('🔍 Request failed:', error);
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error - please check your internet connection');
    }
    throw error;
  }
};

// FIXED: Authentication API methods
export const authAPI = {
  login: async (email, password) => {
    console.log('🔍 LOGIN REQUEST DATA:', { email });
    const response = await makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    console.log('✅ Login response:', response);
    return response; // Don't store token here, let AuthContext handle it
  },

  register: async (userData) => {
    const response = await makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    console.log('✅ Register response:', response);
    return response; // Don't store token here, let AuthContext handle it
  },

  // FIXED: Changed from GET to POST method to match your backend
  verifyToken: async () => {
    const token = getToken();
    if (!token) {
      console.log('⚠️ No token to verify');
      throw new Error('No token found');
    }

    console.log('🔍 Verifying token with backend...');
    
    try {
      const response = await makeRequest('/auth/verify', {
        method: 'POST', // ← FIXED: Changed from GET to POST
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      console.log('✅ Token verification successful:', response);
      return response;
    } catch (error) {
      console.log('❌ Token verification failed:', error.message);
      // Clear invalid token
      localStorage.removeItem('token');
      throw error;
    }
  },

  getCurrentUser: async () => {
    const token = getToken();
    if (!token) return null;

    try {
      const response = await makeRequest('/auth/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.log('❌ Get current user failed:', error.message);
      return null;
    }
  },

  // FIXED: Added proper logout method
  logout: async () => {
    const token = getToken();
    console.log('🚪 Logging out...');
    
    if (token) {
      try {
        await makeRequest('/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        console.log('✅ Server logout successful');
      } catch (error) {
        console.log('⚠️ Server logout failed, but continuing with local logout:', error.message);
      }
    }
    
    // Always clear local storage
    localStorage.removeItem('token');
    console.log('🚪 Local tokens cleared');
  }
};

// FIXED: Notes API with better error handling
export const notesAPI = {
  getAllNotes: async () => {
    const token = getToken();
    console.log('🔐 getAllNotes - Token exists:', !!token);

    if (!token) {
      throw new Error('No authentication token found. Please log in again.');
    }

    try {
      const response = await fetch(`${BASE_URL}/notes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('📋 getAllNotes Response status:', response.status);

      if (response.status === 401) {
        localStorage.removeItem('token');
        throw new Error('Authentication expired. Please log in again.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📋 getAllNotes Raw data:', data);

      // Handle your backend's response format (it returns array directly)
      if (Array.isArray(data)) {
        return {
          success: true,
          data: data,
          message: 'Notes loaded successfully'
        };
      } else {
        return data;
      }
    } catch (error) {
      console.error('❌ getAllNotes Error:', error);
      throw error;
    }
  },

  createNote: async (noteData) => {
    const token = getToken();
    console.log('🔐 createNote - Token exists:', !!token);

    if (!token) {
      throw new Error('No authentication token found. Please log in again.');
    }

    try {
      if (!noteData.title || !noteData.title.trim()) {
        throw new Error('Title is required');
      }
      
      if (!noteData.content || !noteData.content.trim()) {
        throw new Error('Content is required');
      }

      const cleanNoteData = {
        title: noteData.title.trim(),
        content: noteData.content.trim(),
        isPublic: Boolean(noteData.isPublic || false)
      };

      console.log('📝 Creating note with clean data:', cleanNoteData);

      const response = await fetch(`${BASE_URL}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cleanNoteData)
      });

      console.log('📝 createNote Response status:', response.status);

      if (response.status === 401) {
        localStorage.removeItem('token');
        throw new Error('Authentication expired. Please log in again.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ createNote Success data:', data);

      // Your backend returns the note object directly
      return data;
    } catch (error) {
      console.error('❌ createNote Error:', error);
      throw error;
    }
  },

  updateNote: async (noteId, noteData) => {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found. Please log in again.');
    }

    try {
      const cleanNoteData = {
        title: noteData.title?.trim(),
        content: noteData.content?.trim(),
        isPublic: noteData.isPublic !== undefined ? Boolean(noteData.isPublic) : undefined
      };

      // Remove undefined values
      Object.keys(cleanNoteData).forEach(key => {
        if (cleanNoteData[key] === undefined) {
          delete cleanNoteData[key];
        }
      });

      const response = await fetch(`${BASE_URL}/notes/${noteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cleanNoteData)
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        throw new Error('Authentication expired. Please log in again.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ updateNote Error:', error);
      throw error;
    }
  },

  deleteNote: async (noteId) => {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found. Please log in again.');
    }

    try {
      const response = await fetch(`${BASE_URL}/notes/${noteId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        throw new Error('Authentication expired. Please log in again.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ deleteNote Error:', error);
      throw error;
    }
  }
};

// Export all APIs
export default {
  auth: authAPI,
  notes: notesAPI,
};

// src/services/api.js
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
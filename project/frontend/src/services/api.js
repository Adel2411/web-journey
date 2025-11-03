export const BASE_URL = "http://localhost:5000/api";

export const authFetch = async (url, options = {}, token) => {
    try {
        const res = await fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(token ? { "Authorization": `Bearer ${token}` } : {}),
                ...options.headers
            }
        });

        
        if (res.status === 401) {
            
            localStorage.removeItem("token");
            
            window.location.href = "/login";
            throw new Error("Unauthorized - please login again");
        }

        const text = await res.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch {
            data = text;
        }

        if (!res.ok) throw new Error(data?.message || data || "Request failed");
        return data;

    } catch (error) {
        throw new Error(error.message || "Network error occurred");
    }
};


export const loginUser = async (email , password) => {
    return authFetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        body: JSON.stringify({ email, password })
    });
}

export const registerUser = async (email, password, confirmPassword, name, age, role) => {
    return authFetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        body: JSON.stringify({
            email,
            password,
            confirmPassword,
            name,
            age: parseInt(age),
            role
        })
    });
};

export const getAllNotes = async (token) => {
    return authFetch(`${BASE_URL}/notes`, { method: "GET" }, token);
}

export const createNote = async (noteData, token) => {
    return authFetch(`${BASE_URL}/notes`, {
        method: "POST",
        body: JSON.stringify(noteData)
    }, token);
}

export const updateNote = async (id, noteData, token) => {
   return authFetch(`${BASE_URL}/notes/${id}`, {
        method: "PUT",
        body: JSON.stringify(noteData)
    }, token);
}

export const deleteNote = async (id, token) => {
    return authFetch(`${BASE_URL}/notes/${id}`, {
        method: "DELETE"
    }, token);
}
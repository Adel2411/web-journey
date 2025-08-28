export const BASE_URL = "http://localhost:5000/api";

export const loginUser = async (email , password) => {
    try {
        const res = await fetch(`${BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Login failed");
        }

        return data;
    } catch (error) {
        throw new Error(error.message || "Network error occurred");
    }
}

export const registerUser = async (email, password, confirmPassword, name, age, role) => {
    try {
        const res = await fetch(`${BASE_URL}/auth/register`, {
            method: "POST", 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                email, 
                password, 
                confirmPassword, 
                name, 
                age: parseInt(age), 
                role 
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Registration failed");
        }

        return data;
    } catch (error) {
        throw new Error(error.message || "Network error occurred");
    }
};
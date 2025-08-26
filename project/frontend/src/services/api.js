export const BASE_URL = "http://localhost:5000/api";

export const loginUser = async (email , password) => {
    const res = fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    })

    const data = res.json({email, password})

    if (!res.ok) {
        throw new Error(data.message || "Login failed"); // throws error if login failed
    }

    return data;
}
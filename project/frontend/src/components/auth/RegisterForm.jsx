import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const RegisterForm = ({ onClose, onSwitchToLogin }) => {
    const { register, loading } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        age: "",
        role: "user" //Default
    });
    
    const [error, setError] = useState("");


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (error) {
            setError("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();  
        setError("");

        try {
            const res = await register(formData);
            
            if (!res.success) {
                setError(res.message);
            } else {
                // Close modal and navigate
                onClose?.();
                navigate("/notes");
            }
        } catch (err) {
            setError(err.message || "Something went wrong. Please try again.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            {/* Email Input */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email *
                </label>
                <input 
                    type="email"
                    name="email"
                    placeholder="Enter your email" 
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#2a2a3a] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-colors"
                    required
                />
            </div>

            {/* Password Input */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password *
                </label>
                <input 
                    type="password" 
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#2a2a3a] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-colors"
                    required
                />
            </div>

            {/* Confirm Password Input */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password *
                </label>
                <input 
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword} 
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#2a2a3a] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-colors"
                    required
                />
            </div>

            {/* Name Input */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name *
                </label>
                <input 
                    type="text" 
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#2a2a3a] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-colors"
                    required
                />  
            </div>

            {/* Age Input */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Age *
                </label>
                <input 
                    type="number"
                    name="age"
                    placeholder="Enter your age"
                    value={formData.age}
                    onChange={handleChange}
                    min="18"
                    max="120"
                    className="w-full px-4 py-3 bg-[#2a2a3a] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-colors"
                    required
                />
            </div>

            {/* Role Selection */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Role
                </label>
                <select 
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#2a2a3a] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-colors"
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {/* Register Button */}
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating Account...
                    </div>
                ) : (
                    "Create Account"
                )}
            </button>

            {/* Sign In Link */}
            <div className="text-center">
                <button
                    type="button"
                    className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
                    onClick={onSwitchToLogin}
                >
                    Already have an account? Sign in
                </button>
            </div>
        </form>
    );
};
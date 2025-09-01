import { useContext, useState } from "react"
import { AuthContext } from "../../contexts/AuthContext"
import { useNavigate } from "react-router-dom";

export const LoginForm = ({ onClose, onSwitchToRegister }) => {
    const { login, loading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    
    const handleSubmit = async (e) => {
        e.preventDefault();  
        setError("");

        try {
            const res = await login(
                email, 
                password
            );
            
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                </label>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-[#2a2a3a] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-colors"
                    required
                />
            </div>

            {/* Password Input */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                </label>
                <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-[#2a2a3a] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-colors"
                    required
                />
            </div>

            {/* Remember Me Checkbox */}
            <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="w-4 h-4 text-cyan-600 bg-[#2a2a3a] border-gray-600 rounded focus:ring-cyan-400 focus:ring-2"
                />
                <span>Remember me</span>
            </label>

            {/* Error Message */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {/* Login Button */}
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Signing In...
                    </div>
                ) : (
                    "Sign In"
                )}
            </button>

            {/* Sign Up Link */}
            <div className="text-center">
                <button
                    type="button"
                    className="text-cyan-600 hover:text-cyan-500 text-sm font-medium transition-colors"
                    onClick={() => onSwitchToRegister()}
                >
                    Don't have an account? Sign up
                </button>
            </div>
        </form>
    )
}
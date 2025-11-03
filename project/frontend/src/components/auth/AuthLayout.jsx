import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { useEffect } from "react";


export const AuthLayout = ({
  showLogin,
  showRegister,
  closeModal,
  switchToRegister,
  switchToLogin
}) => {

    useEffect(() => {
        const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
        };

        if (showLogin || showRegister) {
        document.addEventListener('keydown', handleEscape);
        document.body.style.overflow = 'hidden'; 
        }

        return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
        };
    }, [showLogin, showRegister]);

    return (
        <>
            {/* Login Modal */}
            {showLogin && (
                <div 
                className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                onClick={closeModal}
                >
                <div 
                    className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border border-[#2c2c3e]/50 rounded-xl shadow-2xl max-w-sm w-full mx-4 overflow-hidden backdrop-blur-lg transform transition-all duration-200"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Modal Header */}
                    <div className="flex justify-between items-center p-6 border-b border-[#2c2c3e]/50 bg-gradient-to-r from-[#1e1e3f] to-[#1a1a2e]">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                        </svg>
                        </div>
                        Welcome Back
                    </h2>
                    
                    <button
                        onClick={closeModal}
                        className="text-gray-400 hover:text-white transition-all duration-200 p-2 rounded-lg hover:bg-[#2a2a3a]/50 hover:rotate-90 transform"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                    </div>
                
                    {/* Modal Content */}
                    <div className="p-6">
                    <div className="text-center mb-4">
                        <p className="text-gray-400 text-sm">
                        Sign in to access your notes
                        </p>
                    </div>
                    <LoginForm 
                        onClose={closeModal}
                        onSwitchToRegister={switchToRegister}
                    />
                    </div>
                </div>
                </div>
            )}


            {/* Register Modal */}
            {showRegister && (
                <div 
                className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                onClick={closeModal}
                >
                <div 
                    className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border border-[#2c2c3e]/50 rounded-xl shadow-2xl max-w-sm w-full mx-4 max-h-[85vh] overflow-hidden backdrop-blur-lg transform transition-all duration-200"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Modal Header */}
                    <div className="flex justify-between items-center p-4 border-b border-[#2c2c3e]/50 bg-gradient-to-r from-[#1e1e3f] to-[#1a1a2e]">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                        </svg>
                        </div>
                        Join Us
                    </h2>
                    
                    <button
                        onClick={closeModal}
                        className="text-gray-400 hover:text-white transition-all duration-200 p-2 rounded-lg hover:bg-[#2a2a3a]/50 hover:rotate-90 transform"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                    </div>
                
                    {/* Modal Content - Scrollable */}
                    <div className="p-4 max-h-[calc(85vh-80px)] overflow-y-auto custom-scrollbar">
                    <div className="text-center mb-4">
                        <p className="text-gray-400 text-sm">
                        Create your account to get started
                        </p>
                    </div>
                    <RegisterForm 
                        onClose={closeModal}
                        onSwitchToLogin={switchToLogin}
                    />
                    </div>
                </div>
                </div>
            )}
        </>
    )

}
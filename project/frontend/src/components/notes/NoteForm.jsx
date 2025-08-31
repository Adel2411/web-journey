import { useState } from "react";
import { Check, X } from "lucide-react";

export const NoteForm = ({
    mode,
    initialData = { title: "", content: "", isPublic: true }, 
    onSubmit, 
    onCancel, 
    loading = false
}) => {

    const [title, setTitle] = useState(initialData.title);
    const [content, setContent] = useState(initialData.content);
    const [isPublic, setIsPublic] = useState(initialData.isPublic)

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ title, content, isPublic });
    };

    return (
        <>
            <div 
                className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                onClick={onCancel}
            >
                <div 
                className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border border-[#2c2c3e]/50 rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-[85vh] overflow-hidden backdrop-blur-lg transform transition-all duration-200"
                onClick={(e) => e.stopPropagation()}
                >
                {/* Modal Header */}
                <div className="flex justify-between items-center p-6 border-b border-[#2c2c3e]/50 bg-gradient-to-r from-[#1e1e3f] to-[#1a1a2e]">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                    </div>
                    {mode === "edit" ? "Edit Note" : "Create Note"}
                    </h2>
                    
                    <button
                    onClick={onCancel}
                    className="text-gray-400 hover:text-white transition-all duration-200 p-2 rounded-lg hover:bg-[#2a2a3a]/50 hover:rotate-90 transform"
                    >
                    <X className="w-4 h-4" />
                    </button>
                </div>
                
                {/* Modal Content */}
                <div className="p-6 max-h-[calc(85vh-80px)] overflow-y-auto">
                    <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Title</label>
                        <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-3 bg-[#2a2a3f] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        placeholder="Enter note title..."
                        required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Content</label>
                        <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full h-32 px-4 py-3 bg-[#2a2a3f] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none transition-all"
                        placeholder="Write your note content..."
                        required
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                        type="checkbox"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <label htmlFor={`public-toggle`} className="text-sm text-gray-300">
                        Make this note public
                        </label>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-cyan-600 hover:bg-cyan-700 disabled:from-cyan-400 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                        >
                        {loading ? (
                            <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            {mode === "edit" ? "Updating..." : "Saving..."}
                            </>
                        ) : (
                            <>
                            <Check size={16} />
                            {mode === "edit" ? "Update" : " Create"} Note
                            </>
                        )}
                        </button>
                        <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-all"
                        >
                        Cancel
                        </button>
                    </div>
                    </form>
                </div>
                </div>
            </div>
        </>
    )
}
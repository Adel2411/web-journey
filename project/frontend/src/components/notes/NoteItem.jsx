import { Lock, Users, Heart, MoreVertical, X, Check } from "lucide-react";
import { useState } from "react";
import { deleteNote, updateNote } from "../../services/api";

const NoteItem = ({
  note,
  onShowFull,
  full = false,
  isLiked = false,
  onToggleLike,
  currentUserId,
  onNoteUpdated, 
  onNoteDeleted
}) => {
  // note content
  const displayedContent =
    note.content.length > 100 ? note.content.slice(0, 100) + "…" : note.content;
  
  // note author
  const getAuthorName = () => {
    if (note.user?.name) {
      return note.user.name;
    }
    return "Unknown";
  };

  const isOwner = currentUserId && note.user?.id === currentUserId;
  const author = getAuthorName();

  // note creation date
  const created = new Date(note.createdAt).toLocaleDateString();

  // privacy indicator
  const privacyIndicatorColor = note.isPublic
    ? "bg-green-600"
    : "bg-orange-500";
  const privacyIndicatorLabel = note.isPublic ? "Public" : "Private";
  const privacyIndicatorIcon = note.isPublic ? (
    <Users className="w-4 h-4" />
  ) : (
    <Lock className="w-4 h-4" />
  );

  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  const [editModal, setEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);
  const [editIsPublic, setEditIsPublic] = useState(note.isPublic);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const token = localStorage.getItem("token");
      const updatedNote = await updateNote(
        note.id,
        {
          title: editTitle,
          content: editContent,
          isPublic: editIsPublic,
        },
        token
      );

      setEditModal(false);
      closeMenu();

      // Call parent callback to update the note list
      if (onNoteUpdated) {
        onNoteUpdated(updatedNote);
      }
    } catch (error) {
      console.error("Failed to update note:", error);
      alert("Failed to update note. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const token = localStorage.getItem("token");
      await deleteNote(note.id, token);

      setShowDeleteConfirm(false);
      closeMenu();

      // Call parent callback to remove note from list
      if (onNoteDeleted) {
        onNoteDeleted(note.id);
      }
    } catch (error) {
      console.error("Failed to delete note:", error);
      alert("Failed to delete note. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelEdit = () => {
    setEditModal(false);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditIsPublic(note.isPublic);
    closeMenu();
  };

  const openEditModal = () => {
    setEditModal(true);
    closeMenu();
  };

  const openDeleteConfirm = () => {
    setShowDeleteConfirm(true);
    closeMenu();
  };

  return (
    <>
      {/* Edit Modal */}
      {editModal && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={cancelEdit}
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
                Edit Note
              </h2>
              
              <button
                onClick={cancelEdit}
                className="text-gray-400 hover:text-white transition-all duration-200 p-2 rounded-lg hover:bg-[#2a2a3a]/50 hover:rotate-90 transform"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          
            {/* Modal Content */}
            <div className="p-6 max-h-[calc(85vh-80px)] overflow-y-auto">
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Title</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-[#2a2a3f] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="Enter note title..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Content</label>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full h-32 px-4 py-3 bg-[#2a2a3f] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none transition-all"
                    placeholder="Write your note content..."
                    required
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id={`public-${note.id}`}
                    checked={editIsPublic}
                    onChange={(e) => setEditIsPublic(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <label htmlFor={`public-${note.id}`} className="text-sm text-gray-300">
                    Make this note public
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="flex-1 bg-cyan-600 hover:bg-cyan-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                  >
                    {isUpdating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Check size={16} />
                        Update Note
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Note Card */}
      <div
        className="bg-[#20202f] text-white rounded-2xl border border-transparent hover:border-blue-500 shadow-lg hover:shadow-[0_4px_24px_rgba(59,130,246,0.4)] hover:bg-[#2a2a3f] hover:scale-[1.015] hover:-translate-y-1 transition-all duration-300 ease-in-out p-5 flex flex-col min-h-[260px] relative"
        onMouseLeave={closeMenu}
      >
        {/* Small Delete Confirmation - stays small */}
        {showDeleteConfirm && (
          <div className="absolute top-2 right-2 bg-[#2a2a3a] border border-red-500/50 rounded-lg p-3 z-30 shadow-lg min-w-[200px]">
            <div className="text-center">
              <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </div>
              <p className="text-red-400 text-xs mb-3 font-medium">Delete this note?</p>
              
              <div className="flex gap-2">
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white py-1.5 px-3 rounded text-xs font-medium transition flex items-center gap-1"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-[10px]">...</span>
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    closeMenu();
                  }}
                  className="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded text-xs font-medium transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-start mb-3">
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full inline-flex items-center gap-1 ${privacyIndicatorColor}`}
          >
            {privacyIndicatorIcon}
            {privacyIndicatorLabel}
          </span>

          <button
            onClick={isOwner ? toggleMenu : ()=>{}}
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700 transition"
          >
            <MoreVertical size={18} />
          </button>

          {menuOpen && (
            <div className="absolute right-10 mt-2 w-36 bg-[#2a2a3a] rounded-lg shadow-xl border border-gray-600/50 ring-1 ring-black/5 overflow-hidden z-20">
              <div className="py-1">
                <button
                  onClick={openEditModal}
                  className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-200 hover:bg-[#3a3a4f] transition-colors duration-150 group"
                >
                  <svg
                    className="w-4 h-4 mr-3 text-gray-400 group-hover:text-blue-400 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={openDeleteConfirm}
                  className="flex items-center w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors duration-150 group border-t border-gray-600/30"
                >
                  <svg
                    className="w-4 h-4 mr-3 text-red-400 group-hover:text-red-300 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>

        {/* title */}
        <h3 className="text-lg font-semibold truncate mb-2" title={note.title}>
          {note.title}
        </h3>

        {/* content */}
        <p className="text-sm text-gray-200 flex-1 whitespace-pre-wrap leading-relaxed break-words mb-2">
          {full ? note.content : displayedContent}
        </p>

        {/* read-more */}
        {!full && note.content.length > 100 && (
          <button
            onClick={onShowFull}
            className="text-blue-400 text-[11px] sm:text-xs px-2 py-1 rounded hover:bg-blue-500/10 transition self-start"
          >
            Read More →
          </button>
        )}

        <div className="flex justify-between items-center text-xs text-gray-300 pt-3 border-t border-gray-700">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-gray-600 grid place-items-center text-[10px] font-bold uppercase">
              {author[0]}
            </span>
            <div className="flex flex-col leading-tight">
              <span className="truncate max-w-[140px]">Author : {author}</span>
              <time dateTime={note.createdAt}>{created}</time>
            </div>
          </div>

          <button onClick={onToggleLike} title={isLiked ? "Unlike" : "Like"}>
            <Heart
              className={`w-6 h-6 transition ${
                isLiked
                  ? "text-red-500 fill-red-500"
                  : "text-gray-300 hover:text-red-500"
              }`}
            />
          </button>
        </div>
      </div>
    </>
  );
};

export default NoteItem;
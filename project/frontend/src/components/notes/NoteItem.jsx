import { Lock, Users, Heart, MoreVertical } from 'lucide-react';
import { useState } from 'react';

const NoteItem = ({ note, onShowFull, full = false, isLiked = false,  onToggleLike }) => {
  // note content
  const displayedContent = note.content.length > 100
    ? note.content.slice(0, 100) + '…'
    : note.content;
  // note author
  const author  = note.authorName || 'Unknown';
  // note creation date
  const created = new Date(note.createdAt).toLocaleDateString();
  // privacy indicator
  const privacyIndicatorColor = note.isPublic ? 'bg-green-600' : 'bg-orange-500';
  const privacyIndicatorLabel = note.isPublic ? 'Public' : 'Private';
  const privacyIndicatorIcon = note.isPublic ? <Users className="w-4 h-4" /> : <Lock  className="w-4 h-4" />;
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="bg-[#20202f] text-white rounded-2xl border border-transparent hover:border-blue-500 shadow-lg hover:shadow-[0_4px_24px_rgba(59,130,246,0.4)] hover:bg-[#2a2a3f] hover:scale-[1.015] hover:-translate-y-1 transition-all duration-300 ease-in-out p-5 flex flex-col min-h-[260px]">
      <div className="flex justify-between items-start mb-3">
        <span className={`text-xs font-semibold px-3 py-1 rounded-full inline-flex items-center gap-1 ${privacyIndicatorColor}`}>
          {privacyIndicatorIcon}
          {privacyIndicatorLabel}
        </span>

        
        <button className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700 transition">
          <MoreVertical size={18} />
        </button>
      </div>

      {/* title */}
      <h3 className="text-lg font-semibold truncate mb-2" title={note.title}>
        {note.title}
      </h3>

      {/* content */}
      <p className="text-sm text-gray-200 flex-1 whitespace-pre-wrap leading-relaxed break-words mb-2">
        {full ? note.content : displayedContent}
      </p>

      {/* read‑more */}
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

        <button onClick={onToggleLike} title={isLiked ? 'Unlike' : 'Like'}>
          <Heart className={`w-6 h-6 transition ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-300 hover:text-red-500'}`}/>
        </button>
      </div>
    </div>
  );
};

export default NoteItem;

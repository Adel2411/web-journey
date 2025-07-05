import React, { useState } from "react";
import { format } from "date-fns";

const NoteItem = ({ note }) => {
  const isPublic = note.isPublic;
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const contentPreview = note.content.length > 100
    ? note.content.substring(0, 100) + "..."
    : note.content;

  return (
    <div
      className={`bg-white border-l-4 p-4 rounded-lg shadow-md transition-shadow hover:shadow-lg ${
        isPublic ? "border-green-500" : "border-orange-500"
      }`}
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{note.title}</h2>
      <p className="text-sm text-gray-600 mb-2">
        {isExpanded ? note.content : contentPreview}
      </p>

      {note.content.length > 100 && (
        <button
          onClick={toggleExpand}
          className="text-blue-500 text-sm font-medium hover:underline transition"
        >
          {isExpanded ? "Show less" : "Read more"}
        </button>
      )}

      <div className="text-xs text-gray-500 flex justify-between items-center mt-2">
        <span>By {note.authorName}</span>
        <span>{format(new Date(note.createdAt), "PPP")}</span>
      </div>

      <div
        className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
          isPublic
            ? "bg-green-100 text-green-800"
            : "bg-orange-100 text-orange-800"
        }`}
      >
        {isPublic ? "Public" : "Private"}
      </div>
    </div>
  );
};

export default NoteItem;





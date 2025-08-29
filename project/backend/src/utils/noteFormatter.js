// formatting one note
export const formatNote = (note) => {
  return {
    id: note.id,
    title: note.title,
    content: note.content,
    // Prefer live user.name when available to reflect current profile name
    authorName: note.user?.name ?? note.authorName,
    isPublic: note.isPublic,
    createdAt: note.createdAt?.toISOString(),
    updatedAt: note.updatedAt?.toISOString(),
  };
};

// formatting array of notes
export const formatNotes = (notes) => {
  return notes.map(formatNote);
};

// formatting one note
export const formatNote = (note) => {
  return {
    id: note.id,
    title: note.title,
    content: note.content,
    authorName: note.authorName,
    isPublic: note.isPublic,
    createdAt: note.createdAt?.toISOString(),
    updatedAt: note.updatedAt?.toISOString(),
  };
};

// formatting array of notes
export const formatNotes = (notes) => {
  return notes.map(formatNote);
};

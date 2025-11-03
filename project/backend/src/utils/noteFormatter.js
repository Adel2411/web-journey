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
    user: note.user ? {
      id: note.user.id,
      name: note.user.name,
      email: note.user.email
    } : undefined,
    userId: note.userId
  };
};

// formatting array of notes
export const formatNotes = (notes) => {
  return notes.map(formatNote);
};

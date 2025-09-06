export function formatNote(note) {
  return {
    id: note.id,
    title: note.title,
    content: note.content,
    author: note.user ? note.user.name : "Anonymous",  
    isPublic: note.isPublic ?? false,
    createdAt: note.createdAt.toISOString(),
    updatedAt: note.updatedAt.toISOString(),
    user: note.user ? { id: note.user.id, name: note.user.name } : null,
  };
}

export function formatNotes(notes) {
  return notes.map(formatNote);
}

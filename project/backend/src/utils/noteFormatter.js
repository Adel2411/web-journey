export function formatNote(note) {
  return {
    id: note.id,
    title: note.title,
    content: note.content,
    author: note.author || "Anonymous",
    isPublic: note.isPublic ?? false,
    createdAt: note.createdAt.toISOString(),
    updatedAt: note.updatedAt.toISOString(),
  };
}

export function formatNotes(notes) {
  return notes.map(formatNote);
}

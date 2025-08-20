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

export const formatUserNote = (note, user) => {
	return {
		id: note.id,
		title: note.title,
		content: note.content,
		authorName: note.authorName,
		isPublic: note.isPublic,
		createdAt: note.createdAt?.toISOString(),
		updatedAt: note.updatedAt?.toISOString(),
		user: {
			id: user.id,
			name: user.name,
			email: user.email,
		},
	};
};

// formatting array of notes
export const formatNotes = (notes) => {
	return notes.map(formatNote);
};

export const formatUserNotes = (notes, user) => {
	return notes.map((note) => {
		return formatUserNote(note, user);
	});
};

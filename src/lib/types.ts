export interface CreateNoteRequest {
	title: string;
	content: string;
}

export interface Note {
	id: string;
	title: string;
	content: string;
	ownerId: string;
	createdAt: string;
	updatedAt: string;
}

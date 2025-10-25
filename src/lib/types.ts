import { Interface } from "readline";

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

export interface StoreState {
	shareableLink: string | null;
	setShareableLink: (link: string | null) => void;
	// Add other properties as needed
}

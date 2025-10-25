import { create } from "zustand";

const useStore = create((set) => ({
	shareableLink: null,
	setShareableLink: (link: string | null) => set({ shareableLink: link }),
	updateShareableLink: (link: string | null) => set({ shareableLink: link }),
}));

export default useStore;

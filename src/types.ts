export type Note = {
	midi: number;
	start: number;
	end: number;
	name: string;
	octave: number;
};

export type PreviewData = {
	channels: Note[][];
	lastTick: number;
	minMidi: number;
	maxMidi: number;
};
import { attributes, elements, fx, ref } from "@swrf/core";
import { noteSilence, previewData, tickOffset, tickPerUnit } from "./state";
import { Note } from "./types";

const { div, pre } = elements;
const { className: c, onclick } = attributes;

function serialize(
	notes: Note[],
	offset: number,
	silence: number,
	tpu: number
): number[] {
	const a: number[] = [];
	for (const note of notes) {
		const { midi, octave, start, end } = note;
		const startu = Math.floor((start - offset) / tpu);
		const endu = Math.ceil((end - offset - silence) / tpu);
		while (a.length < endu) {
			const pause = a.length < startu;
			const l = ((midi - 48) % 12) + 1;
			const o = (octave - 3) << 4;
			a.push(pause ? 0 : o + l);
		}
	}
	return a;
}

export function Serializer() {
	const columns = ref<HTMLElement>(
		div(c("text-danger"), "Please select a MIDI file")
	);

	fx(() => {
		const offset = tickOffset();
		const tpu = tickPerUnit();
		const silence = noteSilence();
		const channels = previewData()?.channels ?? [];
		if (channels.length === 0) return;

		columns(
			div(
				c("d-flex"),
				...channels.map((notes) => {
					const s = serialize(notes, offset, silence, tpu);
					const text = s.map((e) => e.toString(2).padStart(6, "0")).join("\n");
					const copy = (content: string) => () => {
						navigator.clipboard.writeText(content);
						alert("Copied to clipboard");
					};
					return div(c("d-flex border p-1"), pre(onclick(copy(text)), text));
				})
			)
		);
	});

	return div(c("my-3"), "Click to copy column (Channel)", columns);
}

import { attributes, bind, elements, fx, str } from "@swrf/core";
import {
	currentTick,
	midi,
	noteSilence,
	previewData,
	previewScroll,
	previewScrollMax,
	previewWidth,
	scrollFollow,
	tickOffset,
	tickPerPixel,
	tickPerUnit,
} from "./state";
import { Note } from "./types";

const { div, span, input, canvas } = elements;
const { className: c } = attributes;

export function Preview() {
	const previewCanvas = canvas(c("w-100"));
	const ctx = previewCanvas.getContext("2d")!;

	fx(() => {
		if (!midi()) return;
		const { tracks } = midi()!;
		const channels: Note[][] = [];
		let lastTick = 0;
		let minMidi = 0;
		let maxMidi = 0;
		for (const track of tracks) {
			notes: for (const note of track.notes) {
				const { midi, name, ticks: start, durationTicks, octave } = note;
				const end = start + durationTicks;
				if (end > lastTick) lastTick = end;
				if (midi < minMidi) minMidi = midi;
				if (midi > maxMidi) maxMidi = midi;
				const out: Note = { midi, start, end, name, octave };
				for (const channel of channels) {
					if (!channel.find((n) => n.start <= start && start < n.end)) {
						channel.push(out);
						continue notes;
					}
				}
				channels.push([out]);
			}
		}
		previewScrollMax(lastTick);
		previewData({ channels, lastTick, minMidi, maxMidi });
	});

	fx(() => {
		if (!previewData()) return;
		const { channels, lastTick, minMidi, maxMidi } = previewData()!;
		const CHANNEL_H = 20;
		const SCALE = 1 / tickPerPixel();
		const midiRange = maxMidi - minMidi;
		const silence = noteSilence();
		const scrollX = previewScroll();
		previewCanvas.height = channels.length * CHANNEL_H;
		previewCanvas.width = previewWidth();
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		const t = currentTick();
		const tpu = tickPerUnit() || 1;
		for (const channel of channels) {
			for (const note of channel) {
				const x = (note.start - scrollX) * SCALE;
				const y = channels.indexOf(channel) * CHANNEL_H;
				const w = Math.max(0, (note.end - scrollX - silence) * SCALE - x);
				const h = CHANNEL_H;
				ctx.fillStyle = `hsl(${
					((note.midi - minMidi) / midiRange) * 360
				}, 100%, ${note.start <= t && t < note.end ? 20 : 50}%)`;
				ctx.fillRect(x, y, w, h);
				ctx.strokeStyle = "black";
				ctx.strokeRect(x, y, w, h);
				if (ctx.measureText(note.name).width > w) continue;
				ctx.strokeStyle = "white";
				ctx.strokeText(note.name, x + w / 2, y + h / 2);
			}
		}
		ctx.strokeStyle = "black";
		for (let i = tickOffset(); i < lastTick; i += tpu) {
			const x = (i - scrollX) * SCALE;
			ctx.beginPath();
			ctx.moveTo(x, 0);
			ctx.lineTo(x, previewCanvas.height);
			ctx.stroke();
		}
	});

	const scrollFollowCheckbox = input(
		{
			type: "checkbox",
			checked: scrollFollow,
			onchange: () => scrollFollow(scrollFollowCheckbox.checked),
		},
		c("form-check-input mx-2")
	);

	const previewDiv = div(
		c("overflow-auto"),
		previewCanvas,
		input(
			{ type: "range", max: str(previewScrollMax) },
			c("w-100 form-range"),
			bind(str(previewScroll))
		),
		span("Scroll Tick ∈ [0,", previewScrollMax, "] = ", str(previewScroll)),
		div(scrollFollowCheckbox, span("Scroll Follow"))
	);

	new ResizeObserver(() => {
		previewWidth(previewDiv.clientWidth);
	}).observe(previewDiv);

	return previewDiv;
}

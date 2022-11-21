import { attributes, elements } from "@swrf/core";
import { Midi } from "@tonejs/midi";
import { now, PolySynth } from "tone";
import {
	currentTick,
	midi,
	playing,
	previewScroll,
	scrollFollow,
} from "./state";

const { button, div, input } = elements;
const { onclick, className: c, onchange } = attributes;

let synths: PolySynth[] = [];
let timeouts: number[] = [];

function start() {
	playing(true);
	const t = now();
	midi()!.tracks.forEach((track) => {
		const synth = new PolySynth().toDestination();
		synths.push(synth);
		track.notes.forEach((note) => {
			const { name, velocity, duration, time, ticks } = note;
			synth.triggerAttackRelease(name, duration, time + t, velocity);
			timeouts.push(
				setTimeout(() => {
					currentTick(ticks);
					if (scrollFollow()) {
						previewScroll(ticks);
					}
				}, time * 1000)
			);
		});
	});
}

function stop() {
	playing(false);
	synths.forEach((synth) => synth.disconnect());
	timeouts.forEach((timeout) => clearTimeout(timeout));
	timeouts = [];
	synths = [];
}

function FileInput() {
	const fileInput = input(
		c("form-control my-3"),
		{ type: "file" },
		onchange(async () => {
			const file = fileInput.files?.[0];
			if (!file) return;
			const m = new Midi(await file.arrayBuffer());
			stop();
			midi(m);
		})
	);

	return fileInput;
}

function Controls() {
	return div(
		button(
			c("btn btn-success"),
			onclick(start),
			{ disabled: () => !midi() || playing() },
			"Start"
		),
		button(
			c("btn btn-danger ms-2"),
			onclick(stop),
			{ disabled: () => !playing() },
			"Stop"
		)
	);
}

export function Player() {
	return div(FileInput(), Controls());
}

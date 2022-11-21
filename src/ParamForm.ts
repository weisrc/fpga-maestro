import { attributes, bind, elements, Ref, str } from "@swrf/core";
import { noteSilence, tickOffset, tickPerPixel, tickPerUnit } from "./state";

const { div, span, input } = elements;
const { className: c } = attributes;

function ParamInput(
	label: string,
	min: number,
	max: number,
	value: Ref<number>
) {
	const bond = bind(str(value));
	return div(
		c("my-1"),
		span(`${label} ∈ [${min},${max}]`),
		input(c("form-control"), { type: "number" }, bond),
		input(
			c("form-range"),
			{ type: "range", min: min + "", max: max + "" },
			bond
		)
	);
}

export function ParamForm() {
	return div(
		c("row my-3"),
		div(
			c("col-6"),
			ParamInput("Tick Offset", 0, 10000, tickOffset),
			ParamInput("Ticks Per Unit", 1, 1000, tickPerUnit)
		),
		div(
			c("col-6"),
			ParamInput("Note Silence", 0, 1000, noteSilence),
			ParamInput("Ticks Per Pixel", 1, 32, tickPerPixel)
		)
	);
}

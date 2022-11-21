import { attributes, elements } from "@swrf/core";

const { div, nav, span } = elements;
const { className: c } = attributes;

export function Navbar() {
	return nav(
		c("navbar bg-light"),
		div(c("container"), span(c("navbar-brand"), "FPGA Maestro"))
	);
}

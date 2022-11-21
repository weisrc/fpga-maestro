import { attributes, elements, render } from "@swrf/core";
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import { Navbar } from "./Navbar";
import { ParamForm } from "./ParamForm";
import { Player } from "./Player";
import { Preview } from "./Preview";
import { Serializer } from "./Serializer";
import "./style.css";

const { div } = elements;
const { className: c } = attributes;

function App() {
	return div(
		Navbar(),
		div(c("container"), Player(), ParamForm(), Preview(), Serializer())
	);
}

render(App, document.body);

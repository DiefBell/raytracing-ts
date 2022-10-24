import { Seraph, CanvasDisplay } from "@minecraftts/seraph";
import { renderLoop } from "./renderLoop";

// initialize the engine, this must be done before anything else
Seraph.initialize();

// create a canvas display, this is our canvas/window
const display = new CanvasDisplay(
    720,
    720,
    "Ray Tracing TS"
);

renderLoop(display);

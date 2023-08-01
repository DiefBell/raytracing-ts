import { type Keyboard, type Mouse } from "@minecraftts/seraph";
import { Camera } from "./camera/Camera";
import { constructCamera } from "./camera/ICamera";
import { Renderer } from "./renderer/Renderer";
import * as os from "os";
import { mainScene } from "./prefabs/scenes";

const NUM_RUNS = 10;

const WIDTH = 420;
const HEIGHT = 420;
const NUM_RENDER_THREADS = Math.floor(os.cpus().length - 1);

const keyboardStub: Partial<Keyboard> = {
	getKeyDown: () => false
};

const mouseStub: Partial<Mouse> = {
	getMouseX: () => WIDTH / 2,
	getMouseY: () => HEIGHT / 2,
	getButtonDown: () => false
};

const camera = constructCamera(
	Camera,
	WIDTH,
	HEIGHT,
	keyboardStub as Keyboard,
	mouseStub as Mouse,
	90 * Math.PI / 180,
	0.1,
	100
);

const scene = mainScene;

const renderer = new Renderer(1280, 720, NUM_RENDER_THREADS, camera, scene);


let totalTime = 0;
const main = async() =>
{
	let cont = true;
	process.on("SIGINT", () => { cont = false; });
	
	for(let i = 0; i <= NUM_RUNS; i++)
	{
		const render = await renderer.render();
		console.info(`Render completed in \x1b[1m\x1b[32m${ render.time.toFixed(2) } ms\x1b[0m.`);

        if(!cont) break;

        // don't count very first run
        if(i > 0) totalTime += render.time;
	}

    console.log(`\nCompleted ${NUM_RUNS} renders in an average of ${(totalTime/NUM_RUNS).toFixed(2)} ms.`)

};
main();

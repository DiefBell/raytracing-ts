import { type Keyboard, type Mouse } from "@minecraftts/seraph";
import { Camera } from "./camera/Camera";
import { constructCamera } from "./camera/ICamera";
import { Renderer } from "./renderer/Renderer";
import * as os from "os";
import { Scene, Sphere } from "./scene/Scene";

const WIDTH = 1280;
const HEIGHT = 720;
const NUM_RENDER_THREADS = Math.floor(os.cpus().length / 2);

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

const scene = new Scene([
	new Sphere(
		[ 0, 0, 0 ],
		0.5,
		[ 255, 0, 255 ]
	)
]);

const renderer = new Renderer(1280, 720, NUM_RENDER_THREADS, camera, scene);


const main = async() =>
{
	let cont = true;
	process.on("SIGINT", () => { cont = false; });
	
	while(cont)
	{
		const render = await renderer.render();
		console.info(`Render completed in \x1b[1m\x1b[32m${ render.time.toFixed(2) } ms\x1b[0m.`);
	}

};
main();

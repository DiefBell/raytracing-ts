import { type Keyboard, type Mouse } from "@minecraftts/seraph";
import { Camera } from "./camera/Camera";
import { constructCamera } from "./camera/ICamera";
import { Renderer } from "./renderer/Renderer";

const WIDTH = 1280;
const HEIGHT = 720;

const keyboardStub: Partial<Keyboard> = {
	getKeyDown: () => false
};

const mouseStub: Partial<Mouse> = {
	getMouseX: () => WIDTH / 2,
	getMouseY: () => HEIGHT / 2,
	getButtonDown: () => false
};

const renderer = new Renderer(1280, 720);

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

const main = async() =>
{
	let cont = true;
	process.on("SIGINT", () => { cont = false; });
	
	while(cont)
	{
		const render = await renderer.render(camera);
		console.info(`Render completed in \x1b[1m\x1b[32m${ render.time.toFixed(2) } ms\x1b[0m.`);
	}

};
main();

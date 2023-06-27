import { type CanvasDisplay } from "@minecraftts/seraph";
import { Camera } from "./camera/Camera";
import { constructCamera } from "./camera/ICamera";
import { Renderer } from "./renderer/Renderer";
import * as os from "os";
import { Scene } from "./scene/Scene";
import { Sphere } from "./scene/Sphere";


const NUM_RENDER_THREADS =
	// Math.floor(os.cpus().length / 2);
	// 1;
	// 2;
	os.cpus().length - 1;

export const renderLoop = async (display : CanvasDisplay) =>
{
    let context = display.getGraphics();

    const camera = constructCamera(
        Camera,
        display.getWidth(),
        display.getHeight(),
        display.getKeyboard(),
        display.getMouse(),
        90 * Math.PI / 180,
        0.1,
        100
    );

    const scene = new Scene(
        [
            // pink "floor" sphere
            new Sphere(
                [
                    0,
                    -7,
                    0
                ],
                7,
                0
            ),
            // blue floating sphere
            new Sphere(
                [
                    0, // positive x
                    1, // positive y
                    0.4 // positive is towards camera
                ],
                1,
                1
            ),
        ],
        [ 32, 32, 32 ]
    );
	
    const renderer = new Renderer(
		display.getWidth(),
		display.getHeight(),
		NUM_RENDER_THREADS,
		camera,
        scene
	);

    scene.on(
        "update",
        () =>
        {
            renderer.onSceneUpdate();
        }
    );

    display.on(
        "resize",
        (width, height) => 
{
            console.log(`Window resized to ${width} x ${height}.`);
            renderer.onResize(width, height);
            camera.onResize(width, height);
            // we need to get a new context everytime the window resizes
            // due to the old one being deleted
            context = display.getGraphics();
        }
    );

    let timer = performance.now();
    let renderLoopTime = 0;

    display.show();

    while(!display.shouldClose())
    {
        display.pollEvents();
        const cameraUpdateTime = camera.update(renderLoopTime);
        console.log(`\nCamera updated in \x1b[1m\x1b[34m${ cameraUpdateTime.toFixed(2) } ms\x1b[0m.`);

        const render = await renderer.render();
        console.info(`Render completed in \x1b[1m\x1b[32m${ render.time.toFixed(2) } ms\x1b[0m.`);

        context.putImageData(render.imageData, 0, 0);

        // swap buffers so what we just drew is visible on the screen
        display.swapBuffers();

        const currTime = performance.now();
        renderLoopTime = currTime - timer;
        timer = currTime;
        console.log(`Full render loop done in \x1b[1m\x1b[31m${ renderLoopTime.toFixed(2) } ms\x1b[0m.`);

        const additionalLatency = renderLoopTime - render.time;
        console.log(`Additional \x1b[1m\x1b[33m${ additionalLatency.toFixed(2) } ms\x1b[0m of latency displaying to canvas.`);
    }

    process.exit(0);
};

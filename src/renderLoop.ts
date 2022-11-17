import { CanvasDisplay } from "@minecraftts/seraph";
import { Camera } from "./camera/Camera";
import { constructCamera } from "./camera/ICamera";
import { Renderer } from "./renderer/Renderer";

export const renderLoop = (display : CanvasDisplay) =>
{
    const renderer = new Renderer(display.getWidth(), display.getHeight());

    const camera = constructCamera(
        Camera,
        display.getWidth(),
        display.getHeight(),
        display.getKeyboard(),
        display.getMouse(),
        {
            upRads: 30 * Math.PI / 180,
            downRads: 30 * Math.PI / 180,
            leftRads: 30 * Math.PI / 180,
            rightRads: 30 * Math.PI / 180
        },
        0.1,
        100
    );
    
    let context = display.getGraphics();

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
        camera.update(renderLoopTime);

        const render = renderer.render(camera);
        console.info(`\nRender completed in \x1b[1m\x1b[32m${ render.time.toFixed(2) } ms\x1b[0m.`);

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
};

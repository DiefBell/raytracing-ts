import type { CanvasDisplay } from "@minecraftts/seraph";
import { Renderer } from "./renderer/Renderer";

export const renderLoop = (display: CanvasDisplay) =>
{
    let context = display.getGraphics();

    const renderer = new Renderer(display.getWidth(), display.getHeight());

    display.on(
        "resize",
        (width, height) => {
            console.log(`Window resized to ${width} x ${height}.`);
            renderer.onResize(width, height);
            // we need to get a new context everytime the window resizes
            // due to the old one being deleted
            context = display.getGraphics();
        }
    );

    display.show();

    let timer = performance.now();

    while(!display.shouldClose())
    {
        // poll events (keyboard input, window events, etc)
        display.pollEvents();

        const render = renderer.render();
        console.info(`\nRender completed in \x1b[1m\x1b[31m${ render.time.toFixed(2) } ms\x1b[0m.`);

        context.putImageData(render.imageData, 0, 0);

        // swap buffers so what we just drew is visible on the screen
        display.swapBuffers();

        const currTime = performance.now();
        const renderLoopTime = currTime - timer;
        timer = currTime;
        console.log(`Full render loop done in \x1b[1m\x1b[32m${ renderLoopTime.toFixed(2) } ms\x1b[0m.`);

        const additionalLatency = renderLoopTime - render.time;
        console.log(`Additional \x1b[1m\x1b[33m${ additionalLatency.toFixed(2) } ms\x1b[0m of latency displaying to canvas.`);
    }
}
import { Renderer } from "./Renderer";

const renderer = new Renderer(1024, 1024);

let totalTime = 0;
let count = 0;
while(true)
{
    totalTime += renderer.Render();

    count++;
    if(count >= 25)
    {
        const average = totalTime / 25;
        console.log(`Previous 25 renders completed in an average of ${average.toFixed(2)} ms`);
        totalTime = 0;
        count = 0;
    }
}
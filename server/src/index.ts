import { Renderer } from "./Renderer";

const renderer = new Renderer(640, 360);

let totalTime = 0;
let count = 0;

while(true)
{
    totalTime += renderer.Render();
    
    count++;
    if(count >= 25)
    {
        console.log(`Previous 25 renders completed in an average of ${totalTime / 25} ms`);
        totalTime = 0;
        count = 0;
    }
}
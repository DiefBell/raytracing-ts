import { Renderer } from "./Renderer";
import * as websock from "ws";

const wss = new websock.WebSocketServer({ port: 3001 });

let debugged = false;

wss.on("connection", (ws) =>
{
    console.log("CONNECTED!");
    ws.binaryType = "arraybuffer";

    const renderer = new Renderer(1024, 1024);
    let connected = true;
    
    let totalTime = 0;
    let count = 0;
    while(connected)
    {
        totalTime += renderer.Render();
    
        count++;
        if(count >= 25)
        {
            console.log(`Previous 25 renders completed in an average of ${totalTime / 25} ms`);
            totalTime = 0;
            count = 0;
        }

        const imageDataFlattened = renderer.image.values.flat();
        const imageData8Bit = imageDataFlattened.map((val) => {
            // clamping is theoretically unneeded, but just in case....
            if(val < 0) return 0;
            if(val > 1) return 255;
            return val * 255;
        });
        const imageData = Uint8ClampedArray.from(imageData8Bit);
        ws.send(imageData);

        if(!debugged) {
            console.log(renderer.image.values);
            debugged = true;
        }
    }

    ws.on("error", () => console.warn("error"));
    ws.on("close", () =>
    {
        console.log("CLOSED");
        connected = false;
    });
});



console.log(`Web socket server started on port 3001`);

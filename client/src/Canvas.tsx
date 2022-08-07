import React, { FunctionComponent, useRef, useState } from "react";
import { useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

export const Canvas : FunctionComponent = (props : any) =>
{
    const canvasRef = useRef<HTMLCanvasElement | null>(null)

    const timerRef = useRef(performance.now());
    const [ lastRenderTime, setLastRenderTime ] = useState<number>();

    const { lastMessage, readyState } = useWebSocket("ws://localhost:3001");

    useEffect(() =>
    {
        const canvas = canvasRef.current;
        if(canvas === null) return; // should hopefully never happen...

        canvas.width = window.innerWidth * 0.95;
        canvas.height = window.innerHeight * 0.9;
    },
        []
    );

    useEffect(() =>
    {
        if(lastMessage === null) return;
        // console.log(lastMessage.data);

        const canvas = canvasRef.current;
        if(canvas === null) return;

        const context = canvas.getContext("2d");
        if(context === null) return;

        const setImageFromBlob = async() =>
        {
            const blob : Blob = lastMessage.data;

            const imgArray = new Uint8ClampedArray(await blob.arrayBuffer());
            const imageData = new ImageData(imgArray, 1024, 1024);

            context.putImageData(imageData, 0, 0);

            const currTime = performance.now();
            setLastRenderTime(currTime - timerRef.current);
            timerRef.current = currTime;
        };
        setImageFromBlob();
    },
        [ lastMessage ]
    );

    const connectionStatus = {
      [ReadyState.CONNECTING]: 'Connecting',
      [ReadyState.OPEN]: 'Open',
      [ReadyState.CLOSING]: 'Closing',
      [ReadyState.CLOSED]: 'Closed',
      [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];
    
    return (
        <>
            <h1>{connectionStatus}</h1>
            
            {/* <p>{!!lastMessage && lastMessage.data}</p> */}
            { lastRenderTime !== undefined &&
                <>
                    <h3>Last render completed, sent, processed, and displayed in {lastRenderTime.toFixed(2)} ms.</h3>
                    <h3>This is approximately {(1000 / lastRenderTime).toFixed(2)} frames per second.</h3>
                </>
            }
            <canvas ref={canvasRef} { ...props }  />
        </>
    );
}

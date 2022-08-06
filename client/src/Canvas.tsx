import React, { FunctionComponent, useRef } from "react";
import { useEffect } from "react";

export const Canvas : FunctionComponent = (props : any) =>
{
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() =>
    {
        const canvas = canvasRef.current;
        if(canvas === null) return; // should hopefully never happen...

        const context = canvas.getContext("2d");
        if(context === null) return;

        //Our first draw
        context.fillStyle = '#000000'
        context.fillRect(0, 0, context.canvas.width, context.canvas.height)
    },
        [ canvasRef.current ]
    );
    
    return <canvas ref={canvasRef} { ...props }  />;
}

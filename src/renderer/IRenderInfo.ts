import type { ImageData } from "canvas";

export interface IRenderInfo
{
    // Render time in ms
    time: number;

    imageData: ImageData;
}

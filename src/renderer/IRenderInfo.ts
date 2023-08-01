export interface IRenderInfo
{
    // Render time in ms
    time : number;

    imageData : Uint8ClampedArray;
    imageHeight : number;
    imageWidth : number;
}

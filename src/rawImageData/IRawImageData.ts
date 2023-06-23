import type { ImageData } from "canvas";

export interface IRawImageData
{
	rawDataBuffer: SharedArrayBuffer;
	imageData: ImageData;
    resize : (width : number, height : number) => void;
}

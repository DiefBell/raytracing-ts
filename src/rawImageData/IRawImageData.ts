import { Rgba255 } from "../colour/colour";
import type { ImageData } from "canvas";

export interface IRawImageData
{
    data : Uint8ClampedArray;
    setData : (newData : Rgba255[]) => void;
    setDataValue : (newData : Rgba255, index : number) => void;
    getImageData : () => ImageData;
    resize : (width : number, height : number) => void;
}

import { ELEMENTS_PER_RGBA, Rgba255 } from "../colour/colour";
import { ImageData } from "canvas";
import { IRawImageData } from "./IRawImageData";

const BYTES_PER_UINT8 = 8;

// names "Raw" ImageData because "ImageData" is already taken Canvas
export class RawImageData implements IRawImageData
{
    private _data : Uint8ClampedArray;
    public get data() { return this._data; }

    private _width : number;
    public get width() { return this._width; }

    private _height : number;
    public get height() { return this._height; }

    constructor(width : number, height : number)
    {
        this._width = width;
        this._height = height;

        const imageBuffer = new ArrayBuffer(width * height * ELEMENTS_PER_RGBA * BYTES_PER_UINT8);
        this._data = new Uint8ClampedArray(imageBuffer);
        this._data.fill(1);
    }

    // this method is seriously bloody slow
    public setData(newData : Rgba255[]) : void
    {
        this._data = Uint8ClampedArray.from(newData.flat());
    }

    // this way is about 7x faster
    public setDataValue(newData : Rgba255, index : number) : void
    {
        this._data.set(newData, index * 4);
    }

    public getImageData() : ImageData
    {
        const imgData = new ImageData(this._data, this._width, this._height, { colorSpace: "srgb" });
        // imgData.data.set()
        return imgData;
    }

    public resize(width : number, height : number) : void
    {
        const imageBuffer = new ArrayBuffer(width * height * ELEMENTS_PER_RGBA * BYTES_PER_UINT8);
        this._data = new Uint8ClampedArray(imageBuffer);
    }
}

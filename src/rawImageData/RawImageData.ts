import { ELEMENTS_PER_RGBA, Rgba255 } from "../colour/colour";
import { ImageData } from "canvas";

const BYTES_PER_UINT8 = 8;

export class RawImageData
{
    private _data: Uint8ClampedArray;
    public get data() { return this._data; }
    // public set data(newData) { this._data = newData; }
    public setData(newData: Rgba255[])
    {
        this._data = Uint8ClampedArray.from(newData.flat());
    }
    public setDataValue(newData: Rgba255, index: number) {
        this._data.set(newData, index * 4);
    }
    public getImageData()
    {
        return new ImageData(this._data, this._width, this._height, { colorSpace: "srgb" });
    }

    private _width: number;
    public get width() { return this._width; }

    private _height: number;
    public get height() { return this._height; }

    constructor(width: number, height: number)
    {
        this._width = width;
        this._height = height;

        const imageBuffer = new ArrayBuffer(width * height * ELEMENTS_PER_RGBA * BYTES_PER_UINT8)
        this._data = new Uint8ClampedArray(imageBuffer);
        this._data.fill(1);
    }

    public resize(width: number, height: number)
    {
        const imageBuffer = new ArrayBuffer(width * height * ELEMENTS_PER_RGBA * BYTES_PER_UINT8)
        this._data = new Uint8ClampedArray(imageBuffer);
    }
}
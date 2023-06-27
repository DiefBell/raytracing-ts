import { ELEMENTS_PER_RGBA } from "../colour/colour";
import { ImageData } from "canvas";
import { type IRawImageData } from "./IRawImageData";

export const BYTES_PER_UINT8 = 1;

// names "Raw" ImageData because "ImageData" is already taken Canvas
export class RawImageData implements IRawImageData
{
	private _rawDataBuffer : SharedArrayBuffer;
	public get rawDataBuffer() { return this._rawDataBuffer; }

    private _imageData : Uint8ClampedArray;
    public get imageData()
	{
		return new ImageData(
			this._imageData,
			this._width,
			this._height,
			{ colorSpace: "srgb" }
		);
	}

    private _width : number;
    public get width() { return this._width; }

    private _height : number;
    public get height() { return this._height; }

    constructor(width : number, height : number)
    {
        this._width = width;
        this._height = height;

		this._rawDataBuffer = new SharedArrayBuffer(
			width * height * ELEMENTS_PER_RGBA * BYTES_PER_UINT8
		);
		this._imageData = new Uint8ClampedArray(this._rawDataBuffer);
		this._imageData.fill(255);

        // const imageBuffer = new ArrayBuffer(width * height * ELEMENTS_PER_RGBA * BYTES_PER_UINT8);
        // this._data = new Uint8ClampedArray(imageBuffer);
        // this._data.fill(1);
    }

    // // this method is seriously bloody slow
    // public setData(newData : Rgba255[]) : void
    // {
    //     this._data = Uint8ClampedArray.from(newData.flat());
    // }

    // // this way is about 7x faster
    // public setDataValue(newData : Rgba255, index : number) : void
    // {
    //     this._data.set(newData, index * 4);
    // }

    // public getImageData() : ImageData
    // {
    //     const imgData = new ImageData(this._data, this._width, this._height, { colorSpace: "srgb" });
    //     // imgData.data.set()
    //     return imgData;
    // }

    public resize(width : number, height : number) : void
    {
		this._rawDataBuffer = new SharedArrayBuffer(
			width * height * ELEMENTS_PER_RGBA * BYTES_PER_UINT8
		);
		this._imageData = new Uint8ClampedArray(this._rawDataBuffer);
        // const imageBuffer = new ArrayBuffer(width * height * ELEMENTS_PER_RGBA * BYTES_PER_UINT8);
        // this._data = new Uint8ClampedArray(imageBuffer);
    }
}

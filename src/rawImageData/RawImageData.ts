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

		this._rebuildBuffers();
		
		// white for first render
		// Q: is this even needed???
		this._imageData.fill(255);
    }

	private _rebuildBuffers()
	{
		this._rawDataBuffer = new SharedArrayBuffer(
			this._width * this._height * ELEMENTS_PER_RGBA * BYTES_PER_UINT8
		);
		this._imageData = new Uint8ClampedArray(this._rawDataBuffer);

	}

    public resize(width : number, height : number) : void
    {
		this._width = width;
		this._height = height;
		this._rebuildBuffers();
    }

	public resetAccumulation() : void
	{

	}
}

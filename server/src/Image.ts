import { RGBA } from "./Vector";

export class Image
{
    constructor
    (
        private _width : number,
        private _height : number,
    )
    {}

    private _values = new Array<RGBA>();
    public get values() { return this._values; }
    public setDataValue(idx : number, value : RGBA)
    {
        this._values[idx] = value;
    }

    public get width() { return this._width; }
    public get height() { return this._height; }
}
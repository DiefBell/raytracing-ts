import { RGBA } from "./Vector";

export class Image extends Array<RGBA>
{
    constructor
    (
        private _width : number,
        private _height : number
    )
    {
        super();
    }

    public get width() { return this._width; }
    public get height() { return this._height; }
}
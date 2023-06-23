import { ELEMENTS_PER_RGBA, Rgba255 } from "../colour/colour";
import { RawImageData } from "../rawImageData/RawImageData";
import { vector2, vector3 } from "../vector";

interface IRenderInfo
{
    // Render time in ms
    time: number;

    imageData: ImageData;
}

export class Renderer
{
    private _finalImage: RawImageData;
    // private _imageData: RGBA[];

    constructor(initialWidth: number, initialHeight: number)
    {
        this._finalImage = new RawImageData(initialWidth, initialHeight);
    }

    public onResize(width: number, height: number) : void
    {
        if(this._finalImage !== null)
        {
            if(this._finalImage.width === width && this._finalImage.height === height) return;
            this._finalImage.resize(width, height);
        }
        else
        {
            this._finalImage = new RawImageData(width, height);
        }
    }

    public render(): IRenderInfo
    {
        const startTime = performance.now();

        for(let y = 0; y < this._finalImage.height; y++)
        {
            for(let x = 0; x < this._finalImage.width; x++)
            {
                const index = x + (y * this._finalImage.width);
                const coord: vector2.Vector2 = [
                    // normalise
                    x / this._finalImage.width,
                    y / this._finalImage.height
                ];
                coord[0] = (coord[0] * 2) -1; // -1 -> 1
                coord[1] = (coord[1] * 2) -1; // -1 -> 1

                const colour = this.perPixel(coord);
                this._finalImage.setDataValue(
                    colour,
                    index
                );
            }

        }

        const endTime = performance.now();
        return {
            time: endTime - startTime,
            imageData: this._finalImage.getImageData()
        };
    }

    private perPixel(coord: vector2.Vector2): Rgba255
    {
        const SPHERE_COLOUR: Rgba255 = [ 255, 0, 0, 255];
        const BG_COLOUR: Rgba255 = [ 0, 0, 0, 255]

        const rayOrigin: vector3.Vector3 = [ 0, 0, 2 ];
        const rayDir: vector3.Vector3 = [ coord[0], coord[1], -1 ];
        const sphereRadius = 0.5;

        const a = vector3.dot(rayDir, rayDir);
        const b = 2 * vector3.dot(rayOrigin, rayDir);
        const c = vector3.dot(rayOrigin, rayOrigin) - sphereRadius * sphereRadius;

        const discriminant = (b * b) - (4 * a * c)
        if(discriminant >= 0)
        {
            return SPHERE_COLOUR;
        }
        return BG_COLOUR;
    }
}
import type { Rgb255, Rgba255 } from "../colour/colour";
import { RawImageData } from "../rawImageData/RawImageData";
import { vector2, vector3 } from "../maths/vector";
import { IRenderer } from "./IRenderer";
import type { IRenderInfo } from "./IRenderInfo";

export class Renderer implements IRenderer
{
    private _finalImage: RawImageData;

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
            // flipped because Canvas is from top-left corner,
            // instead of bottom-left.
            const yFlipped = (this._finalImage.height - 1) - y;
            for(let x = 0; x < this._finalImage.width; x++)
            {
                const index = x + (y * this._finalImage.width);
                const coord: vector2.Vector2 = [
                    // normalise
                    x / this._finalImage.width,
                    yFlipped / this._finalImage.height
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
        const SPHERE_COLOUR: Rgb255 = [ 255, 0, 255 ];
        const BG_COLOUR: Rgba255 = [ 0, 0, 0, 255];

        const rayOrigin: vector3.Vector3 = [ 0, 0, 1 ];
        const rayDirection: vector3.Vector3 = [ coord[0], coord[1], -1 ];
        const sphereRadius = 0.5;

        const a = vector3.dot(rayDirection, rayDirection);
        const b = 2 * vector3.dot(rayOrigin, rayDirection);
        const c = vector3.dot(rayOrigin, rayOrigin) - sphereRadius * sphereRadius;

        const discriminant = (b * b) - (4 * a * c);
        if(discriminant < 0)
        {
            return BG_COLOUR;
        }

        // const t0 = (-b + Math.sqrt(discriminant)) / (2 * a);
        const t1 = (-b - Math.sqrt(discriminant)) / (2 * a);
        const tClosest = t1;

        // const h0 = vector3.scale(
        //     vector3.add(rayOrigin, rayDir),
        //     t0
        // );
        // const h1 = vector3.scale(
        //     vector3.add(rayOrigin, rayDir),
        //     t1
        // );

        const hitPoint = vector3.add(
            // full ray from ray origin to hit point
            vector3.scale(rayDirection, tClosest),
            // add origin point to get absolute hit point location
            rayOrigin
        );

        const normal = vector3.unit(hitPoint);

        const lightDir: vector3.Vector3 = vector3.unit([ -1, -1, -1 ]);

        const lightIntensity = vector3.dot(normal, vector3.scale(lightDir, -1 ));

        const colourRgb = vector3.scale(SPHERE_COLOUR, lightIntensity) as Rgb255;

        return [ ...colourRgb, 255];
    }
}

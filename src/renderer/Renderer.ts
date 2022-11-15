import { vector } from "glm-ts";
import { ICamera } from "../camera/ICamera";
import { $clampRgba255, Rgb255, Rgba255 } from "../colour/colour";
import { RawImageData } from "../rawImageData/RawImageData";
import { IRay } from "./IRay";
import { IRenderer } from "./IRenderer";
import type { IRenderInfo } from "./IRenderInfo";

export class Renderer implements IRenderer
{
    private _finalImage : RawImageData;

    constructor(initialWidth : number, initialHeight : number)
    {
        this._finalImage = new RawImageData(initialWidth, initialHeight);
    }

    public onResize(width : number, height : number) : void
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

    public render(camera: ICamera) : IRenderInfo
    {
        const startTime = performance.now();

        let ray: IRay;

        for(let y = 0; y < this._finalImage.height; y++)
        {
            // flipped because Canvas is from top-left corner,
            // instead of bottom-left.
            // const yFlipped = (this._finalImage.height - 1) - y; // need this in camera
            for(let x = 0; x < this._finalImage.width; x++)
            {
                const index = x + (y * this._finalImage.width);

                ray = {
                    origin: camera.position,
                    direction: camera.rayDirections[index]
                };

                const colour: Rgba255 = this._traceRay(ray);
                $clampRgba255(colour);

                this._finalImage.setDataValue(
                    colour,
                    index
                );
            }

        }

        return {
            time: performance.now() - startTime,
            imageData: this._finalImage.getImageData()
        };
    }

    private _traceRay(ray: IRay) : Rgba255
    {
        const SPHERE_COLOUR : Rgb255 = [ 255, 0, 255 ];
        const BG_COLOUR : Rgba255 = [ 0, 0, 0, 255];
        const sphereRadius = 0.5;

        const a = vector.dot(ray.direction, ray.direction);
        const b = 2 * vector.dot(ray.origin, ray.direction);
        const c = vector.dot(ray.origin, ray.origin) - sphereRadius * sphereRadius;

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

        const hitPoint = vector.add(
            // full ray from ray origin to hit point
            vector.scale(ray.direction, tClosest),
            // add origin point to get absolute hit point location
            ray.origin
        );

        const normal = vector.normalise(hitPoint);

        const lightDir : vector.Vector3 = vector.normalise([ -1, -1, -1 ]);

        const lightIntensity = vector.dot(normal, vector.scale(lightDir, -1 ));

        const colourRgb = vector.scale(SPHERE_COLOUR, lightIntensity) as Rgb255;

        return [ ...colourRgb, 255];
    }
}

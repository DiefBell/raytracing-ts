import { Image } from "./Image"
import { add3D, dot3D, multiply3D, normalise3D, RGB, RGBA, Vector2D, Vector3D } from "./Vector";

export class Renderer
{
    constructor(imgWidth : number, imgHeight : number)
    {
        this._image = new Image(imgWidth, imgHeight);
    }

    private _image : Image;
    public get image() { return this._image; }

    public Render() : number
    {
        const start = performance.now();

        for(let y = 0; y < this._image.height; y++)
        {
            for(let x = 0; x < this._image.width; x++)
            {
                const coord : Vector2D = [
                    // * 2 - 1 converts from (0 -> 1) to (-1 -> 1)
                    (x / this._image.width) * 2 - 1,
                    (y / this._image.height) * 2 - 1
                ];

                const color : RGBA = this._perPixel(coord);
                this._image.setDataValue(x + y * this._image.width, color);
            }
        }

        return performance.now() - start;
    }

    private _perPixel(coord : Vector2D) : RGBA
    {
        const rayOrigin : Vector3D = [ 0, 0, 1 ];
        const rayDirection : Vector3D = [ coord[0], coord[1], -1 ];

        const sphereRadius = 0.5;

        // quadratic equation coefficients
        const a = dot3D(rayDirection, rayDirection);
        const b = 2 * dot3D(rayOrigin, rayDirection);
        const c = dot3D(rayOrigin, rayOrigin) - sphereRadius * sphereRadius;
        const discriminant = (b * b) - (4 * a * c);

        if(discriminant < 0)
        {
            return [ 0, 0, 0, 1];
        }

        const closestT = (-b - Math.sqrt(discriminant)) / (2 * a);
        const farthestT = (-b + Math.sqrt(discriminant)) / (2 * a);

        const hitPoint : Vector3D = add3D(
            rayOrigin,
            multiply3D(rayDirection, closestT)
        );
        const normal : Vector3D = normalise3D(hitPoint);

        const lightDir : Vector3D = normalise3D([ -1, -1, -1])
        const lightIntensity = Math.max(
            dot3D(
                normal, multiply3D(lightDir, -1)
            ),
            0
        );

        const sphereBaseColour : RGB = [1, 0, 0.5];
        const sphereColour : RGBA = [ ...multiply3D(sphereBaseColour, lightIntensity), 1];
        return sphereColour
    }
}

import { vector } from "glm-ts";
import { $clampRgba255, ELEMENTS_PER_RGBA, type Rgb255, type Rgba255 } from "../../colour/colour";
import { Scene } from "../../scene/Scene";

export class RayTraceWorker
{
    private _image : Uint8ClampedArray;
    private _cameraRayDirs : Float64Array;
    private _cameraPos : vector.Vec3;
    private _scene : Scene;
    
    constructor(
        imageBuffer : Uint8ClampedArray,
        cameraRayDirsBuffer : Float64Array,
        cameraPosition : vector.Vec3,
        sceneObjectsBuffer : Float64Array,
        sceneBgColour : Rgba255
    )
    {
        this._image = imageBuffer;
        this._cameraRayDirs = cameraRayDirsBuffer;
        this._cameraPos = cameraPosition;
        this._scene = new Scene(sceneObjectsBuffer, sceneBgColour);
    }

    public traceRay(i : number)
    {
        if(this._scene.spheres.length === 0)
        {
            this._image.set(this._scene.backgroundColour, i * ELEMENTS_PER_RGBA);
            return;
        }

        const rayIndex = i * vector.ELEMENTS_PER_VEC3;
        const rayDir = this._cameraRayDirs.subarray(
            rayIndex,
            rayIndex + vector.ELEMENTS_PER_VEC3
        // GLM doesn't use any of the standard JS array methods (such as .pop)
        // that are missing on Float64Array, just .length and indexing [],
        // so we can do this dodgy cast fine.
        ) as unknown as vector.Vec3;
        const rayOrigin = this._cameraPos;

        let closestSphere : number | null = null;
        let hitDistance = Number.MAX_SAFE_INTEGER;

        for(let s = 0; s < this._scene.spheres.length; s++)
        {
            const sphere = this._scene.spheres[s];
            const origin = vector.subtract(rayOrigin, sphere.position);

            const a = vector.dot(rayDir, rayDir);
            const b = 2 * vector.dot(origin, rayDir);
            const c = vector.dot(origin, origin) - sphere.radius * sphere.radius;

            const discriminant = (b * b) - (4 * a * c);
            if (discriminant < 0) continue;

            // const t0 = (-b + Math.sqrt(discriminant)) / (2 * a);
            const t1 = (-b - Math.sqrt(discriminant)) / (2 * a);
            const tClosest = t1;

            if(tClosest < hitDistance)
            {
                hitDistance = tClosest;
                closestSphere = s;
            }
        }

        if(closestSphere === null)
        {
            this._image.set(this._scene.backgroundColour, i * ELEMENTS_PER_RGBA);
            return;
        }

        const hitPoint = vector.add(
            // full ray from ray origin to hit point
            vector.scale(rayDir, hitDistance),
            // add origin point to get absolute hit point location
            rayOrigin
        ) as vector.Vector<3>;

        const normal = vector.normalise(hitPoint);

        const lightDir : vector.Vector3 = vector.normalise([-1, -1, -1]);

        const lightIntensity = Math.max(
            0,
            vector.dot(normal, vector.scale(lightDir, -1)) // == cos(angle), which can go below 0
        );

        const colour = vector.scale(this._scene.spheres[closestSphere].albedo, lightIntensity) as Rgb255;
        colour.push(255);
        $clampRgba255(colour as unknown as Rgba255);

        this._image.set(
            colour,
            i * ELEMENTS_PER_RGBA
        );
    }
}

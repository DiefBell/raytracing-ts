import { vector } from "glm-ts";
import { $clampRgba255, ELEMENTS_PER_RGBA, type Rgb255, type Rgba255 } from "../../colour/colour";
import { Scene } from "../../scene/Scene";
import { type IReadonlyScene } from "../../scene/IReadonlyScene";
import { $add, scale } from "glm-ts/lib/cjs/vector";
import { type IRay } from "./IRay";

interface HitPayload
{
    hitDistance : number;
    sphereIndex : number;
    worldPosition : vector.Vec3;
    worldNormal : vector.Vec3;
}

export class RayTraceWorker
{
    private _image : Uint8ClampedArray;
    private _cameraRayDirs : Float64Array;
    private _cameraPos : vector.Vec3;
    private _scene : IReadonlyScene;
    
    constructor(
        imageBuffer : Uint8ClampedArray,
        cameraRayDirsBuffer : Float64Array,
        cameraPosition : vector.Vec3,
        sceneObjectsBuffer : Float64Array,
        sceneBgColour : Rgb255
    )
    {
        this._image = imageBuffer;
        this._cameraRayDirs = cameraRayDirsBuffer;
        this._cameraPos = cameraPosition;
        this._scene = Scene.fromArrayReadonly(sceneObjectsBuffer, sceneBgColour);
    }

    public perPixel(i : number)
    {
        const rayIndex = i * vector.ELEMENTS_PER_VEC3;
        const cameraRayDir = this._cameraRayDirs.subarray(
            rayIndex,
            rayIndex + vector.ELEMENTS_PER_VEC3
        // GLM doesn't use any of the standard JS array methods (such as .pop)
        // that are missing on Float64Array, just .length and indexing [],
        // so we can do this dodgy cast fine.
        ) as unknown as vector.Vec3;

        let rayDir = cameraRayDir;
        let rayOrigin = this._cameraPos;

        if(this._scene.spheres.length === 0)
        {
            this._image.set(this._scene.backgroundColour, i * ELEMENTS_PER_RGBA);
            return;
        }

        const colour : Rgb255 = [ 0, 0, 0 ];
        let multiplier = 1;

        const BOUNCES = 5;
        for(let b = 0; b < BOUNCES; b++)
        {
            const payload = this._traceRay({ rayOrigin, rayDir });
            if(payload === null)
            {
                $add(
                    colour,
                    vector.scale(this._scene.backgroundColour, multiplier)
                );
                // We can't "bounce" off the sky, so exit our bounce loop
                break;
            }

            const lightDir = vector.normalise([
				-1, // side
				-1, // pitch
				0.5
			]);
            const lightIntensity = Math.max(
                0,
                vector.dot(
                    payload.worldNormal,
                    vector.scale(lightDir, -1) // == cos(angle), which can go below 0
                )
            );

            const sphere = this._scene.spheres[payload.sphereIndex];
            const material = Scene.materials[sphere.materialIndex];
            const sphereColour = material.albedo;

            $add(
                colour,
                scale(sphereColour, lightIntensity * multiplier)
            );

            multiplier *= 0.5;

            rayOrigin = vector.add(
                payload.worldPosition,
                vector.scale(
                    payload.worldPosition,
                    0.0001
                )
            );

            const scatterReflectVect = vector.add(
                payload.worldNormal,
                [
                    material.roughness * (Math.random() - 0.5),
                    material.roughness * (Math.random() - 0.5),
                    material.roughness * (Math.random() - 0.5)
                ]
            );

            rayDir = vector.reflect(
                rayDir,
                scatterReflectVect
            );
        }

        const colourRgba : Rgba255 = [
            colour[0],
            colour[1],
            colour[2],
            255
        ];
        $clampRgba255(colourRgba);

        this._image.set(
            colourRgba,
            i * ELEMENTS_PER_RGBA
        );
    }

    private _traceRay({ rayOrigin, rayDir } : IRay) : HitPayload | null
    {
        let closestSphereIndex = null;
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
                closestSphereIndex = s;
            }
        }

        if(closestSphereIndex === null) return null;

        const closestSphere = this._scene.spheres[closestSphereIndex];
        const origin = vector.subtract(rayOrigin, closestSphere.position);

        const worldPosition = vector.add(
            origin,
            vector.scale(rayDir, hitDistance)
        );
        const worldNormal = vector.normalise(worldPosition);
        vector.$add(worldPosition, closestSphere.position);

        return {
            hitDistance,
            sphereIndex: closestSphereIndex,
            worldNormal,
            worldPosition
        };
    }
}

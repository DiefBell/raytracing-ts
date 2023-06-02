import { vector } from "glm-ts";
import { type ICamera } from "../camera/ICamera";
import { $clampRgba255, type Rgb255, type Rgba255 } from "../colour/colour";
import { RawImageData } from "../rawImageData/RawImageData";
import { type IRay } from "./IRay";
import { type IRenderer } from "./IRenderer";
import type { IRenderInfo } from "./IRenderInfo";
import * as os from "os";
import * as path from "path";

import { Worker } from "worker_threads";
import { type IWorkerData } from "./IWorkerData";

// const MAX_THREADS = os.cpus().length - 1;
const MAX_THREADS = 2;
// const MAX_THREADS = Math.max(
// 	Math.floor(os.cpus().length / 2),
// 	1
// );
const workerFile = path.join(__dirname, "./traceRay.js");
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

		const buffer = new Uint8ClampedArray(this._finalImage.rawDataBuffer);

		const workers: Worker[] = [];
		const rowsPerThread = Math.ceil(this._finalImage.height / MAX_THREADS);

		for(let i = 0; i < MAX_THREADS; i++)
		{
			const yMin = rowsPerThread * i;
			const yMax = Math.min(yMin + this._finalImage.width, this._finalImage.height);

			const minIndex = yMin * this._finalImage.width;
			const maxIndex = yMax * this._finalImage.width;

			const cameraRayDirs = camera.rayDirections;

			const workerData: IWorkerData = {
				sharedBuffer: this._finalImage.rawDataBuffer,
				// yMin,
				// yMax,
				// width: this._finalImage.width,
				// height: this._finalImage.height,
				minIndex,
				maxIndex,
				cameraPos: camera.position,
				cameraRayDirs
			};
			workers.push(
				new Worker(workerFile, { workerData })
			);
		}

		Promise.all(
			workers.map(
				(worker) => new Promise(
					(resolve, reject) =>
					{
						worker.on("message", console.log);
						worker.on("exit", resolve);
						worker.on("error", reject);
					}
				)
			)
		);

        // for(let y = 0; y < this._finalImage.height; y++)
        // {
        //     for(let x = 0; x < this._finalImage.width; x++)
        //     {
        //         const index = x + (y * this._finalImage.width);

        //         ray = {
        //             origin: camera.position,
        //             direction: camera.rayDirections[index]
        //             // direction: [ coord[0], coord[1], -1 ]
        //         };
                
        //         const colour: Rgba255 = this._traceRay(ray);
        //         $clampRgba255(colour);

		// 		buffer.set(colour, index * 4);
        //         // this._finalImage.setDataValue(
        //         //     colour,
        //         //     index
        //         // );
        //     }

        // }

        return {
            time: performance.now() - startTime,
            imageData: this._finalImage.imageData
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

        const hitPoint = vector.add(
            // full ray from ray origin to hit point
            vector.scale(ray.direction, tClosest),
            // add origin point to get absolute hit point location
            ray.origin
        ) as vector.Vector<3>;

        const normal = vector.normalise(hitPoint);

        const lightDir : vector.Vector3 = vector.normalise([ -1, -1, -1 ]);

        const lightIntensity = Math.max(
            0,
            vector.dot(normal, vector.scale(lightDir, -1 )) // == cos(angle), which can go below 0
        );

        const colourRgb = vector.scale(SPHERE_COLOUR, lightIntensity) as Rgb255;

        return [ ...colourRgb, 255];
    }
}

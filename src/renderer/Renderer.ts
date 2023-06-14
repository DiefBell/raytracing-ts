import { type ICamera } from "../camera/ICamera";
import { RawImageData } from "../rawImageData/RawImageData";
import { type IRenderer } from "./IRenderer";
import type { IRenderInfo } from "./IRenderInfo";
import * as os from "os";
import * as path from "path";

import { Worker } from "worker_threads";
import { type IWorkerData } from "./IWorkerData";

// const MAX_THREADS = os.cpus().length - 1;
const MAX_THREADS = 1;
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

    public async render(camera: ICamera) : Promise<IRenderInfo>
    {
        const startTime = performance.now();

		const workers = new Array<Promise<void>>();
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
				minIndex,
				maxIndex,
				cameraPos: camera.position,
				cameraRayDirs
			};

			workers.push(
				new Promise(
					(resolve, reject) => 
					{
						const worker = new Worker(workerFile, { workerData });
						worker.on("exit", resolve);
						worker.on("error", reject);
					}
				)
			);
		}

		await Promise.all(workers);

        return {
            time: performance.now() - startTime,
            imageData: this._finalImage.imageData
        };
    }
}

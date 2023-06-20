import { type ICamera } from "../camera/ICamera";
import { RawImageData } from "../rawImageData/RawImageData";
import { type IRenderer } from "./IRenderer";
import type { IRenderInfo } from "./IRenderInfo";
import * as path from "path";

import { Worker } from "worker_threads";
import { type IWorkerData } from "./IWorkerData";
import { type IRenderWorker } from "./IRenderWorker";

const workerFile = path.join(__dirname, "./traceRay.js");
export class Renderer implements IRenderer
{
    private _finalImage : RawImageData;
	private _workers: Worker[];

    constructor(initialWidth : number, initialHeight : number, numWorkers: number)
    {
        this._finalImage = new RawImageData(initialWidth, initialHeight);
		this._workers = new Array(numWorkers);
		for(let i = 0; i < numWorkers; i++)
		{
			this._workers[i] = new Worker(workerFile, {
				workerData: {
					sharedBuffer: this._finalImage.rawDataBuffer
				}
			});

			this._workers[i].on("exit", (code) => 
			{
				console.error(`Render worker ${i} exited with code ${code}`);
			});

			this._workers[i].on("message", (msg) => 
			{
				if(msg !== "DONE") console.log(msg);
			});
		}
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

		const rowsPerWorker = Math.ceil(this._finalImage.height / this._workers.length);

		const renders = this._workers.map((worker, i) =>
		{
			const yMin = rowsPerWorker * i;
			const yMax = Math.min(yMin + rowsPerWorker, this._finalImage.height);

			const minIndex = yMin * this._finalImage.width;
			const maxIndex = yMax * this._finalImage.width;

			return new Promise<void>((resolve) =>
			{
				const workerData: IWorkerData = {
					minIndex,
					maxIndex,
					cameraPos: camera.position,
					cameraRayDirs: camera.rayDirections
				};
				worker.postMessage(workerData);

				const finish = (msg: unknown) =>
				{
					if(msg === "DONE")
					{
						resolve();
						worker.removeListener("message", finish);
					}
				};

				worker.on("message", finish);
			});
		});

		console.log("ICI");

		// for(let i = 0; i < MAX_THREADS; i++)
		// {
		// 	const yMin = rowsPerThread * i;
		// 	const yMax = Math.min(yMin + this._finalImage.width, this._finalImage.height);

		// 	const minIndex = yMin * this._finalImage.width;
		// 	const maxIndex = yMax * this._finalImage.width;

		// 	const cameraRayDirs = camera.rayDirections;

		// 	const workerData: IWorkerData = {
		// 		sharedBuffer: this._finalImage.rawDataBuffer,
		// 		minIndex,
		// 		maxIndex,
		// 		cameraPos: camera.position,
		// 		cameraRayDirs
		// 	};

		// 	workers.push(
		// 		new Promise(
		// 			(resolve, reject) => 
		// 			{
		// 				const worker = new Worker(workerFile, { workerData });
		// 				worker.on("exit", resolve);
		// 				worker.on("error", reject);
		// 			}
		// 		)
		// 	);
		// }

		await Promise.all(renders);

        return {
            time: performance.now() - startTime,
            imageData: this._finalImage.imageData
        };
    }
}

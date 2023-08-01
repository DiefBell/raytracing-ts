import { type ICamera } from "../camera/ICamera";
import { RawImageData } from "../rawImageData/RawImageData";
import { type IRenderer } from "./IRenderer";
import type { IRenderInfo } from "./IRenderInfo";
import * as path from "path";

import { Worker } from "worker_threads";
import { type IRayTraceBatch } from "./IRayTraceBatch";
import { type Scene } from "../scene/Scene";
import { type IWorkerData } from "./IWorkerData";
import { ELEMENTS_PER_RGBA } from "../colour/colour";

const workerFile = path.join(__dirname, "worker", "index.js");
export class Renderer implements IRenderer
{
    private _finalImage : RawImageData;
	private _workers : Worker[];
	private _camera : ICamera;
	private _scene : Scene;

	private _accumulatedImageBuffer : SharedArrayBuffer;
	private _frameIndex : number;

    constructor(
		initialWidth : number,
		initialHeight : number,
		numWorkers : number,
		camera : ICamera,
		scene : Scene
	)
    {
		this._camera = camera;
		this._scene = scene;
		this._workers = new Array(numWorkers);

		this._rebuildImage(initialWidth, initialHeight);
		this.resetFrameIndex();
		this.resetWorkers();
    }

	public resetFrameIndex()
	{
		this._frameIndex = 1;
	}

	public resetWorkers()
	{
		const workerData : IWorkerData = {
			imageBuffer: this._finalImage.rawDataBuffer,
			accumulatorBuffer: this._accumulatedImageBuffer,
			cameraRaysBuffer: this._camera.rayDirectionsBuffer,
			cameraPosition: this._camera.position,
			sceneObjectsBuffer: this._scene.sceneObjectBuffer,
			sceneBgColour: this._scene.backgroundColour
		};

		for(let i = 0; i < this._workers.length; i++)
		{
			this._workers[i]?.terminate();
			delete this._workers[i];

			this._workers[i] = new Worker(workerFile, { workerData });

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
        this._rebuildImage(width, height);
		this.resetWorkers();
		this.resetFrameIndex();
    }

	private _rebuildImage(width : number, height : number) : void
	{
		if(this._finalImage?.width === width && this._finalImage?.height === height) return;

		if(this._finalImage === undefined)
		{
			this._finalImage = new RawImageData(width, height);
		}
		else
		{
			this._finalImage.resize(width, height);
		}

		if(this._accumulatedImageBuffer === undefined)
		{
			this._accumulatedImageBuffer = new SharedArrayBuffer(
				this._finalImage.width
				* this._finalImage.height
				* ELEMENTS_PER_RGBA
				* Float64Array.BYTES_PER_ELEMENT
			);
		}

	}

    public async render() : Promise<IRenderInfo>
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
				const batchData : IRayTraceBatch = {
					minIndex,
					maxIndex,
					frameIndex: this._frameIndex
				};
				worker.postMessage(batchData);

				const finish = (msg : unknown) =>
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

		await Promise.all(renders);
		this._frameIndex++;

        return {
            time: performance.now() - startTime,
            imageData: this._finalImage.imageData,
			imageHeight: this._finalImage.height,
			imageWidth: this._finalImage.width
        };
    }
}

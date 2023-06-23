import { type ICamera } from "../camera/ICamera";
import { RawImageData } from "../rawImageData/RawImageData";
import { type IRenderer } from "./IRenderer";
import type { IRenderInfo } from "./IRenderInfo";
import * as path from "path";

import { Worker } from "worker_threads";
import { type IRayTraceBatch } from "./IRayTraceBatch";
import { type Scene } from "../scene/Scene";
import { type IWorkerData } from "./IWorkerData";

const workerFile = path.join(__dirname, "worker", "index.js");
export class Renderer implements IRenderer
{
    private _finalImage : RawImageData;
	private _workers : Worker[];
	private _camera : ICamera;
	private _scene : Scene;

    constructor(
		initialWidth : number,
		initialHeight : number,
		numWorkers : number,
		camera : ICamera,
		scene : Scene
	)
    {
        this._finalImage = new RawImageData(initialWidth, initialHeight);
		this._camera = camera;
		this._scene = scene;
		this._workers = new Array(numWorkers);

		this._rebuildWorkers();
    }

	private _rebuildWorkers()
	{
		const workerData : IWorkerData = {
			imageBuffer: this._finalImage.rawDataBuffer,
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

	public onSceneUpdate() : void
	{
		this._rebuildWorkers();
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
					maxIndex
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

        return {
            time: performance.now() - startTime,
            imageData: this._finalImage.imageData
        };
    }
}

import { parentPort, workerData } from "worker_threads";
import { RayTraceWorker } from "./RayTraceWorker";

import { type IRayTraceBatch } from "../IRayTraceBatch";
import { type IWorkerData } from "../IWorkerData";

const {
	imageBuffer,
	cameraRaysBuffer,
	cameraPosition,
	sceneObjectsBuffer,
	sceneBgColour
} = workerData as IWorkerData;

const main = async () =>
{
	const rayTraceWorker = new RayTraceWorker(
		new Uint8ClampedArray(imageBuffer),
		new Float64Array(cameraRaysBuffer),
		cameraPosition,
		new Float64Array(sceneObjectsBuffer),
		sceneBgColour
	);

	await new Promise(() =>
	{
		parentPort?.on(
			"message",
			({ minIndex, maxIndex } : IRayTraceBatch) =>
			{
				try
				{
					for (let i = minIndex; i < maxIndex; i++)
					{
						rayTraceWorker.perPixel(i);
					}
				}
				catch (err)
				{
					parentPort?.postMessage("\nError:");
					parentPort?.postMessage((err as Error).message);
					parentPort?.postMessage((err as Error).stack);
					process.exit(1);
				}

				parentPort?.postMessage("DONE");
			}
		);
	});
};

main();

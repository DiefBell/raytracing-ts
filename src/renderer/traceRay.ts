import { parentPort, workerData } from "worker_threads";
import { type IWorkerData } from "./IWorkerData";
import { ELEMENTS_PER_RGBA } from "../colour/colour";

const {
	sharedBuffer,
	minIndex,
	maxIndex,
	cameraPos,
	cameraRayDirs
} = (workerData as IWorkerData);

const buffer = new Uint8ClampedArray(sharedBuffer);

for(let i = minIndex; i < maxIndex; i++)
{
	const colour = [
		Math.random() * 255,
		Math.random() * 255,
		Math.random() * 255,
		255
	];
	buffer.set(colour, i * ELEMENTS_PER_RGBA);
}

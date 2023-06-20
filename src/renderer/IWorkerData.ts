import { type vector } from "glm-ts";

export interface IWorkerData
{
	// sharedBuffer: SharedArrayBuffer,
	minIndex: number,
	maxIndex: number,
	cameraPos: vector.Vector3,
	cameraRayDirs: vector.Vector3[]
}

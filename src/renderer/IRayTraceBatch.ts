import { type vector } from "glm-ts";

export interface IRayTraceBatch
{
	minIndex: number,
	maxIndex: number,
	cameraPos: vector.Vector3,
}

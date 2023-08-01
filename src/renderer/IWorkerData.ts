import { type vector } from "glm-ts";
import { type Rgb255 } from "../colour/colour";


export interface IWorkerData 
{
	imageBuffer : SharedArrayBuffer;
	accumulatorBuffer : SharedArrayBuffer;
	cameraRaysBuffer : SharedArrayBuffer;
	cameraPosition : vector.Vec3;
	sceneObjectsBuffer : SharedArrayBuffer;
	sceneBgColour : Rgb255;
}

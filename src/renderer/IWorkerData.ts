import { type vector } from "glm-ts";
import { type Rgba255 } from "../colour/colour";


export interface IWorkerData 
{
	imageBuffer : SharedArrayBuffer;
	cameraRaysBuffer : SharedArrayBuffer;
	cameraPosition : vector.Vec3;
	sceneObjectsBuffer : SharedArrayBuffer;
	sceneBgColour : Rgba255;
}

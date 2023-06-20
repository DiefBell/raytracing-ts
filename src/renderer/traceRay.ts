import
	{
		parentPort,
		workerData
	} from "worker_threads";

import
	{
		type IWorkerData
	} from "./IWorkerData";

import
	{
		$clampRgba255,
		ELEMENTS_PER_RGBA,
		type Rgb255,
		type Rgba255
	} from "../colour/colour";

import { vector } from "glm-ts";

// const {
// 	sharedBuffer,
// 	minIndex,
// 	maxIndex,
// 	cameraPos: rayOrigin,
// 	cameraRayDirs
// } = (workerData as IWorkerData);


const ELEMENTS_PER_RAY_DIR = 3;

const imageBuffer = workerData.imageBuffer as SharedArrayBuffer;
const cameraRaysBuffer = workerData.cameraRaysBuffer as SharedArrayBuffer;

const image = new Uint8ClampedArray(imageBuffer);
const cameraRayDirs = new Float64Array(cameraRaysBuffer);

const main = async () =>
{
	await new Promise(() =>
	{
		parentPort?.on(
			"message",
			({ minIndex, maxIndex, cameraPos: rayOrigin }: IWorkerData) =>
			{
				for (let i = minIndex; i < maxIndex; i++)
				{
					// parentPort?.postMessage(`${process.pid}: ${i}`);
					const SPHERE_COLOUR: Rgb255 = [255, 0, 255];
					const BG_COLOUR: Rgba255 = [0, 0, 0, 255];
					const sphereRadius = 0.5;

					const rayIndex = i * ELEMENTS_PER_RAY_DIR;
					const rayDir = cameraRayDirs.subarray(
						rayIndex,
						rayIndex + ELEMENTS_PER_RAY_DIR
					// GLM doesn't use any of the standard JS array methods (such as .pop)
					// that are missing on Float64Array, just .length and indexing []
					// so we can do this dodgy cast fine.
					) as unknown as vector.Vec3;

					try 
					{
						const a = vector.dot(rayDir, rayDir);
						const b = 2 * vector.dot(rayOrigin, rayDir);
						const c = vector.dot(rayOrigin, rayOrigin) - sphereRadius * sphereRadius;

						const discriminant = (b * b) - (4 * a * c);
						if (discriminant < 0)
						{
							image.set(BG_COLOUR, i * ELEMENTS_PER_RGBA);
							continue;
						}

						// const t0 = (-b + Math.sqrt(discriminant)) / (2 * a);
						const t1 = (-b - Math.sqrt(discriminant)) / (2 * a);
						const tClosest = t1;

						const hitPoint = vector.add(
							// full ray from ray origin to hit point
							vector.scale(rayDir, tClosest),
							// add origin point to get absolute hit point location
							rayOrigin
						) as vector.Vector<3>;

						const normal = vector.normalise(hitPoint);

						const lightDir: vector.Vector3 = vector.normalise([-1, -1, -1]);

						const lightIntensity = Math.max(
							0,
							vector.dot(normal, vector.scale(lightDir, -1)) // == cos(angle), which can go below 0
						);

						const colour = vector.scale(SPHERE_COLOUR, lightIntensity) as Rgb255;
						colour.push(255);
						$clampRgba255(colour as unknown as Rgba255);

						image.set(
							colour,
							i * ELEMENTS_PER_RGBA
						);
					}
					catch (err)
					{
						parentPort?.postMessage("\nError:");
						parentPort?.postMessage(cameraRayDirs.length);
						parentPort?.postMessage(i);
						parentPort?.postMessage((err as Error).stack);
						process.exit(1);
					}
				}

				parentPort?.postMessage("DONE");
			}
		);
	});
};

main();

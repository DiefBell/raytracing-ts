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

const sharedBuffer = workerData.sharedBuffer as SharedArrayBuffer;

const buffer = new Uint8ClampedArray(sharedBuffer);

const main = async () =>
{
	await new Promise(() =>
	{
		parentPort?.on(
			"message",
			({ minIndex, maxIndex, cameraPos: rayOrigin, cameraRayDirs }: IWorkerData) =>
			{
				// parentPort?.postMessage(maxIndex - minIndex);
				for (let i = minIndex; i < maxIndex; i++)
				{
					// parentPort?.postMessage(`${process.pid}: ${i}`);
					const SPHERE_COLOUR: Rgb255 = [255, 0, 255];
					const BG_COLOUR: Rgba255 = [0, 0, 0, 255];
					const sphereRadius = 0.5;

					const rayDir = cameraRayDirs[i];

					try 
					{
						const a = vector.dot(rayDir, rayDir);
						const b = 2 * vector.dot(rayOrigin, rayDir);
						const c = vector.dot(rayOrigin, rayOrigin) - sphereRadius * sphereRadius;

						const discriminant = (b * b) - (4 * a * c);
						if (discriminant < 0)
						{
							buffer.set(BG_COLOUR, i * ELEMENTS_PER_RGBA);
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

						buffer.set(
							colour,
							i * ELEMENTS_PER_RGBA
						);
					}
					catch (err)
					{
						parentPort?.postMessage("\nError:");
						parentPort?.postMessage(cameraRayDirs.length);
						parentPort?.postMessage(i);
						process.exit(1);
					}
				}

				parentPort?.postMessage("DONE");
			}
		);
	});
};

main();

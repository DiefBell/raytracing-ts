import
	{
		parentPort,
		workerData
	} from "worker_threads";

import
	{
		type IRayTraceBatch
	} from "./IRayTraceBatch";

import
	{
		$clampRgba255,
		ELEMENTS_PER_RGBA,
		type Rgb255,
		type Rgba255
	} from "../colour/colour";

import { vector } from "glm-ts";
import { type IWorkerData } from "./Renderer";
import { Sphere } from "../scene/Scene";

// const {
// 	sharedBuffer,
// 	minIndex,
// 	maxIndex,
// 	cameraPos: rayOrigin,
// 	cameraRayDirs
// } = (workerData as IWorkerData);


const ELEMENTS_PER_RAY_DIR = 3;

const {
	imageBuffer,
	cameraRaysBuffer,
	sceneObjectsBuffer
} = workerData as IWorkerData;

const image = new Uint8ClampedArray(imageBuffer);
const cameraRayDirs = new Float64Array(cameraRaysBuffer);
const sceneObjects = new Float64Array(sceneObjectsBuffer);


const BG_COLOUR: Rgba255 = [0, 0, 0, 255];

const main = async () =>
{
	await new Promise(() =>
	{
		parentPort?.on(
			"message",
			({ minIndex, maxIndex, cameraPos: rayOrigin }: IRayTraceBatch) =>
			{
				try
				{
					const numSpheres = sceneObjects.length / Sphere.ELEMENTS_PER_SPHERE;

					const spheres = new Array<Sphere>();
					for(let i = 0; i < numSpheres; i++)
					{
						spheres.push(
							Sphere.fromArray(
								sceneObjects.subarray(
									i * Sphere.ELEMENTS_PER_SPHERE,
									(i * Sphere.ELEMENTS_PER_SPHERE) + Sphere.ELEMENTS_PER_SPHERE
								)
							)
						);
					}

					for (let i = minIndex; i < maxIndex; i++)
					{
						if(numSpheres === 0)
						{
							image.set(BG_COLOUR, i * ELEMENTS_PER_RGBA);
							continue;
						}

						const rayIndex = i * ELEMENTS_PER_RAY_DIR;
						const rayDir = cameraRayDirs.subarray(
							rayIndex,
							rayIndex + ELEMENTS_PER_RAY_DIR
						// GLM doesn't use any of the standard JS array methods (such as .pop)
						// that are missing on Float64Array, just .length and indexing [],
						// so we can do this dodgy cast fine.
						) as unknown as vector.Vec3;

						let closestSphere: number | null = null;
						let hitDistance = Number.MAX_SAFE_INTEGER;

						for(let s = 0; s < numSpheres; s++)
						{
							const sphere = spheres[s];
							const origin = vector.subtract(rayOrigin, sphere.position);

							const a = vector.dot(rayDir, rayDir);
							const b = 2 * vector.dot(origin, rayDir);
							const c = vector.dot(origin, origin) - sphere.radius * sphere.radius;

							const discriminant = (b * b) - (4 * a * c);
							if (discriminant < 0) continue;

							// const t0 = (-b + Math.sqrt(discriminant)) / (2 * a);
							const t1 = (-b - Math.sqrt(discriminant)) / (2 * a);
							const tClosest = t1;

							if(tClosest < hitDistance)
							{
								hitDistance = tClosest;
								closestSphere = s;
							}
						}

						if(closestSphere === null)
						{
							image.set(BG_COLOUR, i * ELEMENTS_PER_RGBA);
							continue;
						}

						const hitPoint = vector.add(
							// full ray from ray origin to hit point
							vector.scale(rayDir, hitDistance),
							// add origin point to get absolute hit point location
							rayOrigin
						) as vector.Vector<3>;

						const normal = vector.normalise(hitPoint);

						const lightDir: vector.Vector3 = vector.normalise([-1, -1, -1]);

						const lightIntensity = Math.max(
							0,
							vector.dot(normal, vector.scale(lightDir, -1)) // == cos(angle), which can go below 0
						);

						const colour = vector.scale(spheres[closestSphere].albedo, lightIntensity) as Rgb255;
						colour.push(255);
						$clampRgba255(colour as unknown as Rgba255);

						image.set(
							colour,
							i * ELEMENTS_PER_RGBA
						);
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

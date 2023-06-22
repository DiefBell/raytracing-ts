import { type vector } from "glm-ts";

export class Scene
{
	private _sceneObjectBuffer: SharedArrayBuffer;
	public get sceneObjectBuffer() { return this._sceneObjectBuffer; }
	private _sceneObjects: Float64Array;
	
	
	constructor(spheres: Sphere[])
	{
		this._sceneObjectBuffer = new SharedArrayBuffer(
			spheres.length * Sphere.BYTES_PER_SPHERE
		);
		this._sceneObjects = new Float64Array(this._sceneObjectBuffer);

		for(let i = 0; i < spheres.length; i++)
		{
			this._sceneObjects.set(spheres[i].toArray(), i * Sphere.ELEMENTS_PER_SPHERE);
		}
	}
}

type T = [ number, number, number, number, number, number];
export class Sphere
{
	// position = 3 elements
	// radius = 1 element
	// albedo = 3
	public static ELEMENTS_PER_SPHERE = 7;
	public static BYTES_PER_SPHERE = Float64Array.BYTES_PER_ELEMENT * Sphere.ELEMENTS_PER_SPHERE;

	private _position: vector.Vec3;
	public get position() { return this._position; }

	private _radius: number;
	public get radius() { return this._radius; }

	private _albedo: vector.Vec3;
	public get albedo() { return this._albedo; }

	public toArray(): T
	{
		return [
			...this._position,
			this._radius,
			...this._albedo
		] as T;
	}

	public static fromArray(arr: Float64Array): Sphere
	{
		return new Sphere(
			[ arr[0], arr[1], arr[2] ],
			arr[3],
			[ arr[4], arr[5], arr[6] ]
		);
	}

	constructor(
		position: vector.Vec3,
		radius: number,
		albedo: vector.Vec3
	)
	{
		this._position = position;
		this._radius = radius;
		this._albedo = albedo;
	}
}

import { type vector } from "glm-ts";

export class Scene
{
	private _sceneBuffer: SharedArrayBuffer;
	public get sceneBuffer() { return this._sceneBuffer; }
	private _scene: Float64Array;
	
	constructor(spheres: Sphere[])
	{
		this._sceneBuffer = new SharedArrayBuffer(
			spheres.length * Sphere.BYTES_PER_SPHERE
		);
		this._scene = new Float64Array();
	}
}

type T = [ number, number, number, number, number, number];
class Sphere implements Iterator<T>
{
	// position = 3 elements
	// radius = 1 element
	// albedo = 3
	public static ELEMENTS_PER_SPHERE = 7;
	public static BYTES_PER_SPHERE = Float64Array.BYTES_PER_ELEMENT * Sphere.ELEMENTS_PER_SPHERE;

	private _position: vector.Vec3;
	private _radius: number;
	private _albedo: vector.Vec3;

	public toArray(): T
	{
		
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

const sphere = new Sphere([ 0, 0, 0], 0.5, [ 1, 1, 1]);

const arry = Array.from(sphere);

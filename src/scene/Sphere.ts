import { type vector } from "glm-ts";
import { type SphereArray } from "./SphereArray";
import { type ISphere } from "./ISphere";
import { type IReadonlySphere } from "./IReadonlySphere";

export class Sphere implements ISphere
{
	// position = 3 elements
	// radius = 1 element
	// materialIndex = 1 element
	public static ELEMENTS_PER_SPHERE = 5;
	public static BYTES_PER_SPHERE = Float64Array.BYTES_PER_ELEMENT * Sphere.ELEMENTS_PER_SPHERE;

	private _position : vector.Vec3;
	public get position() { return this._position; }

	private _radius : number;
	public get radius() { return this._radius; }

	private _materialIndex : number;
	public get materialIndex() { return this._materialIndex; }

	public toArray() : SphereArray 
	{
		return [
			...this._position,
			this._radius,
			this.materialIndex
		] as SphereArray;
	}

	public static fromArray(arr : Float64Array) : ISphere 
	{
		return new Sphere(
			[arr[0], arr[1], arr[2]],
			arr[3],
			arr[4]
		);
	}

	public static fromArrayReadonly(arr : Float64Array) : IReadonlySphere 
	{
		return {
			position: [arr[0], arr[1], arr[2]],
			radius: arr[3],
			materialIndex: arr[4]
		};
	}

	constructor(
		position : vector.Vec3,
		radius : number,
		materialIndex : number
	) 
	{
		this._position = position;
		this._radius = radius;
		this._materialIndex = materialIndex;
	}
}

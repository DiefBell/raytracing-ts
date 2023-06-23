import { type vector } from "glm-ts";
import { type Rgb255 } from "../colour/colour";
import { type SphereArray } from "./SphereArray";
import { type ISphere } from "./ISphere";
import { type IReadonlySphere } from "./IReadonlySphere";

export class Sphere implements ISphere
{
	// position = 3 elements
	// radius = 1 element
	// albedo = 3
	public static ELEMENTS_PER_SPHERE = 7;
	public static BYTES_PER_SPHERE = Float64Array.BYTES_PER_ELEMENT * Sphere.ELEMENTS_PER_SPHERE;

	private _position : vector.Vec3;
	public get position() { return this._position; }

	private _radius : number;
	public get radius() { return this._radius; }

	private _albedo : Rgb255;
	public get albedo() { return this._albedo; }

	public toArray() : SphereArray 
	{
		return [
			...this._position,
			this._radius,
			...this._albedo
		] as SphereArray;
	}

	public static fromArray(arr : Float64Array) : ISphere 
	{
		return new Sphere(
			[arr[0], arr[1], arr[2]],
			arr[3],
			[arr[4], arr[5], arr[6]]
		);
	}

	public static fromArrayReadonly(arr : Float64Array) : IReadonlySphere 
	{
		return {
			position: [arr[0], arr[1], arr[2]],
			radius: arr[3],
			albedo: [arr[4], arr[5], arr[6]]
		};
	}

	constructor(
		position : vector.Vec3,
		radius : number,
		albedo : Rgb255
	) 
	{
		this._position = position;
		this._radius = radius;
		this._albedo = albedo;
	}
}

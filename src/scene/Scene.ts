import { type Rgb255 } from "../colour/colour";
import { type IReadonlyScene } from "./IReadonlyScene";
import { type IReadonlySphere } from "./IReadonlySphere";
import { type IScene } from "./IScene";
import { type ISphere } from "./ISphere";
import { Sphere } from "./Sphere";
import { EventEmitter } from "eventemitter3";

export class Scene extends EventEmitter implements IScene
{
	private _spheres : ISphere[];
	public get spheres() : ReadonlyArray<ISphere> { return this._spheres; }

	private _backgroundColour : Rgb255;
	public get backgroundColour() { return this._backgroundColour; }

	private _sceneObjectBuffer : SharedArrayBuffer;
	public get sceneObjectBuffer() { return this._sceneObjectBuffer; }
	private _sceneObjects : Float64Array;
	
	constructor(spheres : Sphere[], bgColour : Rgb255)
	{
		super();

		this._backgroundColour = bgColour;
		this._spheres = spheres;
		this.rebuildSceneBuffer();
	}

	public static fromArrayReadonly(arr : Float64Array, backgroundColour : Rgb255) : IReadonlyScene
	{
		const spheres = new Array<IReadonlySphere>();
		for(let i = 0; i < arr.length; i += Sphere.ELEMENTS_PER_SPHERE)
		{
			spheres.push(
				Sphere.fromArrayReadonly(
					arr.subarray( i, i + Sphere.ELEMENTS_PER_SPHERE)
				)
			);
		}
		return {
			spheres,
			backgroundColour
		};
	}

	public addSphere(sphere : Sphere) : this
	{
		this._spheres.push(sphere);
		return this;
	}

	public removeSpheres(startIndex : number, count ?: number) : this
	{
		this._spheres.splice(startIndex, count);
		return this;
	}

	public removeSphereAt(index : number) : this
	{
		this._spheres.splice(index, 1);
		return this;
	}

	public removeSpheresAt(indices : number[]) : this
	{
		this._spheres = this._spheres.filter((s, i) => !indices.includes(i));
		return this;
	}

	public rebuildSceneBuffer()
	{
		this._sceneObjectBuffer = new SharedArrayBuffer(
			this._spheres.length * Sphere.BYTES_PER_SPHERE
		);
		this._sceneObjects = new Float64Array(this._sceneObjectBuffer);

		for(let i = 0; i < this._spheres.length; i++)
		{
			this._sceneObjects.set(this._spheres[i].toArray(), i * Sphere.ELEMENTS_PER_SPHERE);
		}

		this.emit("update");
	}
}

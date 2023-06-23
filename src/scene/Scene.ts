import { Sphere } from "./Sphere";
import { EventEmitter } from "eventemitter3";

export class Scene extends EventEmitter
{
	private _spheres : Sphere[];
	public get spheres() : ReadonlyArray<Sphere> { return this._spheres; }

	private _sceneObjectBuffer : SharedArrayBuffer;
	public get sceneObjectBuffer() { return this._sceneObjectBuffer; }
	private _sceneObjects : Float64Array;
	
	constructor(spheres : Sphere[])
	{
		super();

		this._spheres = spheres;
		this.rebuildSceneBuffer();
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

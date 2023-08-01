import { type Keyboard, type Mouse } from "@minecraftts/seraph";
import { type vector } from "glm-ts";


export interface ICameraUpdateResult
{
	time : number;
	moved : boolean;
}

export interface ICamera
{
    // returns time to run in ms and whether or not the camera was moved
    update : (ts : number) => ICameraUpdateResult;
    onResize : (width : number, height : number) => void;

    direction : vector.Vector3;
    rayDirectionsBuffer : SharedArrayBuffer;
    position : vector.Vector3;

    strafeSpeed : number;
    rotationSpeed : number;
}

type ICameraConstructor = new (
    viewportWidth : number,
    viewportHeight : number,
    keyboard : Keyboard,
    mouse : Mouse,
    verticalFov : number,
    nearClip : number,
    farClip : number
) => ICamera;

export const constructCamera = (camera : ICameraConstructor, ...params : ConstructorParameters<ICameraConstructor>) =>
{
    return new camera(...params);
};

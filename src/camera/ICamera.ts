import { Keyboard, Mouse } from "@minecraftts/seraph";
import { matrix, vector } from "glm-ts";


export interface ICamera
{
    // returns time to run in ms
    update : (ts : number) => number;
    onResize : (width : number, height : number) => void;

    direction : vector.Vector3;
    rayDirections : vector.Vector3[];
    position: vector.Vector3;

    strafeSpeed: number;
    rotationSpeed: number;
}

type ICameraConstructor = new (
    viewportWidth: number,
    viewportHeight: number,
    keyboard : Keyboard,
    mouse: Mouse,
    fov: matrix.IFov,
    nearClip: number,
    farClip: number
) => ICamera;

export const constructCamera = (camera: ICameraConstructor, ...params: ConstructorParameters<ICameraConstructor>) =>
{
    return new camera(...params);
};

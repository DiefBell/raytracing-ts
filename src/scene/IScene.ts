import { type Rgb255 } from "../colour/colour";
import { type IReadonlyScene } from "./IReadonlyScene";
import { type IReadonlySphere } from "./IReadonlySphere";

export interface IScene extends IReadonlyScene
{
    spheres : ReadonlyArray<IReadonlySphere>;
    backgroundColour : Rgb255;
    sceneObjectBuffer : SharedArrayBuffer;

    on(event : "update", callback : () => void) : void;

    rebuildSceneBuffer() : void;
}

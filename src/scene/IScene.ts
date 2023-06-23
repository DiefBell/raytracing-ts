import { type Rgba255 } from "../colour/colour";
import { type IReadonlySphere } from "./IReadonlySphere";

export interface IScene
{
    spheres : ReadonlyArray<IReadonlySphere>;
    backgroundColour : Rgba255;
    sceneObjectBuffer : SharedArrayBuffer;

    on(event : "update", callback : () => void) : void;

    rebuildSceneBuffer() : void;
}

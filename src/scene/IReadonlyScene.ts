import { type Rgba255 } from "../colour/colour";
import { type IReadonlySphere } from "./IReadonlySphere";

export interface IReadonlyScene
{
    readonly spheres : ReadonlyArray<IReadonlySphere>;
    readonly backgroundColour : Rgba255;
}

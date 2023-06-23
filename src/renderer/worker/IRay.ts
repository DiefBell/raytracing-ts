import { type vector } from "glm-ts";

export interface IRay
{
    rayOrigin : vector.Vector<3>;
    rayDir : vector.Vector<3>;
}

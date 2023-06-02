import { type vector } from "glm-ts";

export interface IRay
{
    origin: vector.Vector<3>;
    direction: vector.Vector<3>;
}

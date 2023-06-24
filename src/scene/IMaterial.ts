import { type Rgb255 } from "../colour/colour";

export interface IMaterial
{
    albedo : Rgb255;
    roughness : number;
    metallic : number;
}

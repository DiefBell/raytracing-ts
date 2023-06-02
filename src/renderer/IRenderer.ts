import { type ICamera } from "../camera/ICamera";
import type { IRenderInfo } from "./IRenderInfo";

export interface IRenderer
{
    onResize : (width : number, height : number) => void;
    render : (camera: ICamera) => Promise<IRenderInfo>;
}

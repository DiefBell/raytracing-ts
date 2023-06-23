import type { IRenderInfo } from "./IRenderInfo";

export interface IRenderer
{
    onResize: (width: number, height: number) => void;
    render: () => IRenderInfo;
}

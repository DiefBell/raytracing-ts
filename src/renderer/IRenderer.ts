export interface IRenderer
{
    onResize: (width: number, height: number) => void;
    render: () => void;
    finalImage: Uint8ClampedArray;
}

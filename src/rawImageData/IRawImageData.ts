export interface IRawImageData
{
	rawDataBuffer : SharedArrayBuffer;
	imageData : Uint8ClampedArray;
    resize : (width : number, height : number) => void;
}

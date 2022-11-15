export type Rgb255 = [ number, number, number ];

export type Rgba255 = [ number, number, number, number ];
export type Rgba1 = [ number, number, number, number ];

export const ELEMENTS_PER_RGBA = 4;

export const clampRgba255 = (colour: Rgba255): Rgba255 => colour.map((val) => Math.min(Math.max(val, 0), 255)) as Rgba255;
export const $clampRgba255 = ($colour: Rgba255): void =>
{
    $colour[0] = Math.min(Math.max($colour[0], 0), 255);
    $colour[1] = Math.min(Math.max($colour[1], 0), 255);
    $colour[2] = Math.min(Math.max($colour[2], 0), 255);
    $colour[3] = Math.min(Math.max($colour[3], 0), 255);
};

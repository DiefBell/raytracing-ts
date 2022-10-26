import * as matrix from "./matrix";

const a: matrix.Matrix = [
    [ 1, 2, 3 ],
    [ 4, 5, 6 ]
];
const b: matrix.Matrix = [
    [ 7,  8  ],
    [ 9,  10 ],
    [ 11, 12 ]
];

export const result1 = matrix.multiply(a, b);
console.log(result1);

const c: matrix.Matrix = [
    [ 3, 4, 2 ]
];
const d: matrix.Matrix = [
    [ 13, 9, 7, 15 ],
    [ 8,  7, 4, 6  ],
    [ 6,  4, 0, 3  ]
];

export const result2 = matrix.multiply(c, d);
console.log(result2);

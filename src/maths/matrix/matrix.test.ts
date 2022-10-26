import * as matrix from "./matrix";

describe("Matrix maths module", () =>
{
    describe("Dot product function", () =>
    {
        it("should correctly dot-product two arrays", () =>
        {
            const a = [ 1, 2, 3  ];
            const b = [ 7, 9, 11 ];

            const result = matrix.dot(a, b);

            expect(result).toEqual(58);
        });

        it("should throw if they arrays are of different length", () =>
        {
            const length2 = [ 1, 2 ];
            const length3 = [ 3, 4, 5 ];

            expect(
                () => matrix.dot(length2, length3)
            ).toThrow();
        });
    });

    describe("Multiply function", () =>
    {
        it("Can multiply a 2x3 matrix with a 3x2 matrix", () =>
        {
            const a: matrix.Matrix = [
                [ 1, 2, 3 ],
                [ 4, 5, 6 ]
            ];
            const b: matrix.Matrix = [
                [ 7,  8  ],
                [ 9,  10 ],
                [ 11, 12 ]
            ];
            const result = matrix.multiply(a, b);

            expect(result).toEqual([
                [ 58,  64  ],
                [ 139, 154 ]
            ]);
        });

        it("Can multiply a 1x3 matrix with a 3x4 matrix", () =>
        {
            const a: matrix.Matrix = [
                [ 3, 4, 2 ]
            ];
            const b: matrix.Matrix = [
                [ 13, 9, 7, 15 ],
                [ 8,  7, 4, 6  ],
                [ 6,  4, 0, 3  ]
            ];

            const result = matrix.multiply(a, b);

            expect(result).toEqual([
                [ 83, 63, 37, 75 ]
            ]);
        });

        it("Should throw if an array is not a valid matrix", () =>
        {
            const goodMatrix: matrix.Matrix = [
                [ 1, 2 ],
                [ 3, 4 ]
            ];
            const badMatrix: matrix.Matrix = [
                [ 5 ],
                [ 6, 7 ],
                [ 8, 9, 10 ]
            ];

            expect(
                () => matrix.multiply(goodMatrix, badMatrix)
            ).toThrow();
        });

        it("Should throw if the number of left-hand columns does not match the number of right-hand rows", () =>
        {
            const fourCols = [
                [ 1, 2, 3, 4 ]
            ];
            const threeRows = [
                [ 5, 6  ],
                [ 7, 8  ],
                [ 9, 10 ]
            ];

            expect(
                () => matrix.multiply(fourCols, threeRows)
            ).toThrow();
        });
    });
});

export type Matrix = Array<Array<number>>;

const isMatrix = (m: number[][]) =>
{
    const width = m[0]?.length;
    for(const row of m)
    {
        if(!(row instanceof Array))
            return false;

        if(row.length !== width)
            return false;
    }
    return true;
};

const arraysHaveSameLength = (a: unknown[], b: unknown[]) => a.length === b.length;

export const dot = (a: number[], b: number[]) =>
{
    if(!arraysHaveSameLength(a, b))
        throw new Error("Cannot dot product arrays of different length");

    let total = 0;
    a.forEach((val, idx) => total += val * b[idx]);

    return total;
};

export const multiply = (l: Matrix, r: Matrix) =>
{
    if(!isMatrix(l))
        throw new Error("Left-hand array is not a valid matrix!");
    
    if(!isMatrix(r))
        throw new Error("Right-hand array is not a valid matrix!");
    
    const lCols = l[0].length;
    const rRows = r.length;

    if(lCols !== rRows)
        throw new Error(`Left-hand matrix with width ${lCols} cannot be multiplied with right-hand matrix with height ${rRows}`);
    
    const lRows = l.length;
    const rCols = r[0].length;
    
    const result: Matrix = [];

    for(let lRow = 0; lRow < lRows; lRow++)
    {
        result[lRow] = [];
        for(let rCol = 0; rCol < rCols; rCol++)
        {
            const row = l[lRow];
            const col = r.map((rRow) => rRow[rCol]);
            result[lRow].push(dot(row, col));
        }
    }

    return result;
};

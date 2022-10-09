// https://github.com/mourner/robust-predicates/blob/master/src/orient2d.js

const macros = {};

macros.Fast_Two_Sum = (a, b, x, y) => `
    ${x} = ${a} + ${b};
    ${y} = ${b} - (${x} - ${a});`;

macros.Two_Sum = (a, b, x, y) => `
    ${x} = ${a} + ${b};
    bvirt = ${x} - ${a};
    ${y} = ${a} - (${x} - bvirt) + (${b} - bvirt);`;

macros.Two_Diff_Tail = (a, b, x, y) => `
    bvirt = ${a} - ${x};
    ${y} = ${a} - (${x} + bvirt) + (bvirt - ${b});`;

macros.Two_Diff = (a, b, x, y) => `
    ${x} = ${a} - ${b};
    ${macros.Two_Diff_Tail(a, b, x, y)}`;

macros.Split = (a, ahi, alo) => `
    c = splitter * ${a};
    ${ahi} = c - (c - ${a});
    ${alo} = ${a} - ${ahi};`;

macros.Two_Product = (a, b, x, y) => `
    ${x} = ${a} * ${b};
    ${macros.Split(a, 'ahi', 'alo')}
    ${macros.Split(b, 'bhi', 'blo')}
    ${y} = alo * blo - (${x} - ahi * bhi - alo * bhi - ahi * blo);`;

macros.Two_Product_Presplit = (a, b, bhi, blo, x, y) => `
    ${x} = ${a} * ${b};
    ${macros.Split(a, 'ahi', 'alo')}
    ${y} = alo * ${blo} - (${x} - ahi * ${bhi} - alo * ${bhi} - ahi * ${blo});`;

macros.Square = (a, x, y) => `
    ${x} = ${a} * ${a};
    ${macros.Split(a, 'ahi', 'alo')}
    ${y} = alo * alo - (${x} - ahi * ahi - (ahi + ahi) * alo);`;

macros.Two_One_Sum = (a1, a0, b, x2, x1, x0) => `
    ${macros.Two_Sum(a0, b, '_i', x0)}
    ${macros.Two_Sum(a1, '_i', x2, x1)}`;

macros.Two_One_Diff = (a1, a0, b, x2, x1, x0) => `
    ${macros.Two_Diff(a0, b, '_i', x0)}
    ${macros.Two_Sum(a1, '_i', x2, x1)}`;

macros.Two_Two_Sum = (a1, a0, b1, b0, x3, x2, x1, x0) => `
    ${macros.Two_One_Sum(a1, a0, b0, '_j', '_0', x0)}
    ${macros.Two_One_Sum('_j', '_0', b1, x3, x2, x1)}`;

macros.Two_Two_Diff = (a1, a0, b1, b0, x3, x2, x1, x0) => `
    ${macros.Two_One_Diff(a1, a0, b0, '_j', '_0', x0)}
    ${macros.Two_One_Diff('_j', '_0', b1, x3, x2, x1)}`;

macros.Two_One_Product = (a1, a0, b, D) => `
    ${macros.Split(b, 'bhi', 'blo')}
    ${macros.Two_Product_Presplit(a0, b, 'bhi', 'blo', '_i', `${D}[0]`)}
    ${macros.Two_Product_Presplit(a1, b, 'bhi', 'blo', '_j', '_0')}
    ${macros.Two_Sum('_i', '_0', '_k', `${D}[1]`)}
    ${macros.Fast_Two_Sum('_j', '_k', 'u3', `${D}[2]`)}
    ${D}[3] = u3;`;

macros.Cross_Product = (a, b, c, d, D, u3 = 'u3') => `
    ${macros.Two_Product(a, d, 's1', 's0')}
    ${macros.Two_Product(c, b, 't1', 't0')}
    ${macros.Two_Two_Diff('s1', 's0', 't1', 't0', u3, `${D}[2]`, `${D}[1]`, `${D}[0]`)}
    ${D}[3] = ${u3};`;

macros.Two_Product_Sum = (a, b, c, d, D) => `
    ${macros.Two_Product(a, b, 's1', 's0')}
    ${macros.Two_Product(c, d, 't1', 't0')}
    ${macros.Two_Two_Sum('s1', 's0', 't1', 't0', 'u3', `${D}[2]`, `${D}[1]`, `${D}[0]`)}
    ${D}[3] = u3;`;

macros.Square_Sum = (a, b, D) => `
    ${macros.Square(a, 's1', 's0')}
    ${macros.Square(b, 't1', 't0')}
    ${macros.Two_Two_Sum('s1', 's0', 't1', 't0', 'u3', `${D}[2]`, `${D}[1]`, `${D}[0]`)}
    ${D}[3] = u3;`;

import {epsilon, splitter, resulterrbound, estimate, vec, sum} from './util.js';

const ccwerrboundA = (3 + 16 * epsilon) * epsilon;
const ccwerrboundB = (2 + 12 * epsilon) * epsilon;
const ccwerrboundC = (9 + 64 * epsilon) * epsilon * epsilon;

const B = vec(4);
const C1 = vec(8);
const C2 = vec(12);
const D = vec(16);
const u = vec(4);

function orient2dadapt(ax, ay, bx, by, cx, cy, detsum) {
    let acxtail, acytail, bcxtail, bcytail;
    let bvirt, c, ahi, alo, bhi, blo, _i, _j, _0, s1, s0, t1, t0, u3;

    const acx = ax - cx;
    const bcx = bx - cx;
    const acy = ay - cy;
    const bcy = by - cy;

    $Cross_Product(acx, bcx, acy, bcy, B);

    let det = estimate(4, B);
    let errbound = ccwerrboundB * detsum;
    if (det >= errbound || -det >= errbound) {
        return det;
    }

    $Two_Diff_Tail(ax, cx, acx, acxtail);
    $Two_Diff_Tail(bx, cx, bcx, bcxtail);
    $Two_Diff_Tail(ay, cy, acy, acytail);
    $Two_Diff_Tail(by, cy, bcy, bcytail);

    if (acxtail === 0 && acytail === 0 && bcxtail === 0 && bcytail === 0) {
        return det;
    }

    errbound = ccwerrboundC * detsum + resulterrbound * Math.abs(det);
    det += (acx * bcytail + bcy * acxtail) - (acy * bcxtail + bcx * acytail);
    if (det >= errbound || -det >= errbound) return det;

    $Cross_Product(acxtail, bcx, acytail, bcy, u);
    const C1len = sum(4, B, 4, u, C1);

    $Cross_Product(acx, bcxtail, acy, bcytail, u);
    const C2len = sum(C1len, C1, 4, u, C2);

    $Cross_Product(acxtail, bcxtail, acytail, bcytail, u);
    const Dlen = sum(C2len, C2, 4, u, D);

    return D[Dlen - 1];
}

export function orient2d(ax, ay, bx, by, cx, cy) {
    const detleft = (ay - cy) * (bx - cx);
    const detright = (ax - cx) * (by - cy);
    const det = detleft - detright;

    if (detleft === 0 || detright === 0 || (detleft > 0) !== (detright > 0)) return det;

    const detsum = Math.abs(detleft + detright);
    if (Math.abs(det) >= ccwerrboundA * detsum) return det;

    return -orient2dadapt(ax, ay, bx, by, cx, cy, detsum);
}

export function orient2dfast(ax, ay, bx, by, cx, cy) {
    return (ay - cy) * (bx - cx) - (ax - cx) * (by - cy);
}
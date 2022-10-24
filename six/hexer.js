// Some vector math.
function _vPolar(a, r) {return [r*Math.cos(a), r*Math.sin(a)];}
function _vScale(v, s) {return [v[0]*s, v[1]*s];}
function _vAdd(v1, v2) {return [v1[0]+v2[0], v1[1]+v2[1]];}

export class Hexer {
  // Calculate everything for a hex-tiled sphere.
  // Size N.

  /*
    N=0 -- A 12-faced dodecahedron; 12 pentagons, and no hexagons.
    N=1 -- 32 faces; 12 pents, and 20 hexes.

    Schematic
      The schematic is a 2d unfolded pattern diagram.
      Its basic shape is this:

        Vertices -- think of these at the pentagons on the sphere:
                0   +   +   +   +
              1   2   3   4   5   +
            6*  7   8   9   10  +
              11  +   +   +   +

        Faces -- think of these as composed of tiles of hexagons:
              0/\ 1/\ 2/\ 3/\ 4/\
              /__\/__\/__\/__\/__\
             /\ 5/\ 6/\ 7/\ 8/\ 9/
          10/__\/__\/__\/__\/__\/
          15\* /\16/\17/\18/\19/
             \/  \/  \/  \/  \/
          There are 20 faces.  The first five are pointy-topped.
          The next five are flat-topped.  And so on.


  */

  constructor(n) {
    this.n = n;

    this.corners = [
      [0,2],
      [0,1], [1,1], [2,1], [3,1], [4,1],
      [0,0], [1,0], [2,0], [3,0], [4,0],
      [1,-1],
    ];
    let h = Math.sqrt(3) / 2;
    this.schematic = {};

    let r;  // radius of "unit" axis
    let e;  // covrner spacing
    let odd = n % 2;
    if (odd) {
      // Even N;
      r = h / 2;
      e = n + 1;
    }
    else {
      // Odd N;
      r = 1 / 2;
      e = n * 3 / 2;
    }
    let a = Math.PI / 3;
    let dx = [r, 0];
    let dy = _vPolar(a, r);
    this.schematic.corners = [];
    this.corners.forEach(v => {
      this._appendOffset(this.schematic.corners, dx, dy, _vScale(v, e));
    });

    this.schematic.ups = [];

    this.schematic.downs = [];

    if (odd) {
      // build the "up" face.
      for (let j = n-1; j >= 2; j -= 2) {
        for (let i = 0; i < n - j; i += 2) {
          this._appendOffset(this.schematic.ups, dx, dy, [i, j]);
        }
      }

      for (let j = 0; j > -n; j -= 2) {
        for (let i = -j; i < n; i += 2) {
          if (i || j) { // Skip the first corner.
            this._appendOffset(this.schematic.downs, dx, dy, [i, j]);
          }
        }
      }
    }
    else {
      let top = n * 3 / 2;
      for (let j = top; j > 0; j--) {
        for (let i = j % 3; i < (top - j); i += 3) {
          this._appendOffset(this.schematic.ups, dx, dy, [i, j]);
        }
      }
      for (let j = 0; j > -top; j--) {
        console.log(`${j} -- ${(-j % 3) - j}; ${top}`);
        for (let i = (-j % 3) - j; i < top; i += 3) {
          if (i || j) {
            this._appendOffset(this.schematic.ups, dx, dy, [i, j]);
          }
        }
      }
      /*
      this._appendOffset(this.schematic.ups, dx, dy, [1, 7]);

      this._appendOffset(this.schematic.ups, dx, dy, [0, 6]);

      this._appendOffset(this.schematic.ups, dx, dy, [2, 5]);

      this._appendOffset(this.schematic.ups, dx, dy, [1, 4]);
      this._appendOffset(this.schematic.ups, dx, dy, [4, 4]);

      this._appendOffset(this.schematic.ups, dx, dy, [0, 3]);
      this._appendOffset(this.schematic.ups, dx, dy, [3, 3]);

      this._appendOffset(this.schematic.ups, dx, dy, [2, 2]);
      this._appendOffset(this.schematic.ups, dx, dy, [5, 2]);

      this._appendOffset(this.schematic.ups, dx, dy, [1, 1]);
      this._appendOffset(this.schematic.ups, dx, dy, [4, 1]);
      this._appendOffset(this.schematic.ups, dx, dy, [7, 1]);
      */
    }

    this.schematic.allFaces = [];
    for (let c = 1; c < 6; c ++) {
      this._appendFace(this.schematic.allFaces, this.schematic.ups,
        this.schematic.corners[c]);
    }
    for (let c = 1; c < 6; c ++) {
      this._appendFace(this.schematic.allFaces, this.schematic.ups,
        this.schematic.corners[c + 5]);
      this._appendFace(this.schematic.allFaces, this.schematic.downs,
        this.schematic.corners[c]);
      }
    for (let c = 6; c < 11; c ++) {
      this._appendFace(this.schematic.allFaces, this.schematic.downs,
        this.schematic.corners[c]);
    }
  }

  _appendOffset(list, dx, dy, offset) {
    // Find offset * [dx,dy axes]; append to list.
    list.push(
      _vAdd(_vScale(dx, offset[0]), _vScale(dy, offset[1])),
    );
  }

  _appendTo(list, from) { from.forEach(x => { list.push(x); }); }

  _appendFace(list, face, offset) {
    // Append all the points in this face to the list, with offset.
    face.forEach(v => {
      list.push(_vAdd(v, offset));
    });
  }
}

// Some vector math.
function _vPolar(a, r) {return [r*Math.cos(a), r*Math.sin(a)];}
function _vScale(v, s) {return [v[0]*s, v[1]*s];}
function _vAdd(v1, v2) {return [v1[0]+v2[0], v1[1]+v2[1]];}

export class Hexer2 {
  /*
    Create a 2d diagram of the hexes and pentagons for tiling a sphere.
    N represents the size.  Even and odd Ns are calculated differently.

    N=0 -- A 12-faced dodecahedron; 12 pentagons, and no hexagons.
    N=1 -- 32 faces; 12 pents, and 20 hexes.

    Schematic
      The schematic is a 2d unfolded pattern diagram.
      Its basic shape is this:

        Vertices -- think of these at the pentagons on the sphere:
               10   +   +   +   +
              1   3   5   7   9   +
            0*  2   4   6   8  +
              11  +   +   +   +

        Faces -- composed of tiles of hexagons:
              0/\ 1/\ 2/\ 3/\ 4/\
              /__\/__\/__\/__\/__\
             /\ 5/\ 6/\ 7/\ 8/\ 9/
          10/__\/__\/__\/__\/__\/
          15\* /\16/\17/\18/\19/
             \/  \/  \/  \/  \/
          There are 20 faces.  The first five are pointy-up.
          The next five are pointy-down.  And so on.
  */

  constructor(n) {
    this.n = n;

    this.oldcorners = [
      [0,0], [0,1], [1,0], [1,1], [2,0], [2,1], [3,0], [3,1], [4,0], [4,1],
      [0,2],
      [1,-1],
    ];
    let h = Math.sqrt(3) / 2;

    this.corners = this._makeCorners();

    let r;  // radius of "unit" axis
    let e;  // corner spacing
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
    // dx: points toward the next corner to the east
    // dy: points toward the next corner to the north-east
    let dx = [r, 0];
    let dy = _vPolar(a, r);
    this.korners = [];

    // edge: is the distance to those corners
    this.edge = e;
    this.size = r;
    this.scale = 1 / (e * r);

    this._makeUpsandDowns(n, dx, dy);

    this.polys = [];
    this.corners.forEach(c => {
      let position = _vScale(_vAdd(_vScale(dx, c.logical[0]), _vScale(dy, c.logical[1])), e);
      let p = {
        x:position[0],
        y:position[1],
        corner:true,
        pent:true,
        ci:c.ci,
        i:this.polys.size,
      };
      this.polys.push(p);
    });

    this.allFaces = [];
    for (let c = 1; c < 10; c+=2) {
      this._appendFace(this.allFaces, this.ups,
        this.corners[c]);
    }
    for (let c = 0; c < 10; c+=2) {
      this._appendFace(this.allFaces, this.ups,
        this.corners[c]);
      this._appendFace(this.allFaces, this.downs,
        this.corners[c + 1]);
      }
    for (let c = 0; c < 10; c+=2) {
      this._appendFace(this.allFaces, this.downs,
        this.corners[c]);
    }

    console.log(JSON.stringify(this.corners));
    console.log(JSON.stringify(this.ups));
    console.log(JSON.stringify(this.downs));
    console.log(JSON.stringify(this.polys));

  }

  _appendOffset(list, dx, dy, offset) {
    // Find offset * [dx,dy axes]; append to list.
    list.push(
      _vAdd(_vScale(dx, offset[0]), _vScale(dy, offset[1])),
    );
  }

  _appendFace(list, face, offset) {
    // Append all the points in this face to the list, with offset.
    face.forEach(v => {
      list.push(_vAdd(v, offset));
    });
  }

  _makeCorners() {
    // The corners are logically the 12 pentagons on the tiled sphere.
    // They are the 12 vertices of a icosahedron.
    // Make a corners array, and return it.
    let corners = [];
    for (let i = 0; i < 12; i++) {
      // For each corner index;
      let c = {
        ci: i, // the Corner index
        neighborCi: [],
        even: !(i % 2),
      };

      if (i < 10) {
        // one of the 10 belt corners
        c.belt = true;
        // neighbors
        const template = c.even ? [11,2,1,-1,-2] : [10,-2,-1,1,2];
        for (let j = 0; j < 5; j++) {
          let n = template[j];
          if (j) {
            n = (n + i + 10) % 10;
          }
          c.neighborCi.push(n);
        }
        if (c.even) {
          c.upCi = i + 1;
          c.downCi = 11;
        }
        else {
          c.upCi = 10;
          c.downCi = (i + 1) % 10;
        }
        c.rightCi = (i + 2) % 10;

        c.logical = [Math.floor(i / 2), c.even ? 0 : 1];

        let lat = Math.atan(0.5);
        let theta = c.even ? -lat : lat;
        let phi = Math.PI * (i - 5) / 5;
      }
      else {
        // the poles
        let north = (i == 10);
        c.pole = true;
        c.neighborCi = ((i == 10) ? [1,3,5,7,9] : [8,6,4,2,0]);
        let phi = Math.PI / (north ? 2 : -2);
        c.logical = north ? [0, 2] : [1, -1];
      }
      corners.push(c);
    }
    return corners;
  }

  _makeUpsandDowns(n, dx, dy) {
    // up[] and down[] are each arrays of 2d coordinates.
    // Each coordinate is the center of a hexagon.
    // They are lists of the hexes that make up each "up" and "down" face.
    // Each coordinate is composed of integer multiples of the dx,dy vectors.
    this.ups = [];
    this.downs = [];
    let odd = n % 2;

    if (odd) {
      // build the "up" face.
      for (let j = n-1; j >= 2; j -= 2) {
        for (let i = 0; i < n - j; i += 2) {
          this._appendOffset(this.ups, dx, dy, [i, j]);
        }
      }

      for (let j = 0; j > -n; j -= 2) {
        for (let i = -j; i < n; i += 2) {
          if (i || j) { // Skip the first corner.
            this._appendOffset(this.downs, dx, dy, [i, j]);
          }
        }
      }
    }
    else {
      // build the "up" face.
      let top = n * 3 / 2;
      for (let j = top; j > 0; j--) {
        for (let i = j % 3; i < (top - j); i += 3) {
          this._appendOffset(this.ups, dx, dy, [i, j]);
        }
      }
      for (let j = 0; j > -top; j--) {
        for (let i = (-j % 3) - j; i < top; i += 3) {
          if (i || j) {
            this._appendOffset(this.downs, dx, dy, [i, j]);
          }
        }
      }
    }
  }
}

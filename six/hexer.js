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
               10   +   +   +   +
              1   3   5   7   9   +
            0*  2   4   6   8  +
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
      [0,0], [0,1], [1,0], [1,1], [2,0], [2,1], [3,0], [3,1], [4,0], [4,1],
      [1,-1],
    ];
    let h = Math.sqrt(3) / 2;

    this.korners = this._makeCorners();

    this.schematic = {};

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
    let dx = [r, 0];
    let dy = _vPolar(a, r);
    this.schematic.corners = [];
    this.corners.forEach(v => {
      this._appendOffset(this.schematic.corners, dx, dy, _vScale(v, e));
    });

    // [ ] define dx, dy, in terms of how to get to the other corners
    // [ ] define up and down arrays

    // dx: points to the next corner to the east
    // dy: points to the next corner to the north-east
    // edge: is the distance to those corners
    this.schematic.dx = dx;
    this.schematic.dy = dy;
    this.schematic.edge = e;

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
        for (let i = (-j % 3) - j; i < top; i += 3) {
          if (i || j) {
            this._appendOffset(this.schematic.downs, dx, dy, [i, j]);
          }
        }
      }
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

    // coords for each center face
    let verts = [[0, 1, 0],]; // north pole
    let spherical = [[Math.PI / 2, 0]];

    let lat = Math.atan(0.5);
    for (let i = 0; i < 10; i++) {
      let theta = (i % 2) ? lat : -lat;
      let phi = Math.PI * (i - 5) / 5;
      spherical.push([theta, phi]);
      verts.push(this._fromSpherical([theta, phi]));
    }

    verts.push([0,-1,0]); // south pole
    spherical.push([-Math.PI / 2, 0]);

    this.sphere = {
      verts: verts,
      spherical: spherical,
    };

    // some stats
    let stats = {
      n:n,
      corners:12,
      hexFaces:this.schematic.allFaces.length,
      faces:this.schematic.allFaces.length + 12,
      faceSize:this.schematic.allFaces.length / 20,
      even:!odd,

    };

    this.stats = stats;
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

  _fromSpherical(spherical) {
    let [long, lat] = spherical;
    // lat: radians, [-pi/2,pi/2], 0 equator, pi/2 north pole
    // long: radians, [-pi,pi], 0 england, neg america, pos asia.
    // Return [x,y,z] on unit sphere;
    //   X-axis: Gulf of Guinea
    //   Y-axis: North pole
    //   Z-axis: Galapagos
    return [
      Math.cos(lat) * Math.cos(-long),
      Math.sin(lat),
      Math.cos(lat) * Math.sin(-long),
    ];
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

        let lat = Math.atan(0.5);
        let theta = c.even ? -lat : lat;
        let phi = Math.PI * (i - 5) / 5;
        c.spherical = [phi, theta];
      }
      else {
        // the poles
        c.pole = true;
        c.neighborCi = ((i == 10) ? [1,3,5,7,9] : [8,6,4,2,0]);

        let phi = Math.PI / ((i == 10) ? 2 : -2);
        c.spherical = [0, phi, true];
      }
      corners.push(c);
    }

    return corners;
  }

  lerpPatch(a, b, c, fx, fy) {
    /*
      Find the spherical coordinates on a triangular patch of the sphere.
        b
      /
     a----c
     <a,b,c> is a triangle on the unit sphere, using my spherical coords.
     fx is a fraction along [a,c]
     fy is a fraction along [a,b]
     Returns spherical coordinate list [theta, phi]
    */
    let dx = [c[0]-a[0], c[1]-a[1]];
    let dy = [b[0]-a[0], b[1]-a[1]];
    if (dx[0] < 0) {
      // dx wrap-around case
      dx[0] += Math.PI * 2;
    }
    if (b[0] < (a[0] - 3)) {
      // dy wrap-around case
      dy[0] += Math.PI * 2;
    }
    if (b[2]) {
      // b is degenerate (is a pole)
      dy[0] = 0;
    }
    let f = [
      (dx[0]*fx + dy[0]*fy) + a[0],
      (dx[1]*fx + dy[1]*fy) + a[1],
    ];
    return f;
  }
}

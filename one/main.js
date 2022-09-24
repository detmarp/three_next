      import * as three from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';
      import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js';

      var scene, camera, renderer;
      var g = {};

      function setup() {
        renderer = new three.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );
      }

      function start() {
        scene = new three.Scene();
        scene.background = new three.Color(0x22dddd);

        const ambient = new three.AmbientLight(0x667788);
        scene.add(ambient);

        const directional = new three.DirectionalLight(0xffffff, 1);
        directional.position.set ( 5, 20, 10);
        scene.add(directional);

        camera = new three.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        camera.position.set(0, 2, 4);

        g.controls = new OrbitControls( camera, renderer.domElement );

        g.o = [];
        addGeo(new three.BoxGeometry(), 0xeedd88, [0, 0.5, 0]);
        addGeo(new three.OctahedronGeometry(0.8), 0x880000, [0, .92, 0]).rotation.y = Math.PI / 4;
        addGeo(new three.CylinderGeometry(0.1, 0.1, 2), 0x665500, [1.5, 1, 0 ]);
        addGeo(new three.SphereGeometry(0.4), 0x44ee00, [1.5, 2, 0 ]);

        var floor = new three.Mesh(
          new three.PlaneGeometry(6, 6),
          new three.MeshPhongMaterial({ color: 0x114400 }));
        floor.position.set(0, 0, 0);
        floor.rotation.x = Math.PI * -0.5;
        scene.add(floor);
      }

      function addGeo(geometry, color, position) {
        var mesh = new three.Mesh(geometry,
          new three.MeshPhongMaterial({ color: color }));
        if (position) {
            mesh.position.set(position[0],position[1],position[2]);
        }
        else {
            var i = g.o.length;
            var x = (i % 3 - 1) * 2 ;
            var z = (Math.floor(i / 3) -1) * -2;
            mesh.position.set(x, 0, z);
            g.o.push(mesh);
        }
        scene.add(mesh);
        return mesh;
      }

      function resize() {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;

        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

        g.controls.update();
      }

      function work() {
        g.o.forEach(obj => {
          obj.rotation.y += 0.01;
        });
      }

      function draw() {
        renderer.render(scene, camera);
      }

      function update() {
        resize();
        work();
        draw();
        requestAnimationFrame(update);
      }

      setup();
      start();
      update();

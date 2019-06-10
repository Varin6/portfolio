

<template>
    <div class="animated-background" id="animated-background">

    </div>
</template>

<script>

    import * as Three from 'three';
    import * as OrbitControls from 'three-orbitcontrols';
    //const OrbitControls = require('three-orbitcontrols');

    export default {
        data() {
            return {

                camera: null,
                scene: null,
                renderer: null,
                mesh: null,
                mesh2: null,
                spotlight: null,
                spotLight2: null,
                time: 0,
                vertices: null,
                geometryCopy: null

            }
        },
        methods:{
            init: function() {


                /**
                 * declare container
                 */

                let container = document.getElementById('animated-background');

                /**
                 * set up Camera
                 * @type {PerspectiveCamera}
                 */

                this.camera = new Three.PerspectiveCamera(75, container.clientWidth/container.clientHeight, 0.01, 20);
                this.camera.position.z = 7;


                /**
                 * Set up Scene
                 * @type {Scene}
                 */

                this.scene = new Three.Scene();


                /**
                 * load textures
                 * @type {Texture}
                 */

                let texture = new Three.TextureLoader().load( '/images/eye-real-pupil.png');
                let textureNormal = new Three.TextureLoader().load( '/images/eye-real-normal.png');
                let textureBump = new Three.TextureLoader().load( '/images/eye-real-bump.png');
                let reflection = new Three.TextureLoader().load( '/images/refl2.jpg');

                /**
                 * set up reflections
                 * @type {PixelFormat}
                 */

                reflection.format = Three.RGBFormat;
                reflection.mapping = Three.SphericalReflectionMapping;
                reflection.encoding = Three.sRGBEncoding;


                texture.onload = function()  {
                    reflection.needsUpdate = true;
                };


                /**
                 * set up Geometries
                 * @type {SphereGeometry}
                 */

                let geometry = new Three.SphereGeometry(2, 64, 64);
                let geometry3 = new Three.SphereGeometry(2, 64, 64);
                let geometry2 = new Three.SphereGeometry(1.6, 64, 64);

                this.geometryCopy = geometry3;
                console.log(geometry3);

                /**
                 * set up Materials
                 * @type {MeshStandardMaterial}
                 */

                let material = new Three.MeshStandardMaterial({
                    color: 0xeeeeee,
                    roughness: 0,
                    //wireframe: true,
                    map: texture,

                    //bumpMap: textureBump,
                    normalMap: textureNormal,
                    normalScale : new Three.Vector2(0.7,0.7),
                   // bumpMap: textureBump,
                    //bumpScale: 1,
                    //specular: 0x050505,
                   // shininess: 100,
                    //emissive: 0xffffff,
                    envMap: reflection,
                    //reflectivity: 0,

                });

                let material2 = new Three.MeshLambertMaterial({
                    color: 0xffffff,
                    roughness: 0,
                    transparent: true,
                    //wireframe: true,
                    //map: texture2,
                    specular: 0x050505,
                    shininess: 100,
                    //emissive: 0xffffff,
                    envMap: reflection,
                    opacity: 0.5

                    //reflectivity: 0,

                });

                /**
                 * set up Meshes
                 * @type {Mesh}
                 */

                this.mesh = new Three.Mesh(geometry, material);
                this.mesh.rotation.x = -1.57;
                //this.mesh.rotation.y = 1.57;
                this.mesh.position.x = 0;
                this.mesh.position.y = 0;
                this.mesh.position.z = 0;

                this.mesh2 = new Three.Mesh(geometry2, material2);
                this.mesh2.rotation.y = -1.57;
                //this.mesh.rotation.y = 1.57;
                this.mesh2.position.x = 0;
                this.mesh2.position.y = 0;
                this.mesh2.position.z = 0.44;


                /**
                 * flatten the iris of the eye
                 */

                this.mesh.geometry.vertices.forEach(moveVerticles);
                this.mesh.geometry.verticesNeedUpdate = true;

                /**
                 * Add meshes to one group
                 * @type {Group}
                 */

                let meshes = new Three.Group();
                meshes.add(this.mesh);
                meshes.add(this.mesh2);

                this.scene.add(meshes);

                /**
                 * Ambient light
                 * @type {AmbientLight}
                 */

                // let light = new Three.AmbientLight( 0x404040 ); // soft white light
                // this.scene.add( light );


                /**
                 * Directional Light
                 * @type {DirectionalLight}
                 */

                // var directionalLight = new Three.DirectionalLight( 0xffffff, 4 );
                // directionalLight.position.y = -200;
                // directionalLight.position.z = 400;
                // directionalLight.position.x = -300;
                // this.scene.add( directionalLight );


                /**
                 * Set up spotlights
                 * @type {SpotLight}
                 */

                this.spotLight = new Three.SpotLight( 0xffffff );
                this.spotLight.position.set( -200, 300, 100 );

                this.spotLight.castShadow = true;

                this.spotLight.shadow.mapSize.width = 1024;
                this.spotLight.shadow.mapSize.height = 1024;

                this.spotLight.shadow.camera.near = 500;
                this.spotLight.shadow.camera.far = 4000;
                this.spotLight.shadow.camera.fov = 30;
                this.spotLight.intensity = 1.6;



                this.spotLight2 = new Three.SpotLight( 0xffffff );
                this.spotLight2.position.set( -200, 300, 100 );

                this.spotLight2.castShadow = true;

                this.spotLight2.shadow.mapSize.width = 1024;
                this.spotLight2.shadow.mapSize.height = 1024;

                this.spotLight2.shadow.camera.near = 500;
                this.spotLight2.shadow.camera.far = 4000;
                this.spotLight2.shadow.camera.fov = 30;
                this.spotLight2.intensity = 1.6;

                this.scene.add( this.spotLight );
                this.scene.add( this.spotLight2 );


                /**
                 * set up Renderer
                 * @type {WebGLRenderer}
                 */


                this.renderer = new Three.WebGLRenderer({antialias: true, alpha: true});
                this.renderer.setSize(container.clientWidth, container.clientHeight);
                container.appendChild(this.renderer.domElement);

                /**
                 * set up OrbitControls
                 * @type {*|exports.default|THREE.OrbitControls}
                 */

                let controls = new OrbitControls( this.camera, this.renderer.domElement );
                //controls.addEventListener( 'change', this.renderer );
                controls.enableDamping = true;
                controls.dampingFactor = 0.25;
                controls.enableZoom = true;



                let renderer = this.renderer;
                let camera = this.camera;
                //let mesh = this.mesh;
                let mesh = meshes;


                /**
                 * Set up canvas resize on window resize
                 */

                window.addEventListener('resize', function () {
                   let width =  container.clientWidth,
                       height =  container.clientHeight;
                   renderer.setSize(width, height);
                   camera.aspect = width/height;
                   camera.updateProjectionMatrix();
                });

                /**
                 * set up eye movement dependent on mouse position
                 * @type {number}
                 */

                let rotX = mesh.rotation.x,
                rotY = mesh.rotation.y;

                window.addEventListener('mousemove', function () {
                    let x = event.clientX,
                        y = event.clientY;

                    mesh.rotation.y = rotY + (x-(container.clientWidth/2))/700;
                    mesh.rotation.x = rotX + (y-(container.clientHeight/2))/700;

                });


                /**
                 * Generate random integer between numbers
                 * @param min
                 * @param max
                 * @returns {*}
                 */

                function getRndInteger(min, max) {
                    return Math.floor(Math.random() * (max - min + 1) ) + min;
                }


                /**
                 * Move vertices in the iris to flatten it
                 * @param item
                 * @param index
                 */

                function moveVerticles(item, index) {
                    if (index > 3520) {
                        item.set(item.x,-1.77082,item.z);
                    }
                }



                let d2 = 0;
                let d = 0;


                this.vertices = this.mesh.geometry.vertices.slice();


                // this.mesh.geometry.vertices.forEach(function (item, index) {
                //
                //     if (index > 3520  ) {
                //
                //             d2 = Math.pow(item.x, 2) + Math.pow(item.z, 2);
                //             d = Math.sqrt(d2);
                //
                //             // console.log('----');
                //             // console.log(item2.x);
                //             // console.log(item2.y);
                //             // console.log(d);
                //             // console.log(d2);
                //
                //
                //             item.x = item.x   * (d*0.5);
                //             item.z = item.z  * (d* 0.5);
                //
                //
                //     }
                // });


                this.mesh.geometry.vertices.forEach(function (item, index) {

                    if (index > 3520  ) {

                        d2 = Math.pow(item.x, 2) + Math.pow(item.z, 2);
                        d = Math.sqrt(d2);


                        // console.log('----');
                        // console.log(item2.x);
                        // console.log(item2.y);
                        // console.log(d);
                        // console.log(d2);

//console.log(vertices[3560].x);
// console.log(d);

                        if  (index != 4033)
                        {

                            // item.x = item.x / ((1/(-d-0.5)) + 2);
                            // item.z = item.z / ((1/(-d-0.5)) + 2);
                            // console.log(item.x);
                            // console.log(item.z);

                        }


                    }
                });



                this.mesh.geometry.uvsNeedUpdate = true;

                this.mesh.geometry.verticesNeedUpdate = true;



            },
            animate: function() {

                const vertices = this.geometryCopy.vertices;
                let d2 = 0;
                let d = 0;

                requestAnimationFrame(this.animate);

                /**
                 * set up time changes
                 * @type {number}
                 */

                this.time += 0.01;
                let time = this.time;

                /**
                 * Spotlight movement
                 * @type {number}
                 */

                this.spotLight.position.x = 200*Math.cos(this.time) + 0;
                this.spotLight.position.z = 200*Math.sin(this.time) + 0; // These to strings make it work

                this.spotLight2.position.x = 300*Math.sin(this.time) + 1;
                this.spotLight2.position.z = 500*Math.cos(this.time) + 1; // These to strings make it work



                this.mesh.geometry.vertices.forEach(function (item, index) {

                    if (index > 3520  ) {

                        d2 = Math.pow(vertices[index].x, 2) + Math.pow(vertices[index].z, 2);
                        d = Math.sqrt(d2);

                        let stretch = 0.47 * d * (3 - d);


                        if (index == 3530) {
                            // console.log(d);
                            // console.log((d/0.75+2));
                            // console.log(item.x);
                            // console.log(item.z);
                            // console.log(vertices[index].x * (d/0.75+2) );
                            // console.log(vertices[index].z * (d/0.75+2) );
                            // console.log('------------');

                        }

                        // console.log('----');
                        // console.log(item2.x);
                        // console.log(item2.y);
                        // console.log(d);
                        // console.log(d2);

//console.log(vertices[3560].x);
// console.log(d);

                        if  (index != 4033)
                        {

                            // item.x = vertices[index].x / ( 1 + ( (d/0.75+1) * (Math.sin(time)/2+1.5) ) );
                            // item.z = vertices[index].z / ( 1 + ( (d/0.75+1) * (Math.sin(time)/2+1.5) ) );

                            // let sin = Math.sin(time)/2+1.5;

                            let sin = ((4 * Math.cos(time * 2)) + 4) ;


                            // let formula = (-(d*3/0.75) + 4);

                            let formula = (Math.sqrt((0.76 + sin) / (d + sin))) ;

                            // item.x = vertices[index].x * ( (-(((sin) * d)/0.75) + (1 + sin))  );
                            // item.z = vertices[index].z * ( (-(((sin) * d)/0.75) + (1 + sin))  );


                            //if (formula >= 1) {

                                item.x = vertices[index].x * formula;
                                item.z = vertices[index].z * formula;
                            //}



                            // item.x = vertices[index].x / (0.1 + (d)) * ((Math.sin(time)/4) + 0.75);
                            // item.z = vertices[index].z / (0.1 + (d)) * ((Math.sin(time)/4) + 0.75);

                            // item.x = vertices[index].x / ((1/(-d-0.5)) + 2) * ((Math.sin(time)+1.5)/4) * 5;
                            // item.z = vertices[index].z / ((1/(-d-0.5)) + 2) * ((Math.sin(time)+1.5)/4) * 5;

                        }

                        // if(index == 3525 || index == 4020) {
                        //     console.log('no: ' + index + '------------' );
                        //     console.log('x: ' + item.x);
                        //     console.log('z: ' + item.z);
                        // }


                    }
                });



                this.mesh.geometry.faceVertexUvs[0].forEach(function (item, index) {

                    if (index > 7103  ) {

                        item.forEach(function (item2, index2) {

                            if (index2 !=2) {





                                // item2.x = item2.x - Math.sin(time)*0.0003;
                                // item2.y = item2.y - Math.sin(time)*0.0003;

                                // item2.x = 1;
                                // item2.y = 0;

                            }


                        });

                    }
                });

                // let x = 0;

                // this.mesh.geometry.faceVertexUvs[0].forEach(function(item, index){
                //     // item[1].x = 0 + Math.sin(time);
                //     // item[1].y = 0 + Math.sin(time);
                //     // item[0].x = 0 + Math.sin(time);
                //     // item[0].y = 0 + Math.sin(time);
                //
                //     x = x + 0.000001;
                //
                //
                //     if (index > 7103 && index < 7232) {
                //
                //         item[1].x = item[1].x + time * (0.0003 + x);
                //         item[1].y = item[1].y + time * (0.0003 + x);
                //         item[0].x = item[0].x + time * (0.0003 + x);
                //         item[0].y = item[0].y + time * (0.0003 + x);
                //         item[2].x = item[2].x + time * (0.0003 + x);
                //         item[2].y = item[2].y + time * (0.0003 + x);
                //
                //         // item[1].x += 0.0001 ;
                //         // item[1].y += 0.0001 ;
                //         // item[0].x += 0.0001 ;
                //         // item[0].y += 0.0001 ;
                //         // item[2].x += 0.0001 ;
                //         // item[2].y += 0.0001 ;
                //
                //     }
                //
                // });



                this.mesh.geometry.vertices.forEach(function (item, index) {

                    // if (index > 3520  ) {
                    //
                    //     let d2 = (item.x ^ 2 + item.z ^ 2);
                    //
                    //     if (d2 < 1 * 1) {
                    //         let d = Math.sqrt(d2);
                    //         let stretch = (1 / 1.5) * d * (2 - d);
                    //         let stretchX = item.x * d;
                    //         let stretchZ = item.z * d;
                    //
                    //         item.set(stretchX, item.y, stretchZ);
                    //     }
                    //
                    // }

                    // let d2 = (item.x^2 + item.y^2);
                    // if (d2 < R*R) {
                    //     let d = Math.sqrt(d2);
                    //     let stretch = (r / rt) * d * (R - d);
                    //     let stretchX = item.x / d;
                    //     let stretchY = item.y / d;
                    // }




                    if (index > 3520  ) {


                        // let d2 = (item.x ^ 2 + item.z ^ 2);
                        // let d = Math.sqrt(d2);
                        //
                        // if (item.z < 0 ){
                        //     item.set((Math.sin(time) * 200 ), item.y, (Math.sin(time) * 200));
                        // }
                        // else {
                        //     item.set((Math.sin(-time) / d ) - 0.1, item.y, item.z);
                        // }


                        // if (item.z > 0 ){
                        //     item.set(item.x, item.y, (Math.sin(time) * 0.1 ) + 0.1);
                        // } else {
                        //     item.set(item.x, item.y, (Math.sin(-time) * 0.1 ) - 0.1);
                        // }

                    }
                });
                this.mesh.geometry.verticesNeedUpdate = true;
                this.mesh.geometry.uvsNeedUpdate = true;


                this.renderer.render(this.scene, this.camera);
            }
        },
        mounted() {
            this.init();
            this.animate();

        }
    }
</script>

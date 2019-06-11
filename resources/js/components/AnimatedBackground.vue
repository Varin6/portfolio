

<template>
    <div class="animated-background" id="animated-background">

    </div>
</template>

<script>

    import * as Three from 'three';
    import * as OrbitControls from 'three-orbitcontrols';
    import * as dat from 'dat.gui';


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
                geometryCopy: null,
                gui: new dat.GUI({
                    height : 5 * 32 - 1
                }),
                params: {
                    multiplier: 5
                },
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
                let textureNormal = new Three.TextureLoader().load( '/images/eye-real-normal2.png');
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
                    roughness: 0.1,
                    //wireframe: true,
                    map: texture,

                    //bumpMap: textureBump,
                    normalMap: textureNormal,
                    normalScale : new Three.Vector2(0.8,0.8),
                   // bumpMap: textureBump,
                    //bumpScale: 1,
                    //specular: 0x050505,
                   // shininess: 100,
                    //emissive: 0xffffff,
                    envMap: reflection,
                    envMapIntensity: 0.5,
                    metalness: 0.6


                });

                let material2 = new Three.MeshLambertMaterial({
                    color: 0xffffff,
                    transparent: true,
                    //wireframe: true,
                    //map: texture2,
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
                // this.mesh.geometry.vertices.forEach(moveVerticles2);



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

                var directionalLight = new Three.DirectionalLight( 0xffffff, 1 );
                directionalLight.position.y = -200;
                directionalLight.position.z = 400;
                directionalLight.position.x = -300;
                this.scene.add( directionalLight );


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
                this.spotLight.intensity = 1;



                this.spotLight2 = new Three.SpotLight( 0xffffff );
                this.spotLight2.position.set( -200, 300, 100 );

                this.spotLight2.castShadow = true;

                this.spotLight2.shadow.mapSize.width = 1024;
                this.spotLight2.shadow.mapSize.height = 1024;

                this.spotLight2.shadow.camera.near = 500;
                this.spotLight2.shadow.camera.far = 4000;
                this.spotLight2.shadow.camera.fov = 30;
                this.spotLight2.intensity = 1;

                this.scene.add( this.spotLight );
                this.scene.add( this.spotLight2 );


                /**
                 * set up Renderer
                 * @type {WebGLRenderer}
                 */


                this.renderer = new Three.WebGLRenderer({antialias: true, alpha: false});
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
                         item.set(item.x,-1.80082,item.z);
                    }
                }


                // function moveVerticles2(item, index) {
                //     if (index > 3648 && index < 4033) {
                //         item.set(item.x,-2.81082,item.z);
                //     }
                // }




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




                this.gui.add(this.params, 'multiplier', 0.5, 7)

            },
            animate: function() {

                const vertices = this.geometryCopy.vertices;
                let d2 = 0;
                let d = 0;
                let multiplier = this.params.multiplier;


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


                        if  (index != 4033)
                        {

                            // item.x = vertices[index].x / ( 1 + ( (d/0.75+1) * (Math.sin(time)/2+1.5) ) );
                            // item.z = vertices[index].z / ( 1 + ( (d/0.75+1) * (Math.sin(time)/2+1.5) ) );

                            // let sin = Math.sin(time)/2+1.5;

                            // let sin = ((4 * Math.cos(time * 2)) + 4)/24 ;
                            let sin = ((3.5 * Math.sin(time )) + 4) ;




                            // let formula = (-(d*3/0.75) + 4);

                             //let formula = (Math.sqrt(((0.76) + sin) / ((d) + sin))) ;
                             //let formula = -(multiplier/(1+Math.pow(400, d*-1)*1.5))+multiplier +0.89 ;
                             let formula = -(sin/(1+Math.pow(400, d*-1)))+sin + 1 - (sin/100) ;




                            if (index == 4022) {
                                //console.log(formula);
                            }

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

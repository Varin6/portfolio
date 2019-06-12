

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
                time: 0,
                vertices: null,
                sphereV1: 64,
                sphereV2: 64,
                rotationX: 0,
                rotationY: 0,
                originalGeometry: null,
                gui: new dat.GUI({
                    height : 5 * 32 - 1
                }),
                params: {
                    multiplier: 5,
                    reflectivity: 0,
                    roughness: 0,
                    metalness: 0,
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

                let texture = new Three.TextureLoader().load( '/images/moon.jpg');
                 let textureNormal = new Three.TextureLoader().load( '/images/moon-normal.png');
                 let reflection = new Three.TextureLoader().load( '/images/refl2.jpg');

                /**
                 * set up reflections
                 * @type {PixelFormat}
                 */

                 reflection.format = Three.RGBFormat;
                 reflection.mapping = Three.SphericalReflectionMapping;
                 reflection.encoding = Three.sRGBEncoding;


                // texture.onload = function()  {
                //     reflection.needsUpdate = true;
                // };


                /**
                 * set up Geometries
                 * @type {SphereGeometry}
                 */


                let geometry = new Three.SphereGeometry(2.5, this.sphereV1, this.sphereV2);

                /**
                 * set up Materials
                 * @type {MeshStandardMaterial}
                 */

                let material = new Three.MeshStandardMaterial({
                    color: 0x5E9FFD,
                    roughness: 0.1,
                    //wireframe: true,
                    //map: texture,
                    //bumpMap: textureBump,
                    //bumpScale: 1,
                    //normalMap: textureNormal,
                    normalScale : new Three.Vector2(0.8,0.8),
                    envMap: reflection,
                    envMapIntensity: 0.5,
                    metalness: 0.6,
                    reflectifity: this.params.reflectivity

                });


                /**
                 * set up Meshes
                 * @type {Mesh}
                 */

                this.mesh = new Three.Mesh(geometry, material);
                this.mesh.position.x = 0;
                this.mesh.position.y = 0;
                this.mesh.position.z = 0;

                this.originalGeometry = this.mesh.geometry.clone();






                this.mesh.geometry.verticesNeedUpdate = true;
                this.mesh.geometry.uvsNeedUpdate = true;

                /**
                 * Add meshes
                 * @type {Group}
                 */


                this.scene.add(this.mesh);



                /**
                 * Planet geometry
                 *
                 */

                let that = this;

                function generatePlanetGeometry(that) {


                    let mesh = that.mesh;
                    let mountains = [];
                    let valleys = [];



                    that.originalGeometry.vertices.forEach(function (item, index) {

                        mesh.geometry.vertices[index].x = item.x;
                        mesh.geometry.vertices[index].y = item.y ;
                        mesh.geometry.vertices[index].z = item.z;

                    });


                    for (let x = 0; x <= 10; x++) {

                        let randomVertex = parseInt(getRndInteger(that.sphereV1 * 2, (that.sphereV1 * (that.sphereV1 - 2))));
                        mountains.push(randomVertex)

                    }


                    for (let x = 0; x <= 10; x++) {

                        let randomVertex = parseInt(getRndInteger(that.sphereV1 * 2, (that.sphereV1 * (that.sphereV1 - 2))));
                        valleys.push(randomVertex)

                    }

                    // console.log(mountains);


                    that.mesh.geometry.vertices.forEach(function (item, index) {


                        if (index <= (that.sphereV1 - 1) * 12 || index >= (that.sphereV1 - 1) * (that.sphereV1 - 12)) {

                            item.x = item.x + getRndInteger(-0.0100, 0.05000) * item.x;
                            item.y = item.y + getRndInteger(-0.0100, 0.05000) * item.y;
                            item.z = item.z + getRndInteger(-0.0100, 0.05000) * item.z;

                        } else {


                            item.x = item.x + getRndInteger(-0.0100, 0.05000) * item.x;
                            item.y = item.y + getRndInteger(-0.0100, 0.05000) * item.y;
                            item.z = item.z + getRndInteger(-0.0100, 0.05000) * item.z;

                        }

                    });


                    /**
                     * generate mountains
                     */


                    mountains.forEach(function (item, index) {

                        let area = [];

                        area.push(mesh.geometry.vertices[item]);
                        area.push(mesh.geometry.vertices[item - 1]);
                        area.push(mesh.geometry.vertices[item + 1]);

                        area.push(mesh.geometry.vertices[item - that.sphereV1]);
                        area.push(mesh.geometry.vertices[item - that.sphereV1 - 1]);
                        area.push(mesh.geometry.vertices[item - that.sphereV1 + 1]);

                        area.push(mesh.geometry.vertices[item + that.sphereV1]);
                        area.push(mesh.geometry.vertices[item + that.sphereV1 - 1]);
                        area.push(mesh.geometry.vertices[item + that.sphereV1 + 1]);

                        area.forEach(function (item2, index2) {

                            item2.x = item2.x + getRndInteger(0.0100, 0.0800) * item2.x;
                            item2.y = item2.y + getRndInteger(0.0100, 0.0800) * item2.y;
                            item2.z = item2.z + getRndInteger(0.0100, 0.0800) * item2.z;


                        });

                    });


                    /**
                     * generate valleys
                     */


                    valleys.forEach(function (item, index) {

                        let area = [];

                        area.push(mesh.geometry.vertices[item]);
                        area.push(mesh.geometry.vertices[item - 1]);
                        area.push(mesh.geometry.vertices[item + 1]);

                        area.push(mesh.geometry.vertices[item - that.sphereV1]);
                        area.push(mesh.geometry.vertices[item - that.sphereV1 - 1]);
                        area.push(mesh.geometry.vertices[item - that.sphereV1 + 1]);

                        area.push(mesh.geometry.vertices[item + that.sphereV1]);
                        area.push(mesh.geometry.vertices[item + that.sphereV1 - 1]);
                        area.push(mesh.geometry.vertices[item + that.sphereV1 + 1]);

                        area.forEach(function (item2, index2) {

                            item2.x = item2.x + getRndInteger(-0.0800, -0.0100) * item2.x;
                            item2.y = item2.y + getRndInteger(-0.0800, -0.0100) * item2.y;
                            item2.z = item2.z + getRndInteger(-0.0800, -0.0100) * item2.z;


                        });

                    });


                    mesh.geometry.verticesNeedUpdate = true;
                    mesh.geometry.uvsNeedUpdate = true;

                    mesh.geometry.computeVertexNormals();
                    mesh.geometry.computeFaceNormals();

                }




                /**
                 * Ambient light
                 * @type {AmbientLight}
                 */

                let light = new Three.AmbientLight( 0x404040, 3 ); // soft white light
                this.scene.add( light );


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
                 * set up Renderer
                 * @type {WebGLRenderer}
                 */


                this.renderer = new Three.WebGLRenderer({antialias: true, alpha: false});
                this.renderer.setSize(container.clientWidth, container.clientHeight);
                this.renderer.setPixelRatio(window.devicePixelRatio);
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





                /**
                 * Set up canvas resize on window resize
                 */

                let renderer = this.renderer;
                let camera = this.camera;

                window.addEventListener('resize', function () {
                   let width =  container.clientWidth,
                       height =  container.clientHeight;
                   renderer.setSize(width, height);
                   camera.aspect = width/height;
                   camera.updateProjectionMatrix();
                });

                this.rotationX = this.mesh.rotation.x;
                this.rotationY = this.mesh.rotation.y;


                this.gui.add(this.params, 'roughness', 0, 1);
                this.gui.add(this.params, 'metalness', 0, 1);






                /**
                 * Generate random integer between numbers
                 * @param min
                 * @param max
                 * @returns {*}
                 */

                function getRndInteger(min, max) {
                    return Math.random() * (max - min) + min;
                }



                window.addEventListener('click', function () {
                    generatePlanetGeometry(that);
                });


                generatePlanetGeometry(this);





            },
            animate: function() {

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

                this.mesh.material.roughness = this.params.roughness;
                this.mesh.material.metalness = this.params.metalness;

                this.mesh.rotation.y = this.rotationY + Math.sin(time);



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

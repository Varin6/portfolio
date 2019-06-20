

<template>
    <div class="animated-background" id="animated-background">

    </div>
</template>

<script>

    import * as Three from 'three';
    import * as OrbitControls from 'three-orbitcontrols';
    import * as dat from 'dat.gui';
    import * as Util from '../utilities';


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
                sphereV1: 16,
                sphereV2: 16,
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
                    wireframe: false,

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

                //let texture = new Three.TextureLoader().load( '/images/moon.jpg');
                 let textureNormal = new Three.TextureLoader().load( '/images/moon-normal.png');
                 let reflection = new Three.TextureLoader().load( '/images/refl2.jpg');


                 let texture = generateDataMaterial();


                let width = 256;
                let height = 256;


                function generateMap() {

                    let materialArray = [];

                    for (let i = 0; i < 6; i++) {

                        console.log('creating map');

                        let map = createMap(i, Util.scalarField);

                        let faceMaterial = new Three.MeshStandardMaterial({
                            map: map,
                            needsUpdate: true,
                        });

                        materialArray.push(faceMaterial);
                    }

                    let newMaterialArray = materialArray.slice();

                    newMaterialArray[2] = materialArray[3];
                    newMaterialArray[3] = materialArray[2];

                    return newMaterialArray;
                }

                let newMaterialArray = generateMap();


                //let texture = new Three.DataTexture( Util.makeScalarField(), width, height, Three.RGBFormat );

                function createMap(index, scalarField) {

                    let map = new Three.DataTexture( Util.makeScalarField(index, width, height), width, height, Three.RGBFormat );
                    // let map = THREE.ImageUtils.generateDataTexture(resolution, resolution, new THREE.Color(0x000000));
                    map.needsUpdate = true;
                    return map;
                }






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


                //let geometry = new Three.SphereGeometry(2.5, this.sphereV1, this.sphereV2);
                let geometry = new Three.BoxGeometry(2.5, 2.5, 2.5, this.sphereV1, this.sphereV2, this.sphereV2);

                /**
                 * set up Materials
                 * @type {MeshStandardMaterial}
                 */


                for (let i in geometry.vertices) {
                    let vertex = geometry.vertices[i];
                    vertex.normalize().multiplyScalar(2.5);
                }

                let material = new Three.MeshStandardMaterial({
                    //color: 0x5E9FFD,
                    roughness: 0.1,
                    wireframe: true,
                    map: texture,
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

                // this.mesh = new Three.Mesh(geometry, material);
                this.mesh = new Three.Mesh(geometry, newMaterialArray);
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


                function generateDataMaterial() {

                    let width = 512;
                    let height = 512;
                    let size = width * height;
                    let data = new Uint8Array( 3 * size );



                    for ( let i = 0; i < size; i ++ ) {

                        let r = Math.floor( Math.random() * 255 );
                        let g = Math.floor( Math.random() * 255 );
                        let b = Math.floor( Math.random() * 255 );

                        let stride = i * 3;

                        data[ stride ] = r;
                        data[ stride + 1 ] = g;
                        data[ stride + 2 ] = b;

                    }

// used the buffer to create a DataTexture

                    let texture = new Three.DataTexture( data, width, height, Three.RGBFormat );
                    texture.needsUpdate = true;

                    return texture;

                }



                function generatePlanetGeometry(that) {

                    console.log();

                    let mesh = that.mesh;
                    let mountains = [];
                    let valleys = [];



                    that.originalGeometry.vertices.forEach(function (item, index) {

                        mesh.geometry.vertices[index].x = item.x;
                        mesh.geometry.vertices[index].y = item.y ;
                        mesh.geometry.vertices[index].z = item.z;

                    });


                    for (let x = 0; x <= 10; x++) {

                        let randomVertex = parseInt(getRndInteger(30,(((that.sphereV1 * (that.sphereV1/2))*11) + 2) ));
                        mountains.push(randomVertex)

                    }


                    for (let x = 0; x <= 10; x++) {

                        let randomVertex = parseInt(getRndInteger(30,(((that.sphereV1 * (that.sphereV1/2))*11) + 2) ));
                        valleys.push(randomVertex)

                    }

                    // console.log(mountains);


                    that.mesh.geometry.vertices.forEach(function (item, index) {


                        if (index <= (that.sphereV1 - 1) * 12 || index >= (that.sphereV1 - 1) * (that.sphereV1 - 12)) {

                            item.x = item.x + getRndInteger(-0.0100, 0.0200) * item.x;
                            item.y = item.y + getRndInteger(-0.0100, 0.0200) * item.y;
                            item.z = item.z + getRndInteger(-0.0100, 0.0200) * item.z;

                        } else {


                            item.x = item.x + getRndInteger(-0.0100, 0.0200) * item.x;
                            item.y = item.y + getRndInteger(-0.0100, 0.0200) * item.y;
                            item.z = item.z + getRndInteger(-0.0100, 0.0200) * item.z;

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
                this.gui.add(this.params, 'wireframe', 0, 1);






                /**
                 * Generate random integer between numbers
                 * @param min
                 * @param max
                 * @returns {*}
                 */

                function getRndInteger(min, max) {
                    return Math.random() * (max - min) + min;
                }



                that = this;

                window.addEventListener('click', function () {
                    //let texture = generateDataMaterial();
                    generatePlanetGeometry(that);


                    Util.generateSeeds();

                    //console.log(Util.stringToNumber('bobe'));
                    // console.log(Util.random('bobe'));

                    let newMaterialArray = generateMap();
                    that.mesh.material = newMaterialArray;
                    that.mesh.material[0].map.needsUpdate = true;




                });


                //generatePlanetGeometry(this);




                this.mesh.geometry.verticesNeedUpdate = true;
                this.mesh.geometry.uvsNeedUpdate = true;

                this.mesh.geometry.computeVertexNormals();
                this.mesh.geometry.computeFaceNormals();


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

                let that = this;
                this.mesh.material.forEach(function (item, index) {
                    item.roughness = that.params.roughness;
                })
                this.mesh.material.forEach(function (item, index) {
                    item.metalness = that.params.metalness;
                })

                this.mesh.rotation.y = this.rotationY + Math.sin(time);

                if (this.params.wireframe == 1) {
                    this.mesh.material.forEach(function (item, index) {
                        item.wireframe = true;
                    })
                } else {
                    this.mesh.material.forEach(function (item, index) {
                        item.wireframe = false;
                    })
                }


                this.mesh.geometry.verticesNeedUpdate = true;
                this.mesh.geometry.uvsNeedUpdate = true;
                this.mesh.material.needsUpdate = true;



                this.mesh.material.map.needsUpdate = true;


                for (let i = 0; i < 6; i++) {


                    // console.log('updating needsupd');

                    this.mesh.material[i].map.needsUpdate = true;
                    this.mesh.material[i].needsUpdate = true;
                    this.mesh.material.needsUpdate = true;


                }


                this.renderer.render(this.scene, this.camera);
            }
        },
        mounted() {
            this.init();
            this.animate();

        }
    }
</script>

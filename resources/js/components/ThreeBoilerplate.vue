

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
                rotationX: 0,
                rotationY: 0,
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

                // let texture = new Three.TextureLoader().load( '/images/eye-real-pupil.png');
                // let textureNormal = new Three.TextureLoader().load( '/images/eye-real-normal2.png');
                // let reflection = new Three.TextureLoader().load( '/images/refl2.jpg');

                /**
                 * set up reflections
                 * @type {PixelFormat}
                 */

                // reflection.format = Three.RGBFormat;
                // reflection.mapping = Three.SphericalReflectionMapping;
                // reflection.encoding = Three.sRGBEncoding;


                // texture.onload = function()  {
                //     reflection.needsUpdate = true;
                // };


                /**
                 * set up Geometries
                 * @type {SphereGeometry}
                 */

                let geometry = new Three.SphereGeometry(2, 64, 64);

                /**
                 * set up Materials
                 * @type {MeshStandardMaterial}
                 */

                let material = new Three.MeshStandardMaterial({
                    color: 0xeeeeee,
                    roughness: 0.1,
                    wireframe: true,
                    //map: texture,
                    //bumpMap: textureBump,
                    //bumpScale: 1,
                    //normalMap: textureNormal,
                    //normalScale : new Three.Vector2(0.8,0.8),
                    //envMap: reflection,
                    //envMapIntensity: 0.5,
                    metalness: 0.6

                });


                /**
                 * set up Meshes
                 * @type {Mesh}
                 */

                this.mesh = new Three.Mesh(geometry, material);
                this.mesh.position.x = 0;
                this.mesh.position.y = 0;
                this.mesh.position.z = 0;




                this.mesh.geometry.verticesNeedUpdate = true;
                this.mesh.geometry.uvsNeedUpdate = true;

                /**
                 * Add meshes to one group
                 * @type {Group}
                 */


                this.scene.add(this.mesh);

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


                /**
                 * Generate random integer between numbers
                 * @param min
                 * @param max
                 * @returns {*}
                 */

                function getRndInteger(min, max) {
                    return Math.floor(Math.random() * (max - min + 1) ) + min;
                }


                this.rotationX = this.mesh.rotation.x;
                this.rotationY = this.mesh.rotation.y;

                this.gui.add(this.params, 'multiplier', 0.5, 7)

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

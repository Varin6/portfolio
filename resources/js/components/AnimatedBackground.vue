

<template>
    <div class="animated-background" id="animated-background">

    </div>
</template>

<script>

    import * as Three from 'three'

    export default {
        data() {
            return {

                camera: null,
                scene: null,
                renderer: null,
                mesh: null,
                mesh2: null,
                spotlight: null,
                time: 0

            }
        },
        methods:{
            init: function() {
                let container = document.getElementById('animated-background');

                this.camera = new Three.PerspectiveCamera(75, container.clientWidth/container.clientHeight, 0.01, 20);
                this.camera.position.z = 7;

                this.scene = new Three.Scene();

                let texture = new Three.TextureLoader().load( '/images/eye-skin.png');
                let texture2 = new Three.TextureLoader().load( '/images/eye4.png');
                //let texture = new Three.TextureLoader().load( '/images/planet.jpg');
                //texture.offset.x = 0.1;
                // texture.offset.y = 0.1;


                    let geometry = new Three.SphereGeometry(2, 64, 64);
                    let geometry2 = new Three.SphereGeometry(1, 64, 64);

                    let material = new Three.MeshPhongMaterial({
                        color: 0xaa2547,
                        wireframeLinewidth: 10,
                        //wireframe: true,
                        map: texture,
                        specular: 0x050505,
                        shininess: 100

                    });

                let material2 = new Three.MeshPhongMaterial({
                    color: 0xaa2547,
                    wireframeLinewidth: 10,
                    //wireframe: true,
                    map: texture2,
                    specular: 0x050505,
                    shininess: 100

                });

                    this.mesh = new Three.Mesh(geometry, material);
                    this.mesh.rotation.y = -1.57;
                    //this.mesh.rotation.y = 1.57;
                    this.mesh.position.x = 0;
                    this.mesh.position.y = 0;
                    this.mesh.position.z = 0;

                    this.mesh2 = new Three.Mesh(geometry2, material2);
                    this.mesh2.rotation.y = -1.57;
                    //this.mesh.rotation.y = 1.57;
                    this.mesh2.position.x = 0;
                    this.mesh2.position.y = 0;
                    this.mesh2.position.z = 1.17;

                    let meshes = new Three.Group();
                    meshes.add(this.mesh);
                    meshes.add(this.mesh2);

                    this.scene.add(meshes);




                // Directional light

                // var directionalLight = new Three.DirectionalLight( 0xffffff, 4 );
                // directionalLight.position.y = -200;
                // directionalLight.position.z = 400;
                // directionalLight.position.x = -300;
                // this.scene.add( directionalLight );


                // Spotlight

                this.spotLight = new Three.SpotLight( 0xffffff );
                this.spotLight.position.set( -200, 300, 100 );

                this.spotLight.castShadow = true;

                this.spotLight.shadow.mapSize.width = 1024;
                this.spotLight.shadow.mapSize.height = 1024;

                this.spotLight.shadow.camera.near = 500;
                this.spotLight.shadow.camera.far = 4000;
                this.spotLight.shadow.camera.fov = 30;
                this.spotLight.intensity = 4.6;

                this.scene.add( this.spotLight );




                this.renderer = new Three.WebGLRenderer({antialias: true, alpha: false});
                this.renderer.setSize(container.clientWidth, container.clientHeight);
                container.appendChild(this.renderer.domElement);

                let renderer = this.renderer;
                let camera = this.camera;
                //let mesh = this.mesh;
                let mesh = meshes;

                window.addEventListener('resize', function () {
                   let width =  container.clientWidth,
                       height =  container.clientHeight;
                   renderer.setSize(width, height);
                   camera.aspect = width/height;
                   camera.updateProjectionMatrix();
                });

                let rotX = mesh.rotation.x,
                rotY = mesh.rotation.y;

                window.addEventListener('mousemove', function () {
                    let x = event.clientX,
                        y = event.clientY;

                    mesh.rotation.y = rotY + (x-(container.clientWidth/2))/700;
                    mesh.rotation.x = rotX + (y-(container.clientHeight/2))/700;
                    // mesh.rotation.z = y/7000;
                    // mesh.rotation.z = x/7000;

                });

                function getRndInteger(min, max) {
                    return Math.floor(Math.random() * (max - min + 1) ) + min;
                }

            },
            animate: function() {
                requestAnimationFrame(this.animate);
                this.time += 0.01
                this.spotLight.position.x = 200*Math.cos(this.time) + 0;
                this.spotLight.position.z = 200*Math.sin(this.time) + 0; // These to strings make it work

                this.renderer.render(this.scene, this.camera);
            }
        },
        mounted() {
            this.init();
            this.animate();
        }
    }
</script>

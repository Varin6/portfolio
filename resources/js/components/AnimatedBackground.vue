

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
                spotLight2: null,
                time: 0

            }
        },
        methods:{
            init: function() {
                let container = document.getElementById('animated-background');

                this.camera = new Three.PerspectiveCamera(75, container.clientWidth/container.clientHeight, 0.01, 20);
                this.camera.position.z = 7;

                this.scene = new Three.Scene();

                let texture = new Three.TextureLoader().load( '/images/eye-real-pupil.png');
                let textureNormal = new Three.TextureLoader().load( '/images/eye-real-normal.png');
                let textureBump = new Three.TextureLoader().load( '/images/eye-real-bump.png');
                let texture2 = new Three.TextureLoader().load( '/images/eye4.png');
                let reflection = new Three.TextureLoader().load( '/images/refl2.jpg');
                reflection.format = Three.RGBFormat;
                reflection.mapping = Three.SphericalReflectionMapping;
                reflection.encoding = Three.sRGBEncoding;
                texture.onload = function()  {
                    reflection.needsUpdate = true;
                };



                let geometry = new Three.SphereGeometry(2, 64, 64);
                let geometry2 = new Three.SphereGeometry(1, 64, 64);

                let material = new Three.MeshStandardMaterial({
                    color: 0xeeeeee,
                    roughness: 0,
                    //wireframe: true,
                    map: texture,

                    bumpMap: textureBump,
                    normalMap: textureNormal,
                    normalScale : new Three.Vector2(0.7,0.7),
                   // bumpMap: textureBump,
                    bumpScale: 1,
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
                    wireframeLinewidth: 10,
                    //wireframe: true,
                    //map: texture2,
                    specular: 0x050505,
                    shininess: 100,
                    //emissive: 0xffffff,
                    envMap: reflection,
                    opacity: 0.5

                    //reflectivity: 0,

                });

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
                this.mesh2.position.z = 1.27;

                this.mesh.geometry.vertices.forEach(moveVerticles);




                this.mesh.geometry.verticesNeedUpdate = true;

                let meshes = new Three.Group();
                meshes.add(this.mesh);
                meshes.add(this.mesh2);

                    this.scene.add(meshes);

                // var light = new Three.AmbientLight( 0x404040 ); // soft white light
                // this.scene.add( light );


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

                function moveVerticles(item, index) {
                    if (index > 3520) {
                        item.set(item.x,-1.77082,item.z);
                    }
                }

            },
            animate: function() {
                requestAnimationFrame(this.animate);
                this.time += 0.01;
                let time = this.time;
                this.spotLight.position.x = 200*Math.cos(this.time) + 0;
                this.spotLight.position.z = 200*Math.sin(this.time) + 0; // These to strings make it work

                this.spotLight2.position.x = 300*Math.sin(this.time) + 1;
                this.spotLight2.position.z = 500*Math.cos(this.time) + 1; // These to strings make it work



                this.mesh.geometry.vertices.forEach(function (item, index) {


                    // if (index > 930 && index < 962 ) {
                    //
                    //     if (item.x > 0 ){
                    //         item.set((Math.sin(time) * 0.5 ) + 0.5, item.y, item.z);
                    //     } else {
                    //         item.set((Math.sin(-time) * 0.5 ) - 0.5, item.y, item.z);
                    //     }
                    //
                    //
                    //     if (item.z > 0 ){
                    //         item.set(item.x, item.y, (Math.sin(time) * 0.5 ) + 0.5);
                    //     } else {
                    //         item.set(item.x, item.y, (Math.sin(-time) * 0.5 ) - 0.5);
                    //     }
                    //
                    // }
                });
                this.mesh.geometry.verticesNeedUpdate = true;


                this.renderer.render(this.scene, this.camera);
            }
        },
        mounted() {
            this.init();
            this.animate();
        }
    }
</script>

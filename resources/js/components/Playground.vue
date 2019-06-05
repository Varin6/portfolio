

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
                particleCount: null,
                particleSystem: null,
                particles: null,
                pMaterial: null,
                spotlight: null,
                time: 0

            }
        },
        methods:{
            init: function() {
                let container = document.getElementById('animated-background');

                this.camera = new Three.PerspectiveCamera(90, container.clientWidth/container.clientHeight, 0.01, 500);
                this.camera.position.z = 7;

                this.scene = new Three.Scene();

                let texture = new Three.TextureLoader().load( '/images/dick.png');

// create the particle variables
                this.particleCount = 180;
                this.particles = new Three.Geometry();
                this.pMaterial = new Three.PointsMaterial({
                    color: 0xFFFFFF,
                    size: 20,
                    map: texture,
                    blending: Three.AdditiveBlending,
                    transparent: true
                });



// now create the individual particles
                for (var p = 0; p < this.particleCount; p++) {

                    // create a particle with random
                    // position values, -250 -> 250
                    // var pX = Math.random() * 500 - 250,
                    //     pY = Math.random() * 500 - 250,
                    //     pZ = Math.random() * 500 - 250,

                    let pX = getRndInteger(-250, 250),
                        pY = getRndInteger(-250, 250),
                        pZ = getRndInteger(-250, 250),
                        particle =
                            new Three.Vector3(pX, pY, pZ)
                        ;

                    particle.velocity = new Three.Vector3(
                        getRndInteger(-1, 1),              // x
                        getRndInteger(-1, 1), // y: random vel
                        getRndInteger(-1, 1));

                    // add it to the geometry
                    this.particles.vertices.push(particle);
                }

// create the particle system
                this.particleSystem = new Three.ParticleSystem(
                    this.particles,
                    this.pMaterial);

                this.particleSystem.sortParticles = true;

// add it to the scene
                this.scene.add(this.particleSystem);



                // Directional light

                // var directionalLight = new Three.DirectionalLight( 0xffffff, 4 );
                // directionalLight.position.y = -200;
                // directionalLight.position.z = 400;
                // directionalLight.position.x = -300;
                // this.scene.add( directionalLight );


                // Spotlight

                // this.spotLight = new Three.SpotLight( 0xffffff );
                // this.spotLight.position.set( -200, 300, 100 );
                //
                // this.spotLight.castShadow = true;
                //
                // this.spotLight.shadow.mapSize.width = 1024;
                // this.spotLight.shadow.mapSize.height = 1024;
                //
                // this.spotLight.shadow.camera.near = 500;
                // this.spotLight.shadow.camera.far = 4000;
                // this.spotLight.shadow.camera.fov = 30;
                // this.spotLight.intensity = 4.6;
                //
                // this.scene.add( this.spotLight );




                this.renderer = new Three.WebGLRenderer({antialias: true, alpha: true});
                this.renderer.setSize(container.clientWidth, container.clientHeight);
                container.appendChild(this.renderer.domElement);

                let renderer = this.renderer;
                let camera = this.camera;
                //let mesh = this.mesh;
                //let mesh = meshes;

                window.addEventListener('resize', function () {
                   let width =  container.clientWidth,
                       height =  container.clientHeight;
                   renderer.setSize(width, height);
                   camera.aspect = width/height;
                   camera.updateProjectionMatrix();
                });

                 let rotX = camera.rotation.x,
                 rotY = camera.rotation.y;

                window.addEventListener('mousemove', function () {
                    let x = event.clientX,
                        y = event.clientY;

                    camera.rotation.y = rotY + (x-(container.clientWidth/2))/700;
                    camera.rotation.x = rotX + (y-(container.clientHeight/2))/700;


                });




                function getRndInteger(min, max) {
                    return Math.floor(Math.random() * (max - min + 1) ) + min;
                }

            },
            animate: function() {
                requestAnimationFrame(this.animate);
                // this.time += 0.01
                // this.spotLight.position.x = 200*Math.cos(this.time) + 0;
                // this.spotLight.position.z = 200*Math.sin(this.time) + 0; // These to strings make it work


                let pCount = this.particleCount;
                while (pCount--) {

                    // get the particle
                    let particle =
                        this.particles.vertices[pCount];


                    console.log(particle.velocity)
                    // check if we need to reset
                    if (particle.y < -200 ) {
                        particle.y = 200;
                        particle.z = getRndInteger(-250, 250);
                        particle.x = getRndInteger(-250, 250);
                        particle.velocity.y = 0;

                    }

                    // update the velocity with
                    // a splat of randomniz
                    particle.velocity.y -= Math.random() * .05;


                    // and the position
                    particle.add(
                        particle.velocity);
                }

                // flag to the particle system
                // that we've changed its vertices.
                this.particleSystem.
                    geometry.
                    verticesNeedUpdate  = true;




                this.renderer.render(this.scene, this.camera);

                function getRndInteger(min, max) {
                    return Math.floor(Math.random() * (max - min + 1) ) + min;
                }
            }
        },
        mounted() {
            this.init();
            this.animate();
        }
    }
</script>

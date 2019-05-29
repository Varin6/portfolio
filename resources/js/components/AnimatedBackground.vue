

<template>
    <div class="animated-background" id="animated-background"></div>
</template>

<script>

    import * as Three from 'three'

    export default {
        data() {
            return {

                camera: null,
                scene: null,
                renderer: null,
                mesh: null

            }
        },
        methods:{
            init: function() {
                let container = document.getElementById('animated-background');

                this.camera = new Three.PerspectiveCamera(25, container.clientWidth/container.clientHeight, 0.01, 10);
                this.camera.position.z = 4;

                this.scene = new Three.Scene();

                let geometry = new Three.BoxGeometry(1, 1, 1);
                let material = new Three.MeshNormalMaterial({
                    color: 0xaa2547,
                    wireframeLinewidth: 10,
                    wireframe: true,
                });


                this.mesh = new Three.Mesh(geometry, material);
                this.scene.add(this.mesh);

                this.renderer = new Three.WebGLRenderer({antialias: true, alpha: true});
                this.renderer.setSize(container.clientWidth, container.clientHeight);
                container.appendChild(this.renderer.domElement);

                let renderer = this.renderer;
                let camera = this.camera;
                let mesh = this.mesh;

                window.addEventListener('resize', function () {
                   let width =  container.clientWidth,
                       height =  container.clientHeight;
                   renderer.setSize(width, height);
                   camera.aspect = width/height;
                   camera.updateProjectionMatrix();
                });

                window.addEventListener('mousemove', function () {
                    let x = event.clientX,
                        y = event.clientY;

                    mesh.rotation.y = x/2000;
                    mesh.rotation.x = y/2000;
                    // mesh.rotation.z = y/7000;
                    // mesh.rotation.z = x/7000;

                });

            },
            animate: function() {
                requestAnimationFrame(this.animate);
                // this.mesh.rotation.x += 0.001;
                // this.mesh.rotation.y += 0.002;
                // this.mesh.rotation.z += 0.003;
                //
                this.renderer.render(this.scene, this.camera);
            }
        },
        mounted() {
            this.init();
            this.animate();
        }
    }
</script>

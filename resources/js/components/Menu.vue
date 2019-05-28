<template>
    <div class="menu">
    <div class="overlay" :class="{'--overlay-down' : iconIsHovering}">{{menuItem}}</div>
        <div
                class="menu-items"
                :class="{'--menu-hidden' : !menuIsHovering}"
                @mouseover="menuIsHovering = true; zeroTranslate()"
                @mouseout="menuIsHovering = false; transformX()">

            <div style="opacity: 1"
                 :style="[menuIsHovering ? {opacity:0} : {opacity:1}]"
                 class="menu-icon menu-icon__burger"></div>


            <router-link
                    v-for="(item, index) in items"
                    v-bind:key="item.class"
                    :style="'transform:translateY(' + item.translate + 'px)'"
                    class="menu-icon"
                    :class="'menu-items__' + item.class"
                    :to="{ path: item.url }"
                    @click.native="iconIsHovering = false"
                    @mouseover.native="menuTitle(item.name); iconIsHovering = true;"
                    @mouseout.native="iconIsHovering = false">
            </router-link>



            <!--<router-link-->
                    <!--class="menu-icon menu-items__home"-->
                    <!--to="/"-->
                    <!--@click.native="iconIsHovering = false"-->
                    <!--@mouseover.native="menuTitle('Home'); iconIsHovering = true"-->
                    <!--@mouseout.native="iconIsHovering = false">-->
            <!--</router-link>-->
            <!--<router-link-->
                    <!--class="menu-icon menu-items__about"-->
                    <!--to="about"-->
                    <!--@click.native="iconIsHovering = false"-->
                    <!--@mouseover.native="menuTitle('About Me'); iconIsHovering = true"-->
                    <!--@mouseout.native="iconIsHovering = false">-->
            <!--</router-link>-->
            <!--<router-link-->
                    <!--class="menu-icon menu-items__case-studies"-->
                    <!--to="case-studies"-->
                    <!--@click.native="iconIsHovering = false"-->
                    <!--@mouseover.native="menuTitle('Case Studies'); iconIsHovering = true"-->
                    <!--@mouseout.native="iconIsHovering = false"></router-link>-->
            <!--<router-link-->
                    <!--class="menu-icon menu-items__blog"-->
                    <!--to="blog"-->
                    <!--@click.native="iconIsHovering = false"-->
                    <!--@mouseover.native="menuTitle('Blog'); iconIsHovering = true"-->
                    <!--@mouseout.native="iconIsHovering = false"></router-link>-->
            <!--<router-link-->
                    <!--class="menu-icon menu-items__contact"-->
                    <!--to="contact"-->
                    <!--@click.native="iconIsHovering = false"-->
                    <!--@mouseover.native="menuTitle('Get In Touch!'); iconIsHovering = true"-->
                    <!--@mouseout.native="iconIsHovering = false"></router-link>-->

        </div>

    </div>
</template>

<script>
    export default {
        data() {
            return {


                menuIsHovering: false,
                iconIsHovering: false,
                menuItem: '',

                items: [
                    {
                        translate: 0,
                        name: 'Home',
                        url: '/',
                        class: 'home'
                    },
                    {
                        translate: 0,
                        name: 'About Me',
                        url: 'about',
                        class: 'about'
                    },
                    {
                        translate: 0,
                        name: 'Case Studies',
                        url: 'case-studies',
                        class: 'case-studies'
                    },
                    {
                        translate: 0,
                        name: 'Blog',
                        url: 'blog',
                        class: 'blog'
                    },
                    {
                        translate: 0,
                        name: 'Get in touch!',
                        url: 'contact',
                        class: 'contact'
                    }
                ]

            }
        },
        methods:{

            menuTitle(title = ''){
                this.menuItem = title;
            },

            zeroTranslate() {

                let thisItems = this.items;
                this.items.forEach(function (item, key) {
                    thisItems[key].translate = 0;
                });

            },

            transformX() {


                let itemsCount = this.items.length,
                    middle = Math.floor(itemsCount/2),
                    thisItems = this.items,
                    baseValue = 71 * middle;

                this.items.forEach(function (item, key) {

                        thisItems[key].translate = baseValue;
                        baseValue = baseValue - 71;

                });



            }

        },
        computed: {

        },
        mounted() {

            this.transformX();

            console.log('Component mounted.')
        }
    }
</script>

<template>
    <div class="menu">
    <div class="overlay" :class="{'--overlay-down' : iconIsHovering}">{{menuItem}}</div>
        <div
                class="menu-items"
                :class="{'--menu-hidden' : !menuIsHovering}"
                @mouseover="menuIsHovering = true"
                @mouseout="menuIsHovering = false">

            <router-link
                    class="menu-icon menu-items__home"
                    to="/"
                    @click.native="iconIsHovering = false"
                    @mouseover.native="menuTitle('Home'); iconIsHovering = true"
                    @mouseout.native="iconIsHovering = false">
            </router-link>
            <router-link
                    class="menu-icon menu-items__about"
                    to="about"
                    @click.native="iconIsHovering = false"
                    @mouseover.native="menuTitle('About Me'); iconIsHovering = true"
                    @mouseout.native="iconIsHovering = false">
            </router-link>
            <router-link
                    class="menu-icon menu-items__case-studies"
                    to="case-studies"
                    @click.native="iconIsHovering = false"
                    @mouseover.native="menuTitle('Case Studies'); iconIsHovering = true"
                    @mouseout.native="iconIsHovering = false"></router-link>
            <router-link
                    class="menu-icon menu-items__blog"
                    to="blog"
                    @click.native="iconIsHovering = false"
                    @mouseover.native="menuTitle('Blog'); iconIsHovering = true"
                    @mouseout.native="iconIsHovering = false"></router-link>
            <router-link
                    class="menu-icon menu-items__contact"
                    to="contact"
                    @click.native="iconIsHovering = false"
                    @mouseover.native="menuTitle('Get In Touch!'); iconIsHovering = true"
                    @mouseout.native="iconIsHovering = false"></router-link>

        </div>

    </div>
</template>

<script>
    export default {
        data() {
            return {

                menuIsHovering: false,
                iconIsHovering: false,
                menuItem: ''
            }
        },
        methods:{

            menuTitle(title = ''){
                this.menuItem = title;
            }

        },
        mounted() {
            console.log('Component mounted.')
        }
    }
</script>

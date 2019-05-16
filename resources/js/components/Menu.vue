<template>
    <div class="menu">

        <div class="menu-items">

            <router-link to="home">
                <div class="menu-icon menu-items__home" onmouseover="menuTitleIn('home')" onmouseout="menuTitleOut()"></div>
            </router-link>
            <router-link to="about">
                <div class="menu-icon menu-items__about" onmouseover="menuTitleIn('about')" onmouseout="menuTitleOut()"></div>
            </router-link>
            <div class="menu-icon menu-items__case-studies"></div>
            <div class="menu-icon menu-items__blog"></div>
            <div class="menu-icon menu-items__contact"></div>

        </div>

    </div>
</template>

<script>
    export default {
        mounted() {
            console.log('Component mounted.')
        }
    }
</script>

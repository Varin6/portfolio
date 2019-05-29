/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */


require('./bootstrap');
window.Vue = require('vue');
require('./general');

/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i);
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default));

import VueRouter from 'vue-router';
Vue.use(VueRouter);

import VueAxios from 'vue-axios';
import axios from 'axios';
Vue.use(VueAxios, axios);

import Home from './components/Home.vue';
import About from './components/About.vue';
import CaseStudies from "./components/CaseStudies";
import Blog from './components/Blog.vue';
import Contact from './components/Contact.vue';


Vue.component('example-component', require('./components/ExampleComponent.vue').default);
Vue.component('menu-component', require('./components/Menu.vue').default);
Vue.component('animated-background-component', require('./components/AnimatedBackground.vue').default);

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

// const app = new Vue({
//     el: '#app',
// });




const router = new VueRouter({
    routes: [{
        path: '/',
        name: 'home',
        component: Home
    },{
        path: '/about',
        name: 'about',
        component: About,
        meta: {
            auth: false
        }
    },{
        path: '/case-studies',
        name: 'case-studies',
        component: CaseStudies,
        meta: {
            auth: false
        }
    },{
        path: '/blog',
        name: 'blog',
        component: Blog,
        meta: {
            auth: false
        }
    },{
        path: '/contact',
        name: 'contact',
        component: Contact,
        meta: {
            auth: false
        }
    }

    ]
});


const app = new Vue(Vue.util.extend({ router })).$mount('#app');
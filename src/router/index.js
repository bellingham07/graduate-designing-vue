import {createRouter, createWebHistory} from 'vue-router'
import LoginPage from "@/components/Login/LoginPage.vue";
import RegisterPage from "@/components/Login/RegisterPage.vue";
import IndexView from "@/components/app/IndexView.vue";
import UserView from "@/components/app/user/UserView.vue";
import GreenhouseView from "@/components/app/greenhouse/GreenhouseView.vue";
import WaterView from "@/components/app/water/WaterView.vue";
import PlantView from "@/components/app/plant/PlantView.vue";
import ManageGreenhouse from "@/components/app/manage_greenhouse/ManageGreenhouse.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'login',
            component: LoginPage
        },
        {
            path: '/reg',
            name: 'register',
            component: RegisterPage
        },
        {
            path: '/index',
            name: 'index',
            component: IndexView,
            children:[
                {
                    path:"green",
                    name:"green",
                    component:GreenhouseView
                },
                {
                    path:"water",
                    name:"water",
                    component:WaterView
                },
                {
                    path:"plant",
                    name:"plant",
                    component:PlantView
                },
                {
                    path:"manage",
                    name:"manage",
                    component:ManageGreenhouse
                },
                {
                    path: 'user',
                    name: 'user',
                    component: UserView
                },
            ]
        },


    ]
})

export default router
import Compra from '../components/Compra.vue'
import Venta from '../components/Venta.vue'
import Producto from '../components/Producto.vue'
import { createRouter, createWebHashHistory } from 'vue-router'

const routes=[
    {path:'/compra',component:Compra},
    {path:'/venta',component:Venta},
    {path:'/',component:Producto},
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})
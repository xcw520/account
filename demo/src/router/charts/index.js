import Charts from '../../views/charts/Charts.vue'
import Expensecharts from '../../views/charts/Expensecharts.vue'
import Incomecharts from '../../views/charts/Incomecharts.vue'
export default {
    path:'/charts',
    component: Charts,
    children:[
        {
            path:'expensecharts',
            component: Expensecharts,
        },
        {
            path:'incomecharts',
            component: Incomecharts,
        }
    ],
    redirect:'/charts/expensecharts'
}
import AddMoney from '../../views/money/AddMoney.vue'
import Expense from '../../views/money/Expense.vue'
import Income from '../../views/money/Income.vue'
export default {
    path:'/addmoney',
    component: AddMoney,
    children:[
        {
            path:'expense',
            component:Expense
        },
        {
            path:'income',
            component:Income
        }
    ],
    redirect:'/addmoney/expense'
}
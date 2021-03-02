import Me from '../../views/me/Me.vue'
import Login from '../../views/me/Login.vue'
import Logup from '../../views/me/Logup.vue'
import ChangePass from '../../views/me/ChangePass.vue'
import ChangeInfo from '../../views/me/ChangeInfo.vue'
import MeChoice from '../../views/me/MeChoice.vue'
import MeChoice2 from '../../views/me/MeChoice2.vue'
export default {
    path: '/me',
    component: Me,
    children: [
        {
            path: 'changeinfo',
            component: ChangeInfo
        },
        {
            path: 'changepass',
            component: ChangePass
        },
        {
            path: 'login',
            component: Login
        },
        {
            path: 'logup',
            component: Logup
        },
        {
            path: 'mechoice',
            component: MeChoice
        },
        {
            path: 'mechoice2',
            component: MeChoice2
        }
    ]
}
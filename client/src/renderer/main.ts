import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import './style/animate.css'
import './assets/iconfont/iconfont.css'
import './style/custom.less'

import { router } from './router';
import { createPinia } from 'pinia'

createApp(App)
.use(router)
.use(createPinia())
.mount('#app')

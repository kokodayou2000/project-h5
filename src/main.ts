import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router'
import App from './App.vue'

// import './assets/main.css'
import 'vant/lib/index.css'
import { Icon } from 'vant'

const app = createApp(App)

const rootValue = 16
const rootWidth = 390
const deviceWidth = document.documentElement.clientWidth
document.documentElement.style.fontSize = (deviceWidth * rootValue) / rootWidth + 'px'

app.use(createPinia())
app.use(router)
app.use(Icon)
app.mount('#app')

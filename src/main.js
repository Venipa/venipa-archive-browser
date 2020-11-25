import { createApp } from 'vue'
import App from './App.vue'
import './index.scss';
import router from './router'
import axios from 'axios'
import VueAxios from './lib/axios';

createApp(App)
  .use(router)
  .use(VueAxios, axios)
  .mount('#app')

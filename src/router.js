import { createWebHistory, createRouter } from "vue-router";
import Home from "./components/HomePage.vue";
const history = createWebHistory(process.env.NODE_ENV === 'production' ? '/venipa-archive-browser/' : '/');
const routes = [
  { path: "/", component: Home }
];
const router = createRouter({ history, routes });
export default router;
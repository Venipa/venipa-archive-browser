export default {
  install(app, axios) {
    if (!axios) {
      console.error("You have to install axios");
      return;
    }
    app.config.globalProperties.axios = axios;
    app.config.globalProperties.$http = axios;
  }
}

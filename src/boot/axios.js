import { boot } from "quasar/wrappers";
import axios from "axios";

const hosts = {
  local: "https://localhost:7043/api",
};

export const selectedHost = hosts.local;

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: selectedHost });

export default boot(({ app, router }) => {
  api.interceptors.response.use(
    (res) => {
      return res;
    },
    (error) => {
      if (error.response.status === 401) {
        router.push("/");
        console.log(error);
      }

      return {
        success: false,
        message: error.message,
        status: error.response.status,
      };
    }
  );
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api };

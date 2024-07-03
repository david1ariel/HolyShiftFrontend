import { defineStore } from "pinia";
import { api } from "app/src/boot/axios";
import { Notify } from 'quasar'

// or with a config object:

export const useAuthStore = defineStore("authStore", {
  state: () => {
    return {
      token: "",
      loggedUser: null,
    };
  },

  actions: {
    async login(credentials) {
      const res = await api.post("auth/authenticate", credentials);
      if (res.status >= 400) {
        console.log(res.data);
        Notify.create({
          message: res.data,
          color: 'danger'
        })
      } else {
        const token = res.data.token;
        this.loggedUser = res.data.user;
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        sessionStorage.setItem("user", this.loggedUser);
        this.$router.push('/employees')

      }
    },
  },

  getters: {
    isLoggedIn: (state) => !!state.loggedUser,
  },
});

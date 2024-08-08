import { defineStore } from "pinia";
import { api } from "app/src/boot/axios";
import { Notify } from "quasar";

// or with a config object:

export const useSettingsStore = defineStore("settingsStore", {
  state: () => ({
    settings: null,
  }),

  actions: {
    async getSettings() {
      const res = await api.get("settings");
      if (res.status >= 400) {
        console.log(res.data);
        Notify.create({
          message: "Some error accured",
          color: "danger",
        });
      } else {
        console.log(res.data);
        this.settings = res.data;
        console.log(this.settings);
      }
    },
    async updateSettings(payload) {
      const res = await api.put("settings", payload);
      if (res.status >= 400) {
        console.log(res.data);
        Notify.create({
          message: "Some error accured",
          color: "danger",
        });
        return;
      }
      console.log(res.data);
      this.settings = res.data;
      console.log(this.settings);
    },
  },

  getters: {
    getSettingsValue: (state) => state.settings
  },
});

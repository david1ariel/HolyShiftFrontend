import { defineStore } from "pinia";
import { api } from "app/src/boot/axios";
import { Notify } from "quasar";

// or with a config object:

export const useShiftsStore = defineStore("shiftsStore", {
  state: () => {
    return {
      shifts: null,
      scheduledShifts: null,
      wantedShifts: null,
    };
  },

  actions: {
    async getShiftsOfCurrentWeek() {
      const res = await api.get("shifts/get-shifts-for-current-week");
      if (res.status >= 400) {
        console.log(res.data);
        Notify.create({
          message: "Some error accured",
          color: "danger",
        });
        return;
      }
      this.shifts = res.data;
    },

    async createShiftsForCurrentWeek() {
      const res = await api.post("shifts/create-shifts-for-current-week");
      if (res.status >= 400) {
        console.log(res.data);
        Notify.create({
          message: "Some error accured",
          color: "danger",
        });
        return;
      }
    },

    async sendSchedule(schedule) {
      const res = await api.post("shifts/set-schedule", schedule);
      if (res.status >= 400) {
        console.log(res.data);
        Notify.create({
          message: "Some error accured",
          color: "danger",
        });
        return;
      }
    },

    async getSchedule() {
      const res = await api.get("shifts/get-schedule");
      if (res.status >= 400) {
        console.log(res.data);
        Notify.create({
          message: "Some error accured",
          color: "danger",
        });
        return;
      }
      this.scheduledShifts = res.data;
    },
    async getWanted() {
      const res = await api.get("shifts/get-wanted");
      if (res.status >= 400) {
        console.log(res.data);
        Notify.create({
          message: "Some error accured",
          color: "danger",
        });
        return;
      }
      this.wantedShifts = res.data;
    },
  },

  getters: {
    isLoggedIn: (state) => !!state.loggedUser,
    getShifts: (state) => state.shifts,
    getScheduledShifts: state => state.scheduledShifts,
    getWantedShifts: state => state.wantedShifts,
  },
});

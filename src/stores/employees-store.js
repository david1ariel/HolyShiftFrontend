import { defineStore } from "pinia";
import { api } from "app/src/boot/axios";

export const useEmployeesStore = defineStore("employeesStore", {
  state: () => ({
    employees: null,
    currentEmployee: null,
    currentEmployeePreferences: null,
  }),

  actions: {
    async getAllEmployees() {
      const res = await api.get("employees");
      if (res.status >= 400) {
        console.log(res.data);
        Notify.create({
          message: "Some error accured",
          color: "danger",
        });
        return;
      }
      console.log(res.data);
      this.employees = res.data;
      console.log(this.employees);
    },

    async getEmployee(employeeId) {
      const res = await api.get(`employees/${employeeId}`);
      if (res.status >= 400) {
        console.log(res.data);
        Notify.create({
          message: "Some error accured",
          color: "danger",
        });
        return;
      }
      this.currentEmployee = res.data;
    },

    async addEmployee(payload) {
      const res = await api.post("employees", payload);
      if (res.status >= 400) {
        console.log(res.data);
        Notify.create({
          message: "Some error accured",
          color: "danger",
        });
        return;
      }
      this.employees.push(res.data);
      Notify.create({
        message: "Employee has been added successfully",
        color: "secondary",
      });
    },

    async updateEmployee(payload) {
      alert(payload.employeeId);
      const res = await api.put(`employees/${payload.employeeId}`, payload);
      if (res.status >= 400) {
        console.log(res.data);
        Notify.create({
          message: "Some error accured",
          color: "danger",
        });
        return;
      }
      const emp = this.employees.find(
        (el) => el.employeeId == payload.employeeId
      );
      const index = this.employees.indexOf(emp);
      this.employees[index] = payload;
      Notify.create({
        message: "Employee has been updated successfully",
        color: "secondary",
      });
    },

    async deleteEmployee(employeeId) {
      const res = await api.delete(`employees/${employeeId}`);
      if (res.status >= 400) {
        console.log(res.data);
        Notify.create({
          message: "Some error accured",
          color: "danger",
        });
        return;
      }
      const emp = this.employees.find(
        (el) => el.employeeId == payload.employeeId
      );
      const index = this.employees.indexOf(emp);
      this.employees.splice(index, 1);
      Notify.create({
        message: "Employee has been deleted successfully",
        color: "secondary",
      });
    },

    sendPreferences(employeeId, shifts) {
      console.log(shifts)
      api.post(`employees/${employeeId}/add-or-update-preferences`, shifts);
    },
    async getSingleEmployeePreferences(employeeId) {
      const res = await api.get(`employees/${employeeId}/get-single-employee-preferences`);
      if (res.status >= 400) {
        console.log(res.data);
        Notify.create({
          message: "Some error accured",
          color: "danger",
        });
        return;
      }
      this.currentEmployeePreferences = res.data;
      console.log(res);
    },
  },

  getters: {
    getEmployeesData: (state) => state.employees,
    getCurrentEmployeePreferences: (state) => state.currentEmployeePreferences,
    // currentEmployee: (state) => state.currentEmployee
  },
});

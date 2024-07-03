import { defineStore } from "pinia";
import { api } from "app/src/boot/axios";

export const useEmployeesStore = defineStore("employeesStore", {
  state: () => {
    return {
      employees: [],
      currentEmployee: null
    };
  },

  actions: {
    async getAllEmployees(){
      const res = await api.get('employees')
      if (res.status >= 400){
        console.log(res.data)
        Notify.create({
          message: 'Some error accured',
          color: 'danger'
        })
      }
      else{
        console.log(res.data)
        this.employees = {...res.data}
        console.log(this.employees)
      }
    },

    async getEmployee(employeeId){
      const res = await api.get(`employees/${employeeId}`)
      if (res.status >= 400){
        console.log(res.data)
        Notify.create({
          message: 'Some error accured',
          color: 'danger'
        })
      }
      else{
        this.currentEmployee = res.data
      }
    },

    async addEmployee(payload){
      const res = await api.post('employees', payload)
      if (res.status >= 400){
        console.log(res.data)
        Notify.create({
          message: 'Some error accured',
          color: 'danger'
        })
      }
      else{
        this.employees.push(res.data)
        Notify.create({
            message: 'Employee has been added successfully',
            color: 'secondary'
          })
      }
    },

    async updateEmployee(payload){
      const res = await api.put('employees/employeeId', payload)
      if (res.status >= 400){
        console.log(res.data)
        Notify.create({
          message: 'Some error accured',
          color: 'danger'
        })
      }
      else{
        const emp = this.employees.find(el => el.employeeId == payload.employeeId)
        const index = this.employees.indexOf(emp)
        this.employees[index] = payload
        Notify.create({
          message: 'Employee has been updated successfully',
          color: 'secondary'
        })
      }
    },

    async deleteEmployee(employeeId){
      const res = await api.delete(`employees/${employeeId}`)
      if (res.status >= 400){
        console.log(res.data)
        Notify.create({
          message: 'Some error accured',
          color: 'danger'
        })
      }
      else{
        const emp = this.employees.find(el => el.employeeId == payload.employeeId)
        const index = this.employees.indexOf(emp)
        this.employees.splice(index, 1)
        Notify.create({
          message: 'Employee has been deleted successfully',
          color: 'secondary'
        })
      }
    },


  },

  getters: {
    employees: (state) => state.employees,
    currentEmployee: (state) => state.currentEmployee
  },
});

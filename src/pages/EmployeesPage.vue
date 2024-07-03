<template>
  <q-page class="login-wrapper">
    <q-table
      flat
      bordered
      title="Employees"
      :rows="rows"
      :columns="columns"
      row-key="employeeId"
      binary-state-sort
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="name" :props="props">
            {{ props.row.name }}
            <q-popup-edit v-model="props.row.name" v-slot="scope">
              <q-input
                v-model="scope.value"
                dense
                autofocus
                counter
                @keyup.enter="scope.set"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="email" :props="props">
            {{ props.row.email }}
            <q-popup-edit v-model="props.row.email" v-slot="scope">
              <q-input
                v-model="scope.value"
                dense
                autofocus
                counter
                @keyup.enter="scope.set"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="role" :props="props">
            {{ props.row.role }}
            <q-popup-edit v-model="props.row.role" v-slot="scope">
              <q-input
                v-model="scope.value"
                dense
                autofocus
                counter
                @keyup.enter="scope.set"
              />
            </q-popup-edit>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useEmployeesStore } from "app/src/stores/employees-store";

const employeesStore = useEmployeesStore();

const columns = ref([
  {
    name: "name",
    required: true,
    label: "Name",
    align: "left",
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "email",
    required: true,
    label: "Email",
    align: "left",
    field: (row) => row.email,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "role",
    required: true,
    label: "Role",
    align: "left",
    field: (row) => row.role,
    format: (val) => `${val}`,
    sortable: true,
  },
]);
const rows = ref([]);

onMounted(async() => {
  await employeesStore.getAllEmployees()
  rows.value = employeesStore.employees
  console.log(rows.value)
})
// const loginClicked = async() => {
//   await authStore.login(credentials.value)
// }
</script>

<style scoped></style>

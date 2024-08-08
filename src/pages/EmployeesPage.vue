<template>
  <div class="login-wrapper">
    <q-table
      grid
      flat
      bordered
      card-class="bg-secondary text-white"
      title="Employees"
      :rows="rows"
      :columns="columns"
      row-key="employeeId"
      hide-header
      hide-footer
      :rows-per-page-options="[0]"
      >
      <template v-slot:top>
        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%">
          <div style="font-size: x-large">Employees</div>
          <div>
            <q-btn
              color="secondary"
              dense
              round
              icon="add"
              title="Add Employee"
              @click="addClicked"
            />
          </div>
        </div>
      </template>
      <template v-slot:item="props">
        <div
          class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
          :style="props.selected ? 'transform: scale(0.95);' : ''"
        >
          <q-card
            bordered
            flat
            :class="
              props.selected
                ? $q.dark.isActive
                  ? 'bg-grey-9'
                  : 'bg-grey-2'
                : ''
            "
          >
            <q-card-section>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div class="q-mr-lg"><q-avatar><q-img :src="`${selectedHost}/images/${props.row.employeeId}`"/></q-avatar> </div>
                  <div class="text-h6">{{ props.row.name }}</div>
                  </div>
                <div>
                  <q-btn
                    icon="edit"
                    round
                    dense
                    color="secondary"
                    @click="editClicked(props.row.employeeId)"
                  />
                </div>
              </div>
            </q-card-section>
            <q-separator />
            <q-list dense>
              <q-item
                v-for="col in props.cols.filter((col) => col.label !== 'Name')"
                :key="col.name"
              >
                <q-item-section>
                  <q-item-label>{{ col.label }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label caption>{{ col.value }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </template>
    </q-table>
    <q-dialog v-model="detailsDialog">
      <q-card class="my-card">
        <q-img
          v-if="selectedEmployee.avatar"
          src="https://cdn.quasar.dev/img/chicken-salad.jpg"
        />

        <q-card-section>
          <q-input v-model="selectedEmployee.name" label="Name" />
          <q-input v-model="selectedEmployee.email" label="Email" />
          <q-input v-model="selectedEmployee.role" label="Role" />
          <q-input v-if="dialogType === 'new'" v-model="selectedEmployee.username" label="Username" />
          <q-input v-if="dialogType === 'new'" v-model="selectedEmployee.password" label="Password" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            v-close-popup
            flat
            color="secondary"
            label="Save"
            @click="saveEmployeeClicked"
          />
          <q-btn
            flat
            color="danger"
            title="Delete Employee"
            icon="delete"
            @click="deleteEmployeeClicked"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog
      v-model="confirmDeleteDialog"
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card class="bg-danger text-white" style="width: 300px">
        <q-card-section>
          <div class="text-h6">Delete Employee</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Are you sure you want to delete this employee permanently?
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-danger">
          <q-btn
            color="danger"
            label="I am sure"
            rounded
            v-close-popup
            @click="confirmDelete"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useEmployeesStore } from "app/src/stores/employees-store";
import { selectedHost } from "app/src/boot/axios";

const employeesStore = useEmployeesStore();
const selectedEmployee = ref({});
const detailsDialog = ref(false);
const dialogType = ref("");
const confirmDeleteDialog = ref(false);
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

onMounted(async () => {
  await employeesStore.getAllEmployees();
  rows.value = employeesStore.employees;
  console.log(rows.value);
});
const editClicked = async (employeeId) => {
  console.log(employeeId);
  selectedEmployee.value = employeesStore.employees.find(
    (el) => el.employeeId === employeeId
  );
  console.log(selectedEmployee.value);
  detailsDialog.value = true;
  dialogType.value = "edit";
};
const saveEmployeeClicked = async () => {
  if (dialogType.value === 'edit'){
    await employeesStore.updateEmployee(selectedEmployee.value);
  }
  else {
    await employeesStore.addEmployee(selectedEmployee.value)
  }
};
const addClicked = async () => {
  selectedEmployee.value = {};
  detailsDialog.value = true;
  dialogType.value = "new";
};

const deleteEmployeeClicked = async () => {
  confirmDeleteDialog.value = true;
};
const confirmDelete = async () => {
  await employeesStore.deleteEmployee(selectedEmployee.value.employeeId);
};
</script>

<style scoped></style>

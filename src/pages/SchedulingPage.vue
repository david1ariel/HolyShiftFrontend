<template>
  <div class="scheduling-wrapper">
    <div v-if="shifts.length == 0">
      <q-btn
        label="Create shifts for the current week"
        color="secondary"
        @click="createShiftsClicked"
      />
    </div>
    <div>
      <div
        v-if="employees.length && shiftsEmployees?.length"
        class="q-pa-md q-gutter-sm"
        style="height: 160px; position: relative"
        @drop="removeEmployeeFromShift($event)"
        @dragover="allowDrop($event)"
      >
        <q-avatar
          v-for="(item, i) in employees"
          :key="i"
          size="80px"
          class="overlapping"
          :style="`left: ${i * 50}px`"
          draggable="true"
          @dragstart="drag($event, item)"
        >
          <span class="counter">{{ computedCounter(i) }}</span>
          <img :src="`${selectedHost}/images/${item.employeeId}`" />
        </q-avatar>
      </div>
    </div>
    <table v-if="settings.shiftNames && shifts.length > 0" class="shifts-table">
      <body v-if="shiftsEmployees">
        <tr>
          <td></td>
          <td v-for="item in days" :key="item">
            {{ item }}
          </td>
        </tr>
        <tr v-for="(item, i) in settings.shiftNames" :key="item">
          <td>{{ item }}</td>
          <td
            :id="item2.shiftId"
            v-for="(item2, j) in shifts.filter((el) => el.shiftNth === i)"
            :key="item2"
            @drop="drop($event)"
            @dragover="allowDrop($event)"
          >
            <div
            class="emp-img-wrapper"
              style="position: relative"
              v-for="emp in shiftsEmployees.filter((el) => el.shiftNth == i)[j]
                .employees"
              :key="emp"
              draggable="true"
              @dragstart="drag($event, emp)"
            >
              <div class="img-bg"></div>
              <span
                class="counter"
                v-if="emp.status != undefined"
                >{{ convertStatusToEmoji(emp.status) }}</span
              >

              <img
                class="table-img"
                :src="`${selectedHost}/images/${emp.employeeId}`"
              />
            </div>
          </td>
        </tr>
      </body>
    </table>
    <div>
      <q-btn label="Submit Schedule" color="secondary" @click="sendSchedule" />
    </div>
    <div class="status-menu" v-if="isShowStatusMenu">
      <q-card>
        <q-select behavior="dialog" filled :options="statusOptions" :v-model="currentEmployee.status" :model-value="currentEmployee.status">
        </q-select>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useShiftsStore } from "app/src/stores/shifts-store";
import { useSettingsStore } from "app/src/stores/settings-store";
import { useEmployeesStore } from "app/src/stores/employees-store";
import { selectedHost } from "app/src/boot/axios";
import { computed } from "vue";

const shiftsStore = useShiftsStore();
const settingsStore = useSettingsStore();
const employeesStore = useEmployeesStore();
const shifts = ref([]);
const settings = ref({});
const employees = ref([]);
const shiftsEmployees = ref([]);
const days = ref([
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]);
const statusOptions = ref(["Requested 🙏", "Suggested", "Approved ✔️", "Passed"]);
const isShowStatusMenu = ref(false);
const currentEmployee = ref({});

const createShiftsClicked = async () => {
  await shiftsStore.createShiftsForCurrentWeek();
  await shiftsStore.getShiftsOfCurrentWeek();
  shifts.value = shiftsStore.getShifts;
};

const drag = (event, item) => {
  const data =
    item.employeeId.toString() +
    ";" +
    item.name +
    (event.target.parentElement.parentElement.id ? ";" + event.target.parentElement.parentElement.id : "");
  event.dataTransfer.setData("employee", data);
};
const allowDrop = (ev) => {
  ev.preventDefault();
  const tds = document.getElementsByClassName("emp-img-wrapper");
  for (let i = 0; i < tds.length; i++) {
    tds[i].style.pointerEvents = "none";
  }
};
const drop = (ev) => {
  ev.preventDefault();
  const tds = document.getElementsByClassName("emp-img-wrapper");
  for (let i = 0; i < tds.length; i++) {
    tds[i].style.pointerEvents = "auto";
  }
  const employee = ev.dataTransfer.getData("employee");
  const employeeParts = employee.split(";");
  const employeeId = +employeeParts[0];
  const employeeName = employeeParts[1];
  if (employeeParts.length > 2) {
    const shiftToDeleteFrom = +employeeParts[2];
    if (shiftToDeleteFrom) {
      const stdf = shiftsEmployees.value.find(
        (el) => el.shiftId === shiftToDeleteFrom
      );

      if (stdf) {
        const emp = stdf.employees.find((el) => el.employeeId == employeeId);
        const index = stdf.employees.indexOf(emp);
        stdf.employees.splice(index, 1);
      }
    }
  }
  let se = shiftsEmployees.value.find((el) => el.shiftId === +ev.target.id);
  if (se?.employees?.some((el) => el.employeeId === employeeId)) return;
  if (!se) {
    se = { shiftId: +ev.target.id, employees: [] };
    shiftsEmployees.value.push(se);
  }
  se.employees.push({ employeeId, name: employeeName });
  // shiftsEmployees.value = JSON.parse(JSON.stringify(shiftsEmployees.value)) ;
};

const removeEmployeeFromShift = (ev) => {
  ev.preventDefault();
  ev.preventDefault();
  const tds = document.getElementsByClassName("emp-img-wrapper");
  for (let i = 0; i < tds.length; i++) {
    tds[i].style.pointerEvents = "auto";
  }
  const employee = ev.dataTransfer.getData("employee");
  const employeeParts = employee.split(";");
  const employeeId = +employeeParts[0];
  console.log(employeeParts);
  if (employeeParts.length > 2) {
    console.log(+employeeParts[2]);
    const shiftToDeleteFrom = +employeeParts[2];
    if (shiftToDeleteFrom) {
      const stdf = shiftsEmployees.value.find(
        (el) => el.shiftId === shiftToDeleteFrom
      );

      if (stdf) {
        console.log(stdf);
        const emp = stdf.employees.find((el) => el.employeeId == employeeId);
        const index = stdf.employees.indexOf(emp);
        stdf.employees.splice(index, 1);
      }
    }
  }
};

const computedCounters = computed(() => {
  return employees.value.map((employee) => {
    return shiftsEmployees.value.filter((shift) =>
      shift.employees.some((el) => el.employeeId === employee.employeeId)
    ).length;
  });
});

const computedCounter = (index) => {
  return computedCounters.value[index];
};

const sendSchedule = async () => {
  const shifts = shiftsEmployees.value.map((el) => {
    return {
      shiftId: el.shiftId,
      employeeIds: el.employees.map((emp) => emp.employeeId),
    };
  });
  await shiftsStore.sendSchedule(shifts);
};

const convertStatusToEmoji = (status) => {
  switch (status) {
    case 0:
      return "🙏";
    case 1:
      return "suggested";
    case 2:
      return "✔️";
    case 3:
      return "passed";
  }
};

const statusClicked = (shiftId, employeeId, status) => {
  const employee = shiftsEmployees.value
    .find((el) => el.shiftId === shiftId)
    .employees.find(
      (el) => el.employeeId === employeeId && el.status === status
    );
  console.log(employee);
  currentEmployee.value = employee;
  isShowStatusMenu.value = true;
};

onMounted(async () => {
  await employeesStore.getAllEmployees();
  employees.value = employeesStore.getEmployeesData;
  console.log(employees.value);
  await shiftsStore.getShiftsOfCurrentWeek();
  if (shiftsStore.shifts?.length > 0) {
    shifts.value = shiftsStore.getShifts;
  }
  await shiftsStore.getSchedule();
  await shiftsStore.getWanted();
  console.log(shiftsStore.getScheduledShifts);

  for (let shift of shifts.value) {
    const scheduled = shiftsStore.getScheduledShifts?.find(
      (el) => el.shiftId == shift.shiftId
    );
    const wanted = shiftsStore.getWantedShifts?.find(
      (el) => el.shiftId == shift.shiftId
    );
    console.log(scheduled);
    let localEmployees = [];
    if (scheduled) {
      localEmployees = employees.value
        .filter((el) => scheduled.employeeIds.includes(el.employeeId))
        .map((el) => {
          return { ...el, status: 2 };
        });
    }
    if (wanted) {
      const wantedEmployees = employees.value
        .filter((el) => wanted.employeeIds.includes(el.employeeId))
        .map((el) => {
          return { ...el, status: 0 };
        });
      console.log(wantedEmployees[0]);
      for (let item of wantedEmployees) {
        console.log(item);
        localEmployees.push(item);
      }
      console.log(localEmployees);
    }
    shiftsEmployees.value.push({
      shiftId: shift.shiftId,
      shiftNth: shift.shiftNth,
      employees: localEmployees,
    });
  }
  await settingsStore.getSettings();
  settings.value = settingsStore.getSettingsValue;
});
</script>

<style scoped>
.scheduling-wrapper {
  padding: 20px;
}

.shifts-table {
  color: #128c8a;
  border-width: 0 3px 3px 0;
  border-color: #19dbd0;
  border-style: solid;
  border-spacing: 0;
  td {
    padding: 10px;
    min-width: 100px;
    border-width: 3px 0 0 3px;
    border-style: solid;
    border-color: #19dbd0;
  }
}

.overlapping {
  border: 2px solid white;
  position: absolute;
  transition-duration: 300ms;
}
.overlapping:hover {
  z-index: 100;
  border-color: #19dbd0;
  width: 90px;
  height: 90px;
  transition-duration: 300ms;
}
.counter {
  position: absolute;
  left: 3px;
  font-size: 12px;
  background: lightgrey;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-weight: 500;
  color: black;
  padding-left: 2px;
}
.table-img {
  border-radius: 50%;
  width: 60px;
  height: 60px;
}
.img-bg {
}
.status-menu {
  position: absolute;
  background-color: white;
  border-radius: 10px;
}
</style>

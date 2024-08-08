<template>
  <div class="scheduling-wrapper">
    <div>
      <table class="shifts-table">
        <body v-if="shifts">
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
              @click="toggleIsWanted(item2.shiftId)"
            >
              <div class="d-center">
                <img
                  v-if="myShifts.filter((el) => el.shiftNth === i)[j].isWanted"
                  style="border-radius: 50%; width: 40px; height: 40px"
                  :src="`${selectedHost}/images/${user.employeeId}`"
                />
              </div>
            </td>
          </tr>
        </body>
      </table>
      <div>
        <q-btn
          label="Submit preferences"
          color="secondary"
          @click="sendPreferences"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useShiftsStore } from "app/src/stores/shifts-store";
import { useSettingsStore } from "app/src/stores/settings-store";
import { useEmployeesStore } from "app/src/stores/employees-store";
import { useAuthStore } from "app/src/stores/auth-store";
import { selectedHost } from "app/src/boot/axios";

const shiftsStore = useShiftsStore();
const settingsStore = useSettingsStore();
const employeesStore = useEmployeesStore();
const authStore = useAuthStore();
const shifts = ref([]);
const settings = ref({});
const submitedPreferences = ref([])
const myShifts = ref([]);
const user = ref({});
const days = ref([
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]);
const rows = ref([]);

const toggleIsWanted = (shiftId) => {
  const shift = myShifts.value.find((el) => el.shiftId === shiftId);
  if (shift) {
    shift.isWanted = !shift.isWanted;
  }
};

const sendPreferences = () => {
  employeesStore.sendPreferences(user.value.employeeId, myShifts.value);
};

onMounted(async () => {
  user.value = authStore.getLoggedUser;
  await shiftsStore.getShiftsOfCurrentWeek(user.value.employeeId);
  if (shiftsStore.shifts?.length > 0) {
    shifts.value = shiftsStore.getShifts;
    await employeesStore.getSingleEmployeePreferences(user.value.employeeId)
    if (employeesStore.currentEmployeePreferences){
      submitedPreferences.value = employeesStore.currentEmployeePreferences
    }
    for (let shift of shifts.value) {
      myShifts.value.push({
        shiftId: shift.shiftId,
        shiftNth: shift.shiftNth,
        isWanted: submitedPreferences.value.includes(shift.shiftId) ? true : false,
      });
    }
    // myShifts.value = shifts.value.forEach((el) => {
    //   return { shiftId: el.shiftId, shiftNth: el.shiftNth, isWanted: false };
    // });
    console.log(shifts);
    console.log(myShifts);
  }
  // const employee = employeesStore.getEmployee
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
}
.overlapping:hover {
  z-index: 100;
  border-color: #19dbd0;
  width: 100px;
  height: 100px;
  transition-duration: 300ms;
}
.avatar {
  margin: auto;
}
/* .overlapping:active{
  width: 30px;
  height: 30px;
  border-radius: 50%;
} */
</style>

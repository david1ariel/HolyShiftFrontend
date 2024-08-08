<template>
  <div>
    <div class="settings-form-wrapper">
      <q-form class="form">
        <q-btn
          round
          dense
          color="secondary"
          icon="add"
          @click="addShiftClicked"
        />
        <div
          style="display: flex; justify-content: space-between"
          v-for="(item, i) in settings.shiftNames"
          :key="i"
        >
          <q-input
            v-model="settings.shiftNames[i]"
            label="shift Name"
            style="width: 100px"
          />
          <div style="display: flex">
            <div class="text-h6 d-center">
              {{ settings.shiftDurations[i].start }}
            </div>
            <div
              style="
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <q-btn
                class="q-ml-lg"
                color="secondary"
                round
                dense
                icon="schedule"
                @click="clockClicked(i, 'start')"
              />
            </div>
          </div>
          <div style="display: flex">
            <div class="text-h6 q-mt-sm">
              {{ settings.shiftDurations[i].end }}
            </div>
            <div
              style="
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <q-btn
                class="q-ml-lg"
                color="secondary"
                round
                dense
                icon="schedule"
                @click="clockClicked(i, 'end')"
              />
            </div>
          </div>
          <q-dialog v-model="clockDialog">
            <q-card class="my-card">
              <q-time
                dense
                format24h
                v-model="settings.shiftDurations[dialogIndex][dialogType]"
                label="Shift Duration"
              />
              <q-card-actions align="right">
                <q-btn
                  v-close-popup
                  flat
                  round
                  outline
                  color="grey"
                  icon="close"
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </div>
        <q-btn
          v-close-popup
          flat
          color="secondary"
          label="Save"
          @click="saveSettingsClicked"
        />
      </q-form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useSettingsStore } from "app/src/stores/settings-store";

const settingsStore = useSettingsStore();

const clockDialog = ref(false);
const dialogIndex = ref(0);
const dialogType = ref("");
const settings = ref({});
const tempShiftNames = ref([]);
const addShiftClicked = () => {
  settings.value.shiftNames.push("");
  settings.value.shiftDurations.push({start: '', end: ''});
};
const clockClicked = (i, type) => {
  dialogIndex.value = i;
  dialogType.value = type;
  clockDialog.value = true;
};
const saveSettingsClicked = async () => {
  console.log(settings.value.shiftDurations[0]);
  for (let i = 0; i < settings.value.shiftDurations.length; i++) {
    if (settings.value.shiftDurations[i].start.length < 6) {
      settings.value.shiftDurations[i].start += ":00";
    }
    if (settings.value.shiftDurations[i].end.length < 6) {
      settings.value.shiftDurations[i].end += ":00";
    }
  }
  await settingsStore.updateSettings(settings.value);
};
onMounted(async () => {
  await settingsStore.getSettings();
  settings.value = settingsStore.getSettingsValue;
  for (let i = 0; i < settings.value.shiftDurations.length; i++) {
    if (settings.value.shiftDurations[i].start.length > 5) {
      settings.value.shiftDurations[i].start = settings.value.shiftDurations[
        i
      ].start.substring(0, 5);
    }
    if (settings.value.shiftDurations[i].end.length > 5) {
      settings.value.shiftDurations[i].end = settings.value.shiftDurations[
        i
      ].end.substring(0, 5);
    }
  }
  console.log(settings.value);
});
</script>

<style scoped>
.settings-form-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 100px;
}

.form {
  /* width: 50%; */
}
</style>

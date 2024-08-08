<template>
  <div class="app">
    <div class="main">
      <div class="menu">
        <div style="display: flex; justify-content: center; align-items: center"><img src="src/assets/holyShiftLogo.jpg" style="width: 90%"/></div>
        <q-list bordered separator>
          <q-item clickable v-ripple>
            <q-item-section @click="router.push('employees')">Employees</q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section @click="router.push('scheduling')">Scheduling</q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section @click="router.push('settings')">Settings</q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section @click="router.push('my-shifts')">My Shifts</q-item-section>
          </q-item>
        </q-list>
      </div>
      <div class="content">
        <div style="height: 100%;">
          <router-view />
        </div>
      </div>
    </div>

    <div class="footer"></div>

    <!-- <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Pages </q-item-label>

        <div v-for="page in pages" :key="page">{{ page }}</div>
      </q-list>
    </q-drawer> -->

    <!-- <q-page-container> -->
      <!-- <router-view /> -->
    <!-- </q-page-container> -->
  </div>
</template>

<script setup>
import {useRouter} from 'vue-router'
const router = useRouter()
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 97vh;
}
.main {
  display: flex;
  height: 100%;
  width: 100%;
}
.menu {
  background-color: #19dbd0;
  height: 100%;
  width: 20%;
  border-radius: 0 0 50px 0;
}
.content {
  height: 100%;
  overflow: auto;
  flex-grow: 1;
}
.footer {
  flex-grow: 1;
  width: 100%;
}
</style>

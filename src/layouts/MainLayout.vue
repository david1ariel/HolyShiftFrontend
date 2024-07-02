<template>
  <q-layout class="app">
    <div class="main">
      <div class="menu"></div>
      <div class="content">

        <q-page-container>
      <router-view />
    </q-page-container>

      </div>
    </div>

    <div class="footer"></div>

    <!-- <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Pages </q-item-label>

        <div v-for="page in pages" :key="page">{{ page }}</div>
      </q-list>
    </q-drawer> -->

    <!-- <q-page-container>
      <router-view />
    </q-page-container> -->
  </q-layout>
</template>

<script setup>

</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
}
.main {
  display: flex;
  height: 97%;
  width: 100%;
}
.menu {
  background-color: #19dbd0;
  height: 100%;
  width: 20%;
  border-radius: 0 0 50px 0;
}
.content {
  flex-grow: 1;
}
.footer {
  flex-grow: 1;
  width: 100%;
}
</style>

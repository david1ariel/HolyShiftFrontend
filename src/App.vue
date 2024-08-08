<template>
  <router-view />
</template>

<script setup>
import { defineComponent, onMounted } from "vue";
import { api } from "app/src/boot/axios";
import {useRouter} from 'vue-router'
import { useAuthStore } from "./stores/auth-store";
const router = useRouter()
const authStore = useAuthStore()


onMounted(() => {
  const token = sessionStorage.getItem("t");
  if (token) {
    try {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } catch (e) {
      console.log(e);
    }
    const user = JSON.parse(sessionStorage.getItem('user'))
    if (user) {
authStore.loggedUser = user
    }
  }

  else{
    router.push('/')
  }
});
</script>

<style>
  .d-center {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>

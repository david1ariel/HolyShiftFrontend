<template>
  <router-view />
</template>

<script>
import { defineComponent, onMounted } from "vue";

export default defineComponent({
  name: "App",
});

onMounted(() => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  if (user) {
    try {
      if (user.token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
      }
    } catch (e) {
      console.log(e);
    }
  }
});
</script>

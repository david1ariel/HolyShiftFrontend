<template>
  <q-page class="login-wrapper">
    <div class="login-content">
      <div class="title">Credentials, please.</div>
      <div class="inputs">
        <div class="input-wrapper">Username: <input class="text-input" /></div>
        <div class="input-wrapper">Password: <input class="text-input" /></div>
      </div>
      <button class="login-btn" @click="loginClicked">Login</button>
    </div>
  </q-page>
</template>

<script setup>
const loginClicked = () => {
  alert('login clicked')
}
</script>



<style scoped>
.login-wrapper {
  display: flex;
  /* height: 100%; */
  justify-content: space-around;
  align-items: center;
}
.login-content {
  min-width: 600px;
}
.title {
  font-size: xxx-large;
  text-align: center;
}
.text-input {
  border: 0;
  color: #128c8a;
}
input:focus {
  outline: none;
}
.inputs {
  display: flex;
  justify-content: space-between;
  margin-top: 50px;
}
.input-wrapper {
  width: 45%;
  padding-left: 16px;
  border-width: 0 0 3px 3px;
  border-style: solid;
  border-color: #19dbd0;
}

.login-btn {
  width: 100%;
  background-color: #19dbd0;
  border-radius: 10px;
  border: 0;
  margin-top: 16px;
  color: white;
  font-size: x-large;
  padding: 10px
}
</style>

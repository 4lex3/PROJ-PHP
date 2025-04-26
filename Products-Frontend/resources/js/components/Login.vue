<template>
  <div class="login-container">
    <div class="login-box">
      <h2 class="login-title">Login</h2>
      <div v-if="error" class="login-error">{{ error }}</div>
      <form @submit.prevent="handleLogin" class="login-form">
        <div>
          <label for="email">Email</label>
          <input type="email" v-model="email" required />
        </div>
        <div>
          <label for="password">Password</label>
          <input type="password" v-model="password" required />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f7f7f7;
}
.login-box {
  width: 350px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 2rem;
}
.login-title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 1.5rem;
}
.login-error {
  color: #d32f2f;
  text-align: center;
  margin-bottom: 1rem;
}
.login-form > div {
  margin-bottom: 1rem;
}
.login-form label {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 500;
}
.login-form input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}
.login-form button {
  width: 100%;
  padding: 0.75rem;
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}
.login-form button:hover {
  background: #1565c0;
}
</style>


<script setup>
import { ref } from 'vue';
import axios from 'axios';

const email = ref('');
const password = ref('');
const error = ref('');

const handleLogin = async () => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/login', {
      email: email.value,
      password: password.value
    });
    localStorage.setItem('token', response.data.access_token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
    window.location.href = '/products';
  } catch (err) {
    error.value = 'Credenciales incorrectas';
  }
};
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <h2 class="login-title">Login</h2>
      <form @submit.prevent="handleSubmit" class="login-form">
        <div>
          <label for="email">Email</label>
          <input v-model="email" id="email" type="email" required />
        </div>
        <div>
          <label for="password">Password</label>
          <input v-model="password" id="password" type="password" required />
        </div>
        <button type="submit">Sign In</button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
  name: 'Login',
  setup() {
    const router = useRouter();
    const email = ref('');
    const password = ref('');

    const handleSubmit = async () => {
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/login', {
          email: email.value,
          password: password.value
        });
        
        localStorage.setItem('token', response.data.access_token);
        router.push('/products');
        window.location.reload();
      } catch (error) {
        console.error('Login failed:', error);
        alert('Login failed. Please check your credentials.');
      }
    };

    return {
      email,
      password,
      handleSubmit
    };
  }
}
</script>

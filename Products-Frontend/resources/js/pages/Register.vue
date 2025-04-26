<template>
  <div class="register-container">
    <div class="register-box">
      <h2 class="register-title">Register</h2>
      <form @submit.prevent="handleRegister" class="register-form">
        <div>
          <label for="name">Name</label>
          <input v-model="name" id="name" type="text" required />
        </div>
        <div>
          <label for="email">Email</label>
          <input v-model="email" id="email" type="email" required />
        </div>
        <div>
          <label for="password">Password</label>
          <input v-model="password" id="password" type="password" required />
        </div>
        <div>
          <label for="password_confirmation">Confirm Password</label>
          <input v-model="password_confirmation" id="password_confirmation" type="password" required />
        </div>
        <button type="submit">Register</button>
        <button type="button" @click="goToLogin" class="back-to-login">Back to Login</button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
  name: 'Register',
  setup() {
    const router = useRouter();
    const name = ref('');
    const email = ref('');
    const password = ref('');
    const password_confirmation = ref('');

    const handleRegister = async () => {
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/register', {
          name: name.value,
          email: email.value,
          password: password.value,
          password_confirmation: password_confirmation.value
        });
        alert('Registration successful! Please log in.');
        router.push('/login');
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          alert('Registration failed: ' + error.response.data.message);
        } else {
          alert('Registration failed. Please try again.');
        }
        console.error('Register error:', error);
      }
    };

    const goToLogin = () => {
      router.push('/login');
    };

    return {
      name,
      email,
      password,
      password_confirmation,
      handleRegister,
      goToLogin
    };
  }
}
</script>

<style>
.register-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f6fa;
}
.register-box {
  background: #fff;
  padding: 2rem 2.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.07);
  width: 340px;
}
.register-title {
  margin-bottom: 1.5rem;
  font-size: 2rem;
  text-align: center;
}
.register-form label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}
.register-form input {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}
.register-form button {
  width: 100%;
  padding: 0.6rem;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 0.5rem;
}
.register-form .back-to-login {
  background: #6c757d;
}
</style>

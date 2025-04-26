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

<style scoped>
body {
  background: linear-gradient(120deg, #232946 0%, #b8c1ec 100%);
  min-height: 100vh;
  font-family: 'SF Pro Display', 'Segoe UI', 'Roboto', Arial, sans-serif;
  color: #f4f4f4;
  margin: 0;
  padding: 0;
}
.register-container {
  min-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  animation: fadein 1.2s;
}
@keyframes fadein {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: none; }
}
.register-box {
  background: rgba(35, 41, 70, 0.97);
  box-shadow: 0 8px 36px 0 #23294644, 0 1.5px 7px 0 #eebbc366;
  border-radius: 32px;
  border: 2px solid #eebbc3;
  padding: 3.2rem 2.2rem 2.2rem 2.2rem;
  min-width: 320px;
  max-width: 400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadein 0.8s;
  backdrop-filter: blur(12px) saturate(120%);
}
.register-title {
  font-family: 'SF Pro Display', 'Segoe UI', 'Roboto', Arial, sans-serif;
  color: #eebbc3;
  font-size: 2.1rem;
  margin-bottom: 1.5rem;
  letter-spacing: 1.2px;
  text-shadow: 0 2px 12px #e0c3fc44;
  font-weight: 700;
}
.register-form {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1.1rem;
}
.register-form label {
  font-weight: 600;
  color: #b8c1ec;
  margin-bottom: 0.2rem;
  letter-spacing: 0.3px;
}
.register-form input {
  background: #232946;
  border: 1.5px solid #b8c1ec;
  border-radius: 16px;
  color: #f4f4f4;
  font-size: 1.08rem;
  padding: 0.6rem 1rem;
  margin-bottom: 1.1rem;
  outline: none;
  transition: border 0.18s, background 0.18s, box-shadow 0.18s;
  box-shadow: 0 1px 8px #b8c1ec55;
}
.register-form input:focus {
  border: 1.5px solid #eebbc3;
  background: #232946;
  box-shadow: 0 0 0 2px #eebbc366;
}
.register-form button[type="submit"] {
  background: linear-gradient(90deg, #eebbc3 0%, #b8c1ec 100%);
  color: #232946;
  border: none;
  border-radius: 18px;
  padding: 0.65rem 2.1rem;
  font-size: 1.08rem;
  font-family: 'SF Pro Display', 'Segoe UI', 'Roboto', Arial, sans-serif;
  font-weight: 700;
  cursor: pointer;
  margin-top: 0.6rem;
  margin-bottom: 1.3rem;
  box-shadow: 0 2px 14px #eebbc366;
  transition: background 0.17s, color 0.17s, transform 0.13s;
}
.register-form button[type="submit"]:hover {
  background: linear-gradient(90deg, #b8c1ec 0%, #eebbc3 100%);
  color: #232946;
  transform: scale(1.06);
  box-shadow: 0 4px 24px #eebbc388;
}
.back-to-login {
  background: linear-gradient(90deg, #b8c1ec 0%, #eebbc3 100%);
  color: #232946;
  border: none;
  border-radius: 14px;
  padding: 0.48rem 1.2rem;
  font-size: 1.01rem;
  font-family: 'SF Pro Display', 'Segoe UI', 'Roboto', Arial, sans-serif;
  font-weight: 600;
  margin-top: 0.2rem;
  cursor: pointer;
  transition: background 0.17s, color 0.17s, transform 0.13s;
  box-shadow: 0 1px 6px #eebbc355;
  display: inline-block;
}
.back-to-login:hover {
  background: linear-gradient(90deg, #eebbc3 0%, #b8c1ec 100%);
  color: #232946;
  transform: scale(1.06);
  box-shadow: 0 4px 18px #eebbc388;
}
@media (max-width: 700px) {
  .register-box {
    min-width: 95vw;
    max-width: 98vw;
    padding: 2rem 0.5rem;
  }
}
</style>

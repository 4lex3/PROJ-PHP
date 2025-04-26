<template>
  <div class="main-app-container">
    <nav class="navbar">
      <div class="navbar-content">
        <h1>Products Management</h1>
        <div v-if="!isAuthenticated">
          <router-link to="/login" class="login-link">Login</router-link>
        </div>
        <div v-else>
          <button @click="logout" class="logout-link">Logout</button>
        </div>
      </div>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  name: 'App',
  setup() {
    const isAuthenticated = ref(false);

    const checkAuth = () => {
      const token = localStorage.getItem('token');
      isAuthenticated.value = !!token;
    };

    const logout = async () => {
      try {
        const token = localStorage.getItem('token');
        await axios.post('http://127.0.0.1:8000/api/logout', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        localStorage.removeItem('token');
        isAuthenticated.value = false;
        window.location.href = '/login';
      } catch (error) {
        console.error('Logout failed:', error);
      }
    };

    onMounted(() => {
      checkAuth();
    });

    return {
      isAuthenticated,
      logout
    };
  }
}
</script>

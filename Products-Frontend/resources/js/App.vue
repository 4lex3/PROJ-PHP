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

<style>
@font-face {
  font-family: 'SF Pro Display';
  src: local('SF Pro Display'), url('https://fonts.cdnfonts.com/s/17397/SFPRODISPLAYREGULAR.woff') format('woff');
  font-weight: 400;
  font-style: normal;
}
body, .main-app-container {
  font-family: 'SF Pro Display', 'Segoe UI', 'Roboto', Arial, sans-serif;
  background: linear-gradient(120deg, #232946 0%, #b8c1ec 100%);
  color: #f4f4f4;
  margin: 0;
  padding: 0;
  letter-spacing: 0.01em;
}
.navbar {
  background: #121629cc;
  box-shadow: 0 2px 16px #0005;
  border-radius: 0 0 22px 22px;
  margin-bottom: 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 1.15rem 0;
  transition: background 0.25s;
  animation: navfadein 1.2s;
}
@keyframes navfadein {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: none; }
}
.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 950px;
  margin: 0 auto;
  width: 90%;
}
.navbar h1 {
  color: #eebbc3;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 1.2rem;
  flex: 1;
  text-align: center;
  letter-spacing: 0.04em;
  text-shadow: 0 2px 12px #23294633;
}
.login-link, .logout-link {
  color: #232946;
  background: linear-gradient(90deg, #eebbc3 0%, #b8c1ec 100%);
  border: none;
  border-radius: 18px;
  padding: 0.5rem 1.3rem;
  font-size: 1.02rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.17s, transform 0.13s, color 0.17s;
  box-shadow: 0 2px 10px #0002;
  margin-left: 0.7rem;
  outline: none;
}
.login-link:hover, .logout-link:hover {
  background: #fff;
  color: #232946;
  transform: scale(1.06);
}
@media (max-width: 700px) {
  .navbar-content, .main-app-container {
    width: 99%;
    max-width: 100vw;
  }
  .navbar h1 {
    font-size: 1.1rem;
    margin: 0 0.4rem;
  }
}
</style>


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
        // Elimina todos los datos sensibles del usuario
        localStorage.removeItem('token');
        localStorage.removeItem('role');
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

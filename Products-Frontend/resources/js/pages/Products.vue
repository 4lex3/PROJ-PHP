<template>
  <div class="products-container">
    <div class="products-header">
      <h2>Products List</h2>
      <button v-if="isAdmin" @click="showCreateModal = true">Add Product</button>
    </div>
    <table class="products-table">
      <thead>
        <tr>
          <th @click="sortBy('name')">Name ↕</th>
          <th>Description</th>
          <th @click="sortBy('price')">Price ↕</th>
          <th>Stock</th>
          <th v-if="isAdmin">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in sortedProducts" :key="product.id">
          <td>{{ product.name }}</td>
          <td>{{ product.description }}</td>
          <td>${{ product.price }}</td>
          <td>{{ product.stock }}</td>
          <td v-if="isAdmin">
            <button @click="editProduct(product)" class="edit-btn">Edit</button>
            <button @click="deleteProduct(product.id)" class="delete-btn">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- Modal -->
    <div v-if="showCreateModal || showEditModal" class="modal-overlay">
      <div class="modal-box">
        <h2>{{ showEditModal ? 'Edit Product' : 'Create Product' }}</h2>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label>Name</label>
            <input v-model="formData.name" required />
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="formData.description" required></textarea>
          </div>
          <div class="form-group">
            <label>Price</label>
            <input v-model="formData.price" type="number" step="0.01" required />
          </div>
          <div class="form-group">
            <label>Stock</label>
            <input v-model="formData.stock" type="number" required />
          </div>
          <div class="modal-actions">
            <button type="button" @click="closeModal">Cancel</button>
            <button type="submit">{{ showEditModal ? 'Update' : 'Create' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

export default {
  name: 'Products',
  setup() {
    const products = ref([]);
    const showCreateModal = ref(false);
    const showEditModal = ref(false);
    const sortField = ref('name');
    const sortDirection = ref('asc');
    const isAdmin = ref(false);
    const formData = ref({
      name: '',
      description: '',
      price: '',
      stock: ''
    });

    const getProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://127.0.0.1:8000/api/products', {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000
        });
        products.value = response.data;
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) {
            alert('Tu sesión ha expirado o no tienes permisos. Por favor, inicia sesión de nuevo.');
            localStorage.removeItem('token');
            window.location.href = '/login';
          } else if (error.response.status === 500) {
            alert('Error interno del servidor. Contacta con el administrador.');
          } else {
            alert('Error al obtener productos: ' + error.response.statusText);
          }
          console.error('Respuesta error:', error.response);
        } else if (error.request) {
          alert('No se pudo conectar con el servidor. ¿Está el backend activo?');
          console.error('Request error:', error.request);
        } else {
          alert('Error desconocido: ' + error.message);
          console.error('Unknown error:', error);
        }
      }
    };

    const sortBy = (field) => {
      if (sortField.value === field) {
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
      } else {
        sortField.value = field;
        sortDirection.value = 'asc';
      }
    };

    const sortedProducts = computed(() => {
      return [...products.value].sort((a, b) => {
        let comparison = 0;
        if (sortField.value === 'price') {
          comparison = parseFloat(a.price) - parseFloat(b.price);
        } else {
          comparison = a[sortField.value].localeCompare(b[sortField.value]);
        }
        return sortDirection.value === 'asc' ? comparison : -comparison;
      });
    });

    const handleSubmit = async () => {
      try {
        const token = localStorage.getItem('token');
        if (showEditModal.value) {
          await axios.put(`http://127.0.0.1:8000/api/products/${formData.value.id}`, formData.value, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } else {
          await axios.post('http://127.0.0.1:8000/api/products', formData.value, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }
        await getProducts();
        closeModal();
      } catch (error) {
        console.error('Failed to save product:', error);
        alert('Failed to save product. Please try again.');
      }
    };

    const editProduct = (product) => {
      formData.value = { ...product };
      showEditModal.value = true;
    };

    const deleteProduct = async (id) => {
      if (confirm('Are you sure you want to delete this product?')) {
        try {
          const token = localStorage.getItem('token');
          await axios.delete(`http://127.0.0.1:8000/api/products/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          await getProducts();
        } catch (error) {
          console.error('Failed to delete product:', error);
          alert('Failed to delete product. Please try again.');
        }
      }
    };

    const closeModal = () => {
      showCreateModal.value = false;
      showEditModal.value = false;
      formData.value = {
        name: '',
        description: '',
        price: '',
        stock: ''
      };
    };

    onMounted(async () => {
      await getProducts();
      // Check if user is admin based on token (you might want to implement this differently)
      isAdmin.value = true; // For now, we'll assume all authenticated users are admins
    });

    return {
      products,
      sortedProducts,
      showCreateModal,
      showEditModal,
      formData,
      isAdmin,
      handleSubmit,
      editProduct,
      deleteProduct,
      closeModal,
      sortBy
    };
  }
}
</script>

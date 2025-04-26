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
        <tr v-if="sortedProducts.length === 0">
          <td :colspan="isAdmin ? 5 : 4" style="text-align:center; padding: 2rem;">
            <span v-if="isAdmin">
              No hay productos. <br/>
              <button @click="showCreateModal = true" class="add-first-btn">Añadir el primer producto</button>
            </span>
            <span v-else>
              No hay productos disponibles.
            </span>
          </td>
        </tr>
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

    // Refuerza el control: detecta cambios en localStorage y en el ciclo de vida
    const checkAdmin = () => {
      const role = (localStorage.getItem('role') || '').toLowerCase();
      isAdmin.value = role === 'admin';
    };
    checkAdmin();
    // Si el usuario manipula localStorage, el estado se actualiza
    window.addEventListener('storage', checkAdmin);

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
      // NO tocar isAdmin aquí: solo el rol admin debe ver los botones
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

<style scoped>
body {
  background: linear-gradient(120deg, #232946 0%, #b8c1ec 100%);
  font-family: 'SF Pro Display', 'Segoe UI', 'Roboto', Arial, sans-serif;
  color: #f4f4f4;
  margin: 0;
  padding: 0;
}
.products-container {
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: transparent;
  padding: 2rem 0;
  animation: fadein 1.2s;
}
@keyframes fadein {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: none; }
}
.products-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 90%;
  max-width: 950px;
  margin-bottom: 1.5rem;
}
.products-header h2 {
  font-size: 2.3rem;
  font-weight: 800;
  color: #eebbc3;
  margin: 0;
  letter-spacing: 1px;
  text-shadow: 0 2px 12px #23294633;
}
.products-header button {
  background: linear-gradient(90deg, #eebbc3 0%, #b8c1ec 100%);
  color: #232946;
  border: none;
  border-radius: 18px;
  padding: 0.7rem 1.5rem;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 18px #eebbc366;
  transition: background 0.25s, transform 0.18s, box-shadow 0.18s;
}
.products-header button:hover {
  background: linear-gradient(90deg, #b8c1ec 0%, #eebbc3 100%);
  color: #232946;
  transform: scale(1.07);
  box-shadow: 0 6px 24px #b8c1ec66;
}
.products-table {
  width: 90%;
  max-width: 950px;
  border-collapse: separate;
  border-spacing: 0;
  background: rgba(35,41,70,0.97);
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 8px 36px 0 #23294644;
  margin-bottom: 2rem;
  animation: fadein 1.3s 0.2s backwards;
  color: #f4f4f4;
}
.products-table th, .products-table td {
  padding: 1.15rem 1rem;
  text-align: left;
  font-size: 1.1rem;
}
.products-table th {
  background: #b8c1ec44;
  color: #eebbc3;
  font-weight: 700;
  cursor: pointer;
  user-select: none;
  letter-spacing: 0.5px;
  transition: background 0.18s;
}
.products-table th:hover {
  background: #eebbc366;
}
.products-table tr:nth-child(even) {
  background: #232946cc;
}
.products-table tr:hover {
  background: #eebbc322;
  transition: background 0.22s;
}
.edit-btn, .delete-btn, .add-first-btn {
  padding: 0.55rem 1.1rem;
  border-radius: 14px;
  font-size: 1.04rem;
  font-weight: 700;
  border: none;
  margin-right: 0.5rem;
  cursor: pointer;
  transition: background 0.18s, transform 0.16s;
  box-shadow: 0 2px 10px #b8c1ec33;
}
.edit-btn {
  background: linear-gradient(90deg, #b8c1ec 0%, #eebbc3 100%);
  color: #232946;
}
.edit-btn:hover {
  background: linear-gradient(90deg, #eebbc3 0%, #b8c1ec 100%);
  color: #232946;
  transform: scale(1.07);
}
.delete-btn {
  background: linear-gradient(90deg, #ff5858 0%, #f09819 100%);
  color: #fff;
}
.delete-btn:hover {
  background: linear-gradient(90deg, #e53935 0%, #eebbc3 100%);
  color: #232946;
  transform: scale(1.07);
}
.add-first-btn {
  background: linear-gradient(90deg, #eebbc3 0%, #b8c1ec 100%);
  color: #232946;
  margin-top: 1rem;
  font-size: 1.2rem;
  padding: 0.9rem 2.2rem;
  font-weight: 700;
  box-shadow: 0 4px 18px #eebbc344;
}
.add-first-btn:hover {
  background: linear-gradient(90deg, #b8c1ec 0%, #eebbc3 100%);
  color: #232946;
  transform: scale(1.09);
}
.products-table td[colspan] span {
  font-size: 1.25rem;
  color: #b8c1ec;
  font-weight: 600;
  letter-spacing: 0.5px;
  animation: fadein 1.6s;
}
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(44, 62, 80, 0.24);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadein 0.5s;
}
.modal-box {
  background: linear-gradient(120deg, #232946 0%, #b8c1ec 100%);
  padding: 2.7rem 2.1rem 2rem 2.1rem;
  border-radius: 22px;
  box-shadow: 0 6px 36px #23294644;
  min-width: 320px;
  max-width: 400px;
  animation: fadein 0.7s;
}
.modal-box h2 {
  margin-bottom: 1.3rem;
  font-size: 1.6rem;
  color: #eebbc3;
  font-weight: 800;
  letter-spacing: 0.5px;
}
.form-group {
  margin-bottom: 1.15rem;
}
.form-group label {
  display: block;
  margin-bottom: 0.4rem;
  font-weight: 600;
  color: #b8c1ec;
}
.form-group input, .form-group textarea {
  width: 100%;
  padding: 0.55rem 0.9rem;
  border: 1.5px solid #b8c1ec;
  border-radius: 14px;
  font-size: 1.07rem;
  background: #232946;
  color: #f4f4f4;
  resize: none;
  transition: border 0.18s;
  box-shadow: 0 1px 8px #b8c1ec33;
}
.form-group input:focus, .form-group textarea:focus {
  border: 1.5px solid #eebbc3;
  outline: none;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.9rem;
}
.modal-actions button {
  min-width: 110px;
  padding: 0.6rem 1rem;
  font-size: 1.05rem;
  border-radius: 14px;
  border: none;
  font-weight: 700;
  background: linear-gradient(90deg, #b8c1ec 0%, #eebbc3 100%);
  color: #232946;
  cursor: pointer;
  transition: background 0.18s, color 0.18s, transform 0.13s;
  box-shadow: 0 1px 6px #b8c1ec55;
}
.modal-actions button:hover {
  background: linear-gradient(90deg, #eebbc3 0%, #b8c1ec 100%);
  color: #232946;
  transform: scale(1.06);
}
@media (max-width: 700px) {
  .products-header, .products-table {
    width: 99%;
    max-width: 100vw;
  }
  .modal-box {
    min-width: 90vw;
    max-width: 98vw;
  }
}
</style>

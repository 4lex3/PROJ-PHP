<template>
  <div class="products-container">
    <div class="products-header">
      <h1>Gestión de Productos</h1>
      <div>
        <button v-if="isAdmin" @click="showCreate = true">Nuevo Producto</button>
        <button @click="logout" class="logout-btn">Logout</button>
      </div>
    </div>
    <table class="products-table">
      <thead>
        <tr>
          <th @click="sortBy('name')">
            Nombre
            <span v-if="sortKey === 'name'">{{ sortAsc ? '▲' : '▼' }}</span>
          </th>
          <th>Descripción</th>
          <th @click="sortBy('price')">
            Precio
            <span v-if="sortKey === 'price'">{{ sortAsc ? '▲' : '▼' }}</span>
          </th>
          <th>Stock</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in sortedProducts" :key="product.id">
          <td>{{ product.name }}</td>
          <td>{{ product.description }}</td>
          <td>{{ product.price }}</td>
          <td>{{ product.stock }}</td>
          <td>
            <template v-if="isAdmin">
              <button @click="editProduct(product)" class="edit-btn">Editar</button>
              <button @click="deleteProduct(product.id)" class="delete-btn">Eliminar</button>
            </template>
            <template v-else>
              <span class="readonly">Solo lectura</span>
            </template>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal Crear/Editar -->
    <div v-if="showCreate || showEdit" class="modal-overlay">
      <div class="modal-box">
        <h2>{{ showEdit ? 'Editar Producto' : 'Nuevo Producto' }}</h2>
        <form @submit.prevent="showEdit ? updateProduct() : createProduct()">
          <div class="form-group">
            <label>Nombre</label>
            <input v-model="form.name" required />
          </div>
          <div class="form-group">
            <label>Descripción</label>
            <input v-model="form.description" required />
          </div>
          <div class="form-group">
            <label>Precio</label>
            <input v-model="form.price" type="number" step="0.01" required />
          </div>
          <div class="form-group">
            <label>Stock</label>
            <input v-model="form.stock" type="number" required />
          </div>
          <div class="modal-actions">
            <button type="button" @click="closeModal">Cancelar</button>
            <button type="submit">Guardar</button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<style scoped>
.products-container {
  max-width: 900px;
  margin: 40px auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 2rem;
}
.products-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
.products-header h1 {
  font-size: 1.8rem;
  font-weight: bold;
}
.products-header button {
  margin-left: 10px;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: #1976d2;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}
.logout-btn {
  background: #888;
}
.products-header button:hover {
  background: #1565c0;
}
.products-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
}
.products-table th, .products-table td {
  border: 1px solid #e0e0e0;
  padding: 0.75rem 1rem;
  text-align: left;
}
.products-table th {
  cursor: pointer;
  background: #f5f5f5;
}
.edit-btn {
  background: #388e3c;
  color: #fff;
  margin-right: 5px;
  border: none;
  border-radius: 4px;
  padding: 0.3rem 0.7rem;
  cursor: pointer;
}
.edit-btn:hover {
  background: #2e7031;
}
.delete-btn {
  background: #d32f2f;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.3rem 0.7rem;
  cursor: pointer;
}
.delete-btn:hover {
  background: #b71c1c;
}
.readonly {
  color: #aaa;
}
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-box {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  min-width: 320px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.18);
}
.modal-box h2 {
  margin-bottom: 1rem;
  font-size: 1.3rem;
}
.form-group {
  margin-bottom: 1rem;
}
.form-group label {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 500;
}
.form-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 1rem;
}
.modal-actions button {
  padding: 0.5rem 1.1rem;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  background: #1976d2;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s;
}
.modal-actions button:first-child {
  background: #888;
}
.modal-actions button:hover {
  background: #1565c0;
}
</style>


<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const products = ref([]);
const sortKey = ref('name');
const sortAsc = ref(true);
const showCreate = ref(false);
const showEdit = ref(false);
const form = ref({ name: '', description: '', price: '', stock: '' });
const editId = ref(null);
const isAdmin = ref(false); // Cambia esto según el rol del usuario

const fetchProducts = async () => {
  const token = localStorage.getItem('token');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  const res = await axios.get('http://127.0.0.1:8000/api/products');
  products.value = res.data;
};

const sortBy = (key) => {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value;
  } else {
    sortKey.value = key;
    sortAsc.value = true;
  }
};

const sortedProducts = computed(() => {
  return [...products.value].sort((a, b) => {
    if (a[sortKey.value] < b[sortKey.value]) return sortAsc.value ? -1 : 1;
    if (a[sortKey.value] > b[sortKey.value]) return sortAsc.value ? 1 : -1;
    return 0;
  });
});

const createProduct = async () => {
  const token = localStorage.getItem('token');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  await axios.post('http://127.0.0.1:8000/api/products', form.value);
  closeModal();
  fetchProducts();
};

const editProduct = (product) => {
  showEdit.value = true;
  editId.value = product.id;
  form.value = { ...product };
};

const updateProduct = async () => {
  const token = localStorage.getItem('token');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  await axios.put(`http://127.0.0.1:8000/api/products/${editId.value}`, form.value);
  closeModal();
  fetchProducts();
};

const deleteProduct = async (id) => {
  if (confirm('¿Seguro que quieres eliminar este producto?')) {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    await axios.delete(`http://127.0.0.1:8000/api/products/${id}`);
    fetchProducts();
  }
};

const closeModal = () => {
  showCreate.value = false;
  showEdit.value = false;
  form.value = { name: '', description: '', price: '', stock: '' };
  editId.value = null;
};

const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};

onMounted(() => {
  // Aquí deberías obtener el rol real del usuario desde la API o token
  // Por ahora, lo dejamos como admin para demo
  isAdmin.value = true;
  fetchProducts();
});
</script>

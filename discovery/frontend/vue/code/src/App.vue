<template>
  <div class="container">
    <div class="header">
      <h1>Silk road dz</h1>
      <button @click="handleMounted">Get new products</button>
      <div>{{ favCount }} favorite products</div>
    </div>
    <div class="product-grid">
      <div v-for="(product, index) in products" :key="index">
        <ProductCard :product="product" @addToFavorite="handleAddToFavorite" />
      </div>
    </div>
  </div>
</template>

<script setup>
import ProductCard from "./components/ProductCard.vue";
import { ref, onMounted, reactive } from "vue";
const products = ref([]);
const favCount = ref(0);
function handleAddToFavorite() {
  favCount.value = favCount.value + 1;
}

function handleMounted() {
  const res = fetch("https://fake.jsonmockapi.com/products?length=10"); // promise
  res
    .then((response) => response.json())
    .then((data) => {
      products.value = data;
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
    });
}

onMounted(handleMounted);
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1rem;
}
.header h1 {
  text-align: center;
  margin-bottom: 2rem;
  font-weight: normal;
}
.header button {
  display: block;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}
</style>

<template>
  <div class="card">
    <img class="thumb" v-bind:src="product.image" />
    <div class="card-content">
      <h2>{{ product.productName }}</h2>
      <p>{{ product.description }}</p>
      <div class="meta">
        <span>💲 {{ product.price }}</span>
        <span>📦 {{ product.stock }} in stock</span>
        <button @click="handleAddToFavorite" class="add-to-favorite">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="16"
            viewBox="0 0 24 24"
            width="16"
          >
            <path
              fill="currentColor"
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 
            7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 
            16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 
            11.54L12 21.35z"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
const props = defineProps({
  product: {
    type: Object,
    default: () => ({
      productName: "",
      description: "",
      price: 0,
      stock: 0,
      image: "",
    }),
  },
});
const emit = defineEmits(["addToFavorite"]);
function handleAddToFavorite() {
  emit("addToFavorite", props.product);
}
</script>

<style scoped>
.card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s;
}
.card:hover {
  transform: translateY(-4px);
}
.thumb {
  width: 100%;
  height: 180px;
  object-fit: cover;
}
.card-content {
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.card-content h2 {
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
}
.card-content p {
  flex: 1;
  margin: 0 0 1rem;
  color: #555;
  font-size: 0.95rem;
}
.meta {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
}
.add-to-favorite {
  background-color: #ff4081;
  color: white;
  border: none;
  padding: 0 0.3rem;
  border-radius: 4px;
  cursor: pointer;
}
</style>

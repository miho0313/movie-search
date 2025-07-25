<template>
  <div class="modal-backdrop" @click.self="emit('close')">
    <div class="modal-content">
      <button class="close-button" @click="emit('close')">✖</button>
      <h2>{{ movie.title }}</h2>
      <p><strong>개봉일:</strong> {{ movie.release_date }}</p>
      <p><strong>평점:</strong> {{ movie.vote_average }}</p>
      <p>{{ movie.overview || "줄거리 정보가 없습니다." }}</p>
    </div>
  </div>
</template>

<script setup>
// eslint-disable-next-line no-undef
defineProps({ movie: Object });
// eslint-disable-next-line no-undef
const emit = defineEmits(["close"]);
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-content {
  background: #1e1f2f;
  color: white;
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.close-button {
  position: absolute;
  top: 10px;
  right: 12px;
  font-size: 20px;
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
}
</style>

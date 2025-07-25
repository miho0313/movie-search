<template>
  <div id="app">
    <!-- 네비게이션 -->
    <nav class="navbar">
      <h1>🎬 Movie Search</h1>
      <div class="nav-buttons">
        <button
          @click="currentPage = 'home'"
          :class="{ active: currentPage === 'home' }"
        >
          🏠 홈
        </button>
        <button
          @click="currentPage = 'favorites'"
          :class="{ active: currentPage === 'favorites' }"
        >
          ⭐ 찜 목록 ({{ favoriteStore.favorites.length }})
        </button>
        <button
          @click="currentPage = 'mypage'"
          :class="{ active: currentPage === 'mypage' }"
        >
          👤 마이페이지
        </button>
      </div>
    </nav>

    <!-- 페이지 컨텐츠 -->
    <main class="main-content">
      <!-- 홈 페이지 -->
      <div v-if="currentPage === 'home'">
        <MovieSearch />
        <MovieRanking />
      </div>

      <!-- 찜 목록 페이지 -->
      <div v-if="currentPage === 'favorites'">
        <FavoriteList @goToHome="currentPage = 'home'" />
      </div>

      <!-- 마이페이지 -->
      <div v-if="currentPage === 'mypage'">
        <MyPage />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import MovieSearch from "./components/MovieSearch.vue";
import MovieRanking from "./components/MovieRanking.vue";
import FavoriteList from "./components/FavoriteList.vue";
import MyPage from "./components/MyPage.vue"; // MyPage 컴포넌트 추가
import { useFavoriteStore } from "@/stores/useFavoriteStore";

// 현재 페이지 상태
const currentPage = ref("home");

// 찜 스토어 사용 (네비게이션에서 찜 개수 표시용)
const favoriteStore = useFavoriteStore();
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  max-width: 100%;
  overflow-x: hidden;
  background-color: #121321;
  color: white;
  font-family: sans-serif;
}

/* App 루트 요소 스타일 */
#app {
  width: 100vw;
  min-height: 100vh;
  background-color: #0a0b14;
  color: white;
  display: flex;
  flex-direction: column;
}

/* 네비게이션 스타일 */
.navbar {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background: #1e1f2f;
  border-bottom: 2px solid #ffd600;
  box-sizing: border-box;
}

.navbar h1 {
  margin: 0;
  color: #ffd600;
}

.nav-buttons {
  display: flex;
  gap: 15px;
}

.nav-buttons button {
  padding: 8px 16px;
  background: transparent;
  color: white;
  border: 2px solid #444;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.nav-buttons button:hover {
  border-color: #ffd600;
  color: #ffd600;
}

.nav-buttons button.active {
  background: #ffd600;
  color: #000;
  border-color: #ffd600;
}

.main-content {
  flex: 1;
  width: 100%;
  padding: 0;
  box-sizing: border-box;
}
</style>

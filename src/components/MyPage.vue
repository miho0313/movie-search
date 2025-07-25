<template>
  <div class="mypage-container">
    <h1>마이페이지</h1>

    <!-- 찜한 영화 통계 -->
    <div class="stats-section">
      <div class="stat-card">
        <h3>찜한 영화</h3>
        <p class="stat-number">{{ favoriteStore.favorites.length }}개</p>
      </div>
    </div>

    <!-- 찜한 영화 목록 -->
    <div class="favorites-section">
      <h2>찜한 영화 목록</h2>

      <!-- 찜한 영화가 없을 때 -->
      <div v-if="favoriteStore.favorites.length === 0" class="no-favorites">
        <p>아직 찜한 영화가 없습니다.</p>
        <p>영화를 검색해서 마음에 드는 영화를 찜해보세요! ⭐</p>
      </div>

      <!-- 찜한 영화 목록 -->
      <div v-else class="favorites-grid">
        <div
          v-for="movie in favoriteStore.favorites"
          :key="movie.id"
          class="favorite-card"
        >
          <!-- 영화 포스터 -->
          <img
            v-if="movie.poster_path"
            :src="'https://image.tmdb.org/t/p/w200' + movie.poster_path"
            alt="포스터"
          />

          <!-- 찜 해제 버튼 -->
          <button
            @click="favoriteStore.toggleFavorite(movie)"
            class="remove-favorite"
            title="찜 해제"
          >
            ❌
          </button>

          <!-- 영화 정보 -->
          <div class="movie-info">
            <h3>{{ movie.title }}</h3>
            <p class="release-date">
              개봉일: {{ movie.release_date || "정보 없음" }}
            </p>
            <p class="rating">
              ⭐ {{ movie.vote_average?.toFixed(1) || "N/A" }}
            </p>
            <p class="overview">
              {{
                (movie.overview || "줄거리 정보가 없습니다.").slice(0, 50)
              }}...
            </p>
          </div>
        </div>
      </div>

      <!-- 전체 삭제 버튼 -->
      <div v-if="favoriteStore.favorites.length > 0" class="clear-section">
        <button @click="clearAllFavorites" class="clear-all-btn">
          🗑️ 찜 목록 전체 삭제
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useFavoriteStore } from "@/stores/useFavoriteStore";

// Pinia 찜 스토어 사용
const favoriteStore = useFavoriteStore();

// 전체 찜 목록 삭제 함수
const clearAllFavorites = () => {
  if (confirm("정말로 찜한 영화를 모두 삭제하시겠습니까?")) {
    favoriteStore.favorites = [];
  }
};
</script>

<style scoped>
.mypage-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.mypage-container h1 {
  color: white;
  text-align: center;
  margin-bottom: 30px;
}

/* 통계 섹션 */
.stats-section {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
}

.stat-card {
  background: #1e1f2f;
  color: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  min-width: 150px;
}

.stat-card h3 {
  margin: 0 0 10px 0;
  color: #ffd600;
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
  color: #ffd600;
}

/* 찜한 영화 섹션 */
.favorites-section h2 {
  color: white;
  margin-bottom: 20px;
}

/* 찜한 영화가 없을 때 */
.no-favorites {
  text-align: center;
  color: #ccc;
  padding: 40px;
  background: #1e1f2f;
  border-radius: 12px;
}

.no-favorites p {
  margin: 10px 0;
  font-size: 1.1rem;
}

/* 찜한 영화 그리드 */
.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

/* 개별 찜한 영화 카드 */
.favorite-card {
  background: #1e1f2f;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  transition: transform 0.3s;
}

.favorite-card:hover {
  transform: translateY(-5px);
}

.favorite-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

/* 찜 해제 버튼 */
.remove-favorite {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
  z-index: 2;
}

.remove-favorite:hover {
  background: rgba(255, 0, 0, 0.7);
}

/* 영화 정보 */
.movie-info {
  padding: 15px;
  color: white;
}

.movie-info h3 {
  margin: 0 0 8px 0;
  font-size: 1.1rem;
  color: #ffd600;
}

.release-date,
.rating {
  margin: 5px 0;
  font-size: 0.9rem;
  color: #ccc;
}

.overview {
  margin: 8px 0 0 0;
  font-size: 0.85rem;
  color: #aaa;
  line-height: 1.4;
}

/* 전체 삭제 섹션 */
.clear-section {
  text-align: center;
  margin-top: 30px;
}

.clear-all-btn {
  background: #ff4757;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
}

.clear-all-btn:hover {
  background: #ff3742;
}
</style>

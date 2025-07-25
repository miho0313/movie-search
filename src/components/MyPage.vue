<template>
  <div class="mypage-container">
    <div class="profile-header">
      <div class="profile-avatar">👤</div>
      <h1>마이페이지</h1>
      <p class="profile-subtitle">나만의 영화 취향 분석</p>
    </div>

    <!-- 통계 대시보드 -->
    <div class="stats-section">
      <div class="stat-card">
        <div class="stat-icon">⭐</div>
        <h3>찜한 영화</h3>
        <p class="stat-number">{{ favoriteStore.favorites.length }}개</p>
      </div>

      <div class="stat-card">
        <div class="stat-icon">📊</div>
        <h3>평균 평점</h3>
        <p class="stat-number">{{ averageRating }}</p>
      </div>

      <div class="stat-card">
        <div class="stat-icon">🏆</div>
        <h3>최고 평점</h3>
        <p class="stat-number">{{ topRating }}</p>
      </div>
    </div>

    <!-- 최근 활동 -->
    <div class="recent-activity" v-if="latestMovie">
      <h2>최근 찜한 영화</h2>
      <div class="latest-movie-card">
        <img
          v-if="latestMovie.poster_path"
          :src="'https://image.tmdb.org/t/p/w154' + latestMovie.poster_path"
          :alt="latestMovie.title"
        />
        <div class="movie-details">
          <h3>{{ latestMovie.title }}</h3>
          <p class="rating">⭐ {{ latestMovie.vote_average?.toFixed(1) }}</p>
          <p class="release-date">
            {{ latestMovie.release_date || "개봉일 미정" }}
          </p>
        </div>
      </div>
    </div>

    <!-- 빈 상태 -->
    <div v-else class="empty-state">
      <div class="empty-icon">📽️</div>
      <h2>아직 찜한 영화가 없습니다</h2>
      <p>영화를 검색해서 마음에 드는 영화를 찜해보세요!</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useFavoriteStore } from "@/stores/useFavoriteStore";

const favoriteStore = useFavoriteStore();

// 평균 평점 계산
const averageRating = computed(() => {
  if (favoriteStore.favorites.length === 0) return "N/A";
  const total = favoriteStore.favorites.reduce(
    (sum, movie) => sum + (movie.vote_average || 0),
    0
  );
  return (total / favoriteStore.favorites.length).toFixed(1);
});

// 최고 평점
const topRating = computed(() => {
  if (favoriteStore.favorites.length === 0) return "N/A";
  const highest = Math.max(
    ...favoriteStore.favorites.map((movie) => movie.vote_average || 0)
  );
  return highest.toFixed(1);
});

// 가장 최근 찜한 영화
const latestMovie = computed(() => {
  if (favoriteStore.favorites.length === 0) return null;
  return favoriteStore.favorites[favoriteStore.favorites.length - 1];
});
</script>

<style scoped>
.mypage-container {
  padding: 30px;
  max-width: 800px;
  margin: 0 auto;
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0b14 0%, #1e1f2f 100%);
}

/* 프로필 헤더 */
.profile-header {
  text-align: center;
  margin-bottom: 40px;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  background: #ffd600;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  margin: 0 auto 20px;
}

.profile-header h1 {
  color: #ffd600;
  margin: 0 0 10px 0;
  font-size: 2.2rem;
}

.profile-subtitle {
  color: #ccc;
  margin: 0;
  font-size: 1.1rem;
}

/* 통계 섹션 */
.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: #1e1f2f;
  padding: 25px;
  border-radius: 15px;
  text-align: center;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.stat-card:hover {
  transform: translateY(-5px);
  border-color: #ffd600;
}

.stat-icon {
  font-size: 2rem;
  margin-bottom: 10px;
}

.stat-card h3 {
  color: #ccc;
  margin: 0 0 10px 0;
  font-size: 0.9rem;
}

.stat-number {
  color: #ffd600;
  font-size: 1.8rem;
  font-weight: bold;
  margin: 0;
}

/* 최근 활동 */
.recent-activity h2 {
  color: white;
  margin-bottom: 20px;
  text-align: center;
}

.latest-movie-card {
  background: #1e1f2f;
  padding: 20px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.latest-movie-card img {
  width: 80px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
}

.movie-details h3 {
  color: #ffd600;
  margin: 0 0 8px 0;
  font-size: 1.2rem;
}

.movie-details .rating {
  color: #ffd600;
  margin: 0 0 5px 0;
  font-weight: bold;
}

.movie-details .release-date {
  color: #ccc;
  margin: 0;
  font-size: 0.9rem;
}

/* 빈 상태 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.empty-state h2 {
  color: white;
  margin: 0 0 15px 0;
}

.empty-state p {
  color: #ccc;
  margin: 0;
  font-size: 1.1rem;
}

/* 모바일 반응형 */
@media (max-width: 768px) {
  .mypage-container {
    padding: 20px;
  }

  .stats-section {
    grid-template-columns: 1fr;
  }

  .latest-movie-card {
    flex-direction: column;
    text-align: center;
  }
}
</style>

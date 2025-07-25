<template>
  <div class="favorite-list-container">
    <div class="header">
      <h1>찜한 영화 목록</h1>
      <p class="subtitle">내가 관심있는 영화들을 모아보세요!</p>
    </div>

    <!-- 찜한 영화가 없을 때 -->
    <div v-if="favoriteStore.favorites.length === 0" class="empty-state">
      <div class="empty-icon">🎬</div>
      <h2>아직 찜한 영화가 없습니다</h2>
      <p>영화를 검색해서 마음에 드는 영화를 찜해보세요!</p>
      <button @click="$emit('goToHome')" class="go-home-btn">
        영화 검색하러 가기
      </button>
    </div>

    <!-- 찜한 영화 목록 -->
    <div v-else class="favorites-content">
      <!-- 상단 액션 바 -->
      <div class="action-bar">
        <div class="movie-count">
          총
          <span class="count-number">{{ favoriteStore.favorites.length }}</span
          >개의 영화
        </div>
        <div class="action-buttons">
          <button @click="sortMovies" class="sort-btn">
            {{ sortOrder === "newest" ? "🔽 최신순" : "🔼 오래된순" }}
          </button>
          <button @click="clearAllFavorites" class="clear-all-btn">
            전체 삭제
          </button>
        </div>
      </div>

      <!-- 영화 그리드 -->
      <div class="movies-grid">
        <div
          v-for="movie in sortedMovies"
          :key="movie.id"
          class="movie-card"
          @click="selectMovie(movie)"
        >
          <!-- 영화 포스터 -->
          <div class="poster-container">
            <img
              v-if="movie.poster_path"
              :src="'https://image.tmdb.org/t/p/w300' + movie.poster_path"
              :alt="movie.title"
              class="poster"
            />
            <div v-else class="no-poster">🎬</div>

            <!-- 찜 해제 버튼 -->
            <button
              @click.stop="favoriteStore.toggleFavorite(movie)"
              class="remove-btn"
              title="찜 해제"
            >
              ❌
            </button>

            <!-- 평점 배지 -->
            <div class="rating-badge">
              ⭐ {{ movie.vote_average?.toFixed(1) || "N/A" }}
            </div>
          </div>

          <!-- 영화 정보 -->
          <div class="movie-info">
            <h3 class="movie-title">{{ movie.title }}</h3>
            <p class="release-date">{{ formatDate(movie.release_date) }}</p>
            <p class="overview">
              {{ truncateText(movie.overview, 80) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 영화 상세 모달 -->
    <MovieModal
      v-if="selectedMovie"
      :movie="selectedMovie"
      @close="selectedMovie = null"
    />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useFavoriteStore } from "@/stores/useFavoriteStore";
import MovieModal from "./MovieModal.vue";

// 이벤트 정의
// eslint-disable-next-line no-undef
defineEmits(["goToHome"]);

// Pinia 찜 스토어 사용
const favoriteStore = useFavoriteStore();

// 상태 변수
const selectedMovie = ref(null);
const sortOrder = ref("newest"); // 'newest' 또는 'oldest'

// 정렬된 영화 목록
const sortedMovies = computed(() => {
  const movies = [...favoriteStore.favorites];
  return movies.sort((a, b) => {
    if (sortOrder.value === "newest") {
      return (
        new Date(b.release_date || "1900-01-01") -
        new Date(a.release_date || "1900-01-01")
      );
    } else {
      return (
        new Date(a.release_date || "1900-01-01") -
        new Date(b.release_date || "1900-01-01")
      );
    }
  });
});

// 정렬 순서 변경
const sortMovies = () => {
  sortOrder.value = sortOrder.value === "newest" ? "oldest" : "newest";
};

// 전체 찜 목록 삭제
const clearAllFavorites = () => {
  if (
    confirm(
      `정말로 찜한 영화 ${favoriteStore.favorites.length}개를 모두 삭제하시겠습니까?`
    )
  ) {
    favoriteStore.favorites.splice(0);
  }
};

// 영화 선택 (상세 모달)
const selectMovie = (movie) => {
  selectedMovie.value = movie;
};

// 날짜 포맷팅
const formatDate = (dateString) => {
  if (!dateString) return "개봉일 미정";
  const date = new Date(dateString);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
};

// 텍스트 자르기
const truncateText = (text, maxLength) => {
  if (!text) return "줄거리 정보가 없습니다.";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};
</script>

<style scoped>
.favorite-list-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0b14 0%, #1e1f2f 100%);
  padding: 20px;
}

/* 헤더 */
.header {
  text-align: center;
  margin-bottom: 40px;
}

.header h1 {
  color: #ffd600;
  font-size: 2.5rem;
  margin: 0 0 10px 0;
}

.subtitle {
  color: #ccc;
  font-size: 1.1rem;
  margin: 0;
}

/* 빈 상태 */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  max-width: 500px;
  margin: 0 auto;
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 20px;
}

.empty-state h2 {
  color: white;
  margin: 0 0 15px 0;
}

.empty-state p {
  color: #ccc;
  margin: 0 0 30px 0;
  font-size: 1.1rem;
}

.go-home-btn {
  background: #ffd600;
  color: #000;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s;
}

.go-home-btn:hover {
  transform: translateY(-2px);
}

/* 찜한 영화 컨텐츠 */
.favorites-content {
  max-width: 1400px;
  margin: 0 auto;
}

/* 액션 바 */
.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: #1e1f2f;
  border-radius: 12px;
}

.movie-count {
  color: white;
  font-size: 1.1rem;
}

.count-number {
  color: #ffd600;
  font-weight: bold;
  font-size: 1.3rem;
}

.action-buttons {
  display: flex;
  gap: 15px;
}

.sort-btn,
.clear-all-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.sort-btn {
  background: #444;
  color: white;
}

.sort-btn:hover {
  background: #555;
}

.clear-all-btn {
  background: #ff4757;
  color: white;
}

.clear-all-btn:hover {
  background: #ff3742;
}

/* 영화 그리드 */
.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
}

/* 영화 카드 */
.movie-card {
  background: #1e1f2f;
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.3s;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.movie-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 25px rgba(255, 214, 0, 0.3);
}

/* 포스터 컨테이너 */
.poster-container {
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
}

.poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.movie-card:hover .poster {
  transform: scale(1.05);
}

.no-poster {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #333;
  font-size: 3rem;
}

/* 찜 해제 버튼 */
.remove-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.8);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
  z-index: 2;
}

.remove-btn:hover {
  background: rgba(255, 0, 0, 0.8);
  transform: scale(1.1);
}

/* 평점 배지 */
.rating-badge {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.8);
  color: #ffd600;
  padding: 4px 8px;
  border-radius: 15px;
  font-size: 0.9rem;
  font-weight: bold;
}

/* 영화 정보 */
.movie-info {
  padding: 20px;
}

.movie-title {
  color: #ffd600;
  margin: 0 0 8px 0;
  font-size: 1.2rem;
  font-weight: bold;
  line-height: 1.3;
}

.release-date {
  color: #ccc;
  margin: 0 0 12px 0;
  font-size: 0.9rem;
}

.overview {
  color: #aaa;
  margin: 0;
  line-height: 1.5;
  font-size: 0.9rem;
}

/* 모바일 반응형 */
@media (max-width: 768px) {
  .favorite-list-container {
    padding: 10px;
  }

  .header h1 {
    font-size: 2rem;
  }

  .action-bar {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .movies-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
  }
}
</style>

<template>
  <div class="search-container">
    <!-- 검색 입력창과 버튼 -->
    <div class="search-input-section">
      <input
        v-model="query"
        @keyup.enter="searchMovies"
        @focus="showSearchHistory = true"
        @blur="hideSearchHistoryDelayed"
        placeholder="영화 제목을 입력하세요"
        ref="searchInput"
      />
      <button @click="searchMovies">검색</button>

      <!-- 검색 기록 드롭다운 -->
      <div
        v-if="showSearchHistory && searchHistoryStore.searchHistory.length > 0"
        class="search-history-dropdown"
      >
        <div class="history-header">
          <span>최근 검색어</span>
          <button @click="clearAllHistory" class="clear-all-btn">
            전체 삭제
          </button>
        </div>
        <div
          v-for="term in searchHistoryStore.searchHistory"
          :key="term"
          class="history-item"
          @mousedown="selectSearchTerm(term)"
        >
          <span class="history-term">{{ term }}</span>
          <button @click.stop="removeHistoryItem(term)" class="remove-btn">
            ✖
          </button>
        </div>
      </div>
    </div>

    <!-- 검색 중 로딩 표시 -->
    <div v-if="loading">🔄 검색 중...</div>

    <!-- 검색 결과 오버레이 -->
    <div v-if="showResults" class="search-overlay">
      <h2>"{{ query }}" 검색 결과</h2>
      <!-- 검색 결과 닫기 버튼 -->
      <button class="close-button" @click="clearSearch">✖ 닫기</button>

      <!-- 에러 메시지 -->
      <div v-if="error" class="error-message">{{ error }}</div>

      <!-- 영화 검색 결과 목록 -->
      <div v-else class="movie-grid">
        <div
          v-for="movie in movies"
          :key="movie.id"
          class="movie-card"
          @click="selectMovie(movie.id)"
        >
          <!-- 영화 포스터 -->
          <div class="poster-container">
            <img
              v-if="movie.poster_path"
              :src="'https://image.tmdb.org/t/p/w200' + movie.poster_path"
              alt="포스터"
              class="poster-image"
            />
            <div v-else class="no-poster">🎬</div>

            <!-- 찜하기 버튼 -->
            <button
              @click.stop="favoriteStore.toggleFavorite(movie)"
              class="favorite-btn"
              :aria-label="
                favoriteStore.isFavorite(movie) ? '찜 해제' : '찜하기'
              "
            >
              {{ favoriteStore.isFavorite(movie) ? "💖" : "🤍" }}
            </button>

            <!-- 평점 배지 -->
            <div class="rating-badge">
              ⭐ {{ movie.vote_average?.toFixed(1) || "N/A" }}
            </div>
          </div>

          <!-- 영화 정보 -->
          <div class="movie-info">
            <!-- 영화 제목 -->
            <h3 class="movie-title">{{ movie.title }}</h3>
            <!-- 개봉일 -->
            <p class="release-date">
              개봉일: {{ movie.release_date || "정보 없음" }}
            </p>
            <!-- 줄거리(30자 미리보기) -->
            <p class="overview">
              {{
                (movie.overview || "줄거리 정보가 없습니다.").slice(0, 50)
              }}...
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
// Vue의 반응형 변수와 axios, Pinia store import
import { ref } from "vue";
import axios from "axios";
import { useFavoriteStore } from "@/stores/useFavoriteStore";
import { useSearchHistoryStore } from "@/stores/useSearchHistoryStore";
import MovieModal from "./MovieModal.vue";

// Pinia 스토어 사용
const favoriteStore = useFavoriteStore();
const searchHistoryStore = useSearchHistoryStore();

const API_KEY = "5c0cb498f029c30c1ce9541978aa0271";

// 검색어, 영화목록, 로딩/에러/결과 상태 변수
const query = ref("");
const movies = ref([]);
const loading = ref(false);
const error = ref(null);
const showResults = ref(false);
const showSearchHistory = ref(false);
const searchInput = ref(null);
const selectedMovie = ref(null);

// 검색 기록 관련 함수들
const selectSearchTerm = (term) => {
  query.value = term;
  showSearchHistory.value = false;
  searchMovies();
};

const removeHistoryItem = (term) => {
  searchHistoryStore.removeSearchTerm(term);
};

const clearAllHistory = () => {
  searchHistoryStore.clearSearchHistory();
  showSearchHistory.value = false;
};

const hideSearchHistoryDelayed = () => {
  setTimeout(() => {
    showSearchHistory.value = false;
  }, 150);
};

// 영화 검색 함수
const searchMovies = async () => {
  if (!query.value.trim()) return;

  // 검색 기록에 추가
  searchHistoryStore.addSearchTerm(query.value.trim());
  showSearchHistory.value = false;

  loading.value = true;
  error.value = null;
  movies.value = [];

  try {
    const response = await axios.get(
      "https://api.themoviedb.org/3/search/movie",
      {
        params: {
          api_key: API_KEY,
          query: query.value,
          language: "ko-KR",
        },
      }
    );

    movies.value = response.data.results;

    if (movies.value.length > 0) {
      console.log("첫 번째 영화 데이터:", movies.value[0]);
      console.log("사용 가능한 필드들:", Object.keys(movies.value[0]));
    }

    showResults.value = true;

    if (movies.value.length === 0) {
      error.value = "검색 결과가 없습니다.";
    }
  } catch (err) {
    error.value = "에러가 발생했습니다.";
  } finally {
    loading.value = false;
  }
};

// 영화 클릭 시 상세 정보 조회
const selectMovie = async (movieId) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}`,
      {
        params: {
          api_key: API_KEY,
          language: "ko-KR",
        },
      }
    );
    selectedMovie.value = response.data;
  } catch (err) {
    console.error("상세 정보를 불러오지 못했습니다.");
  }
};

// 검색 결과 닫기 함수
const clearSearch = () => {
  query.value = "";
  movies.value = [];
  showResults.value = false;
};
</script>

<style scoped>
.search-container {
  padding: 20px;
}

/* 검색 입력 섹션 */
.search-input-section {
  position: relative;
  display: inline-block;
}

/* 검색 입력창 스타일 */
.search-container input {
  padding: 8px;
  margin-right: 8px;
  width: 500px;
  border-radius: 10px;
  border: none;
  outline: none;
}

/* 검색 기록 드롭다운 */
.search-history-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  width: 500px;
  background: #1e1f2f;
  border: 1px solid #444;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  margin-top: 4px;
  max-height: 300px;
  overflow-y: auto;
}

/* 검색 기록 헤더 */
.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #444;
  color: #ffd600;
  font-size: 0.9rem;
  font-weight: bold;
}

.history-header .clear-all-btn {
  background: #ff4757;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 0.8rem;
  cursor: pointer;
  margin: 0;
}

.history-header .clear-all-btn:hover {
  background: #ff3742;
}

/* 검색 기록 아이템 */
.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
}

.history-item:hover {
  background: #2a2d3a;
}

.history-term {
  flex: 1;
  font-size: 0.9rem;
}

.history-item .remove-btn {
  background: none;
  border: none;
  color: #ccc;
  cursor: pointer;
  padding: 4px;
  margin: 0;
  font-size: 12px;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.history-item .remove-btn:hover {
  opacity: 1;
  color: #ff4757;
}

/* 기본 버튼 스타일 */
button {
  padding: 6px 10px;
  margin-top: 6px;
  cursor: pointer;
  background-color: #444;
  color: white;
  border: none;
  border-radius: 6px;
}

/* 검색 결과 오버레이 스타일 */
.search-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #121321;
  overflow-y: auto;
  padding: 20px;
  z-index: 999;
}

/* 닫기 버튼 스타일 */
.close-button {
  position: absolute;
  top: 20px;
  right: 30px;
  font-size: 20px;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
}

/* 영화 카드 그리드 */
.movie-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 20px;
}

/* 개별 영화 카드 스타일 */
.movie-card {
  background: #1e1f2f;
  color: white;
  border-radius: 12px;
  width: 200px;
  overflow: hidden;
  box-sizing: border-box;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.movie-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(255, 214, 0, 0.2);
}

/* 포스터 컨테이너 */
.poster-container {
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
}

/* 영화 포스터 이미지 */
.poster-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.movie-card:hover .poster-image {
  transform: scale(1.05);
}

.no-poster {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #333;
  font-size: 2rem;
}

/* 찜하기 버튼 */
.favorite-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
  background: rgba(0, 0, 0, 0.7);
  color: #ffd600;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.favorite-btn:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: scale(1.1);
}

/* 평점 배지 */
.rating-badge {
  position: absolute;
  bottom: 8px;
  left: 8px;
  background: rgba(0, 0, 0, 0.8);
  color: #ffd600;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
  backdrop-filter: blur(4px);
}

/* 영화 정보 */
.movie-info {
  padding: 15px;
}

.movie-title {
  color: #ffd600;
  font-size: 1rem;
  font-weight: bold;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.release-date {
  color: #ccc;
  font-size: 0.8rem;
  margin: 0 0 8px 0;
}

.overview {
  color: #aaa;
  font-size: 0.8rem;
  line-height: 1.4;
  margin: 0;
}

/* 에러 메시지 스타일 */
.error-message {
  margin-top: 20px;
  color: #ff6b6b;
  font-weight: bold;
}
</style>

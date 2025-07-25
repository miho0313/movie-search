<template>
  <div class="ranking-section">
    <h2>인기 영화 순위</h2>

    <div v-if="loading" class="loading">로딩 중...</div>
    <div v-else-if="error">{{ error }}</div>

    <div class="scroll-container">
      <!-- 왼쪽 화살표 버튼 -->
      <button class="arrow left" @click="scrollLeft">◀</button>

      <!-- 영화 목록 스크롤 영역 -->
      <div class="movie-scroll-wrapper" ref="scrollWrapper">
        <div class="movie-scroll-track">
          <!-- 인기 영화 목록 반복 렌더링 -->
          <div
            v-for="(movie, index) in movies"
            :key="movie.id"
            class="movie-card"
            @click="selectMovie(movie.id)"
          >
            <div class="rank-badge">#{{ index + 1 }}</div>

            <img
              v-if="movie.poster_path"
              :src="`https://image.tmdb.org/t/p/w300${movie.poster_path}`"
              alt="포스터"
            />

            <div class="rating">⭐ {{ movie.vote_average.toFixed(1) }}</div>
            <!-- 찜 버튼 추가 -->
            <button
              @click.stop="favoriteStore.toggleFavorite(movie)"
              style="
                position: absolute;
                top: 8px;
                right: 8px;
                z-index: 3;
                background: rgba(0, 0, 0, 0.5);
                color: #ffd600;
                border: none;
                border-radius: 50%;
                width: 32px;
                height: 32px;
                font-size: 18px;
                cursor: pointer;
              "
              :aria-label="
                favoriteStore.isFavorite(movie) ? '찜 해제' : '찜하기'
              "
            >
              {{ favoriteStore.isFavorite(movie) ? "💖" : "🤍" }}
            </button>
          </div>
        </div>
      </div>

      <!-- 오른쪽 화살표 버튼 -->
      <button class="arrow right" @click="scrollRight">▶</button>
    </div>

    <!-- 선택된 영화의 상세 정보를 보여주는 모달 -->
    <MovieModal
      v-if="selectedMovie"
      :movie="selectedMovie"
      @close="selectedMovie = null"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import MovieModal from "./MovieModal.vue";
import { useFavoriteStore } from "@/stores/useFavoriteStore"; // 추가

const favoriteStore = useFavoriteStore(); // 추가

// TMDB API 키
const API_KEY = "5c0cb498f029c30c1ce9541978aa0271";

// 상태 변수
const movies = ref([]);
const loading = ref(true);
const error = ref(null);
const selectedMovie = ref(null);
const scrollWrapper = ref(null);

// 인기 영화 불러오기
const fetchPopularMovies = async () => {
  try {
    const res = await axios.get("https://api.themoviedb.org/3/movie/popular", {
      params: {
        api_key: API_KEY,
        language: "ko-KR",
      },
    });
    movies.value = res.data.results;
  } catch (err) {
    error.value = "인기 영화를 불러오는 데 실패했습니다.";
  } finally {
    loading.value = false;
  }
};

// 영화 클릭 시 상세 정보 조회
const selectMovie = async (movieId) => {
  try {
    const res = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}`,
      {
        params: {
          api_key: API_KEY,
          language: "ko-KR",
        },
      }
    );
    selectedMovie.value = res.data;
  } catch (err) {
    console.error("상세 정보를 불러오지 못했습니다.");
  }
};

// 좌측 스크롤
const scrollLeft = () => {
  scrollWrapper.value.scrollBy({ left: -1030, behavior: "smooth" });
};

// 우측 스크롤
const scrollRight = () => {
  scrollWrapper.value.scrollBy({ left: 1030, behavior: "smooth" });
};

onMounted(() => {
  fetchPopularMovies();
});
</script>

<style scoped>
/* 전체 섹션 컨테이너 */
.ranking-section {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden;
}

/* 영화 스크롤 전체 컨테이너 */
.scroll-container {
  position: relative;
  display: flex;
  align-items: center;
}

/* 스크롤 화살표 버튼 */
.arrow {
  position: relative;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 25px;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.arrow:hover {
  background-color: rgba(255, 255, 255, 0.2);
}
.arrow.left {
  margin-right: 10px;
}
.arrow.right {
  margin-left: 10px;
}

/* 스크롤 가능한 래퍼 */
.movie-scroll-wrapper {
  max-width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.movie-scroll-wrapper::-webkit-scrollbar {
  display: none;
}

/* 영화 카드들을 가로로 나열 */
.movie-scroll-track {
  display: flex;
  flex-wrap: nowrap;
  gap: 16px;
  padding: 10px 0;
  min-width: max-content;
}

/* 개별 영화 카드 */
.movie-card {
  position: relative;
  flex: none;
  width: 160px;
  height: 240px;
  border-radius: 10px;
  overflow: hidden;
  background-color: #1e1f2f;
  transition: transform 0.3s;
  cursor: pointer;
}
.movie-card:hover {
  transform: scale(1.05);
}

.movie-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 10px;
}

/* 순위 표시 뱃지 */
.rank-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background-color: gold;
  color: black;
  font-weight: bold;
  font-size: 13px;
  padding: 2px 6px;
  border-radius: 6px;
  z-index: 2;
}

/* 별점 표시 */
.rating {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 13px;
  padding: 2px 6px;
  border-radius: 6px;
  z-index: 2;
}
</style>

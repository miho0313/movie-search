<template>
  <div class="modal-backdrop" @click.self="emit('close')">
    <div class="modal-content">
      <button class="close-button" @click="emit('close')">✖</button>

      <!-- 모달 헤더 영역 -->
      <div class="modal-header">
        <!-- 영화 포스터 -->
        <div class="poster-section">
          <img
            v-if="movie.poster_path"
            :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
            :alt="movie.title"
            class="modal-poster"
          />
          <div v-else class="no-poster">🎬</div>
        </div>

        <!-- 영화 기본 정보 -->
        <div class="info-section">
          <h1 class="movie-title">{{ movie.title }}</h1>
          <p v-if="movie.original_title !== movie.title" class="original-title">
            {{ movie.original_title }}
          </p>

          <!-- 평점과 기본 정보 -->
          <div class="rating-info">
            <div class="rating-badge">
              ⭐ {{ movie.vote_average?.toFixed(1) || "N/A" }}
              <span class="vote-count"
                >({{ movie.vote_count || 0 }}명 평가)</span
              >
            </div>
            <div class="popularity-badge">
              🔥 인기도 {{ Math.round(movie.popularity) }}
            </div>
          </div>

          <!-- 상세 정보 그리드 -->
          <div class="details-grid">
            <div class="detail-item">
              <span class="label">개봉일</span>
              <span class="value">{{ formatDate(movie.release_date) }}</span>
            </div>
            <div class="detail-item" v-if="movie.runtime">
              <span class="label">러닝타임</span>
              <span class="value">{{ movie.runtime }}분</span>
            </div>
            <div class="detail-item" v-if="movie.genres && movie.genres.length">
              <span class="label">장르</span>
              <span class="value">{{
                movie.genres.map((g) => g.name).join(", ")
              }}</span>
            </div>
            <div class="detail-item" v-if="movie.budget && movie.budget > 0">
              <span class="label">제작비</span>
              <span class="value">${{ formatBudget(movie.budget) }}</span>
            </div>
            <div class="detail-item" v-if="movie.revenue && movie.revenue > 0">
              <span class="label">박스오피스</span>
              <span class="value">${{ formatBudget(movie.revenue) }}</span>
            </div>
            <div class="detail-item" v-if="movie.status">
              <span class="label">상태</span>
              <span class="value">{{ getStatusText(movie.status) }}</span>
            </div>
          </div>

          <!-- 찜하기 버튼 -->
          <div class="action-buttons">
            <button
              @click="toggleFavorite"
              :class="['favorite-btn', { favorited: isFavorite }]"
            >
              {{ isFavorite ? "💖 찜 해제" : "🤍 찜하기" }}
            </button>
          </div>
        </div>
      </div>

      <!-- 줄거리 섹션 -->
      <div class="overview-section" v-if="movie.overview">
        <h3>줄거리</h3>
        <p class="overview-text">{{ movie.overview }}</p>
      </div>

      <!-- 추가 정보 섹션 -->
      <div
        class="additional-info"
        v-if="movie.production_companies || movie.production_countries"
      >
        <div
          v-if="movie.production_companies && movie.production_companies.length"
          class="production-section"
        >
          <h4>제작사</h4>
          <div class="production-companies">
            <span
              v-for="company in movie.production_companies.slice(0, 3)"
              :key="company.id"
              class="company-tag"
            >
              {{ company.name }}
            </span>
          </div>
        </div>

        <div
          v-if="movie.production_countries && movie.production_countries.length"
          class="countries-section"
        >
          <h4>제작국가</h4>
          <div class="countries">
            <span
              v-for="country in movie.production_countries"
              :key="country.iso_3166_1"
              class="country-flag"
            >
              {{ country.name }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useFavoriteStore } from "@/stores/useFavoriteStore";

// Props와 Emits 정의
// eslint-disable-next-line no-undef
const props = defineProps({
  movie: {
    type: Object,
    required: true,
  },
});
// eslint-disable-next-line no-undef
const emit = defineEmits(["close"]);

// 찜 기능
const favoriteStore = useFavoriteStore();
const isFavorite = computed(() => favoriteStore.isFavorite(props.movie));

const toggleFavorite = () => {
  favoriteStore.toggleFavorite(props.movie);
};

// 유틸리티 함수들
const formatDate = (dateString) => {
  if (!dateString) return "개봉일 미정";
  const date = new Date(dateString);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
};

const formatBudget = (amount) => {
  if (amount >= 1000000000) {
    return (amount / 1000000000).toFixed(1) + "억";
  } else if (amount >= 1000000) {
    return (amount / 1000000).toFixed(1) + "백만";
  } else if (amount >= 1000) {
    return (amount / 1000).toFixed(1) + "천";
  }
  return amount.toString();
};

const getStatusText = (status) => {
  const statusMap = {
    Released: "개봉",
    "Post Production": "후반작업",
    "In Production": "제작중",
    Planned: "기획중",
    Rumored: "소문",
    Canceled: "취소됨",
  };
  return statusMap[status] || status;
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  backdrop-filter: blur(8px);
}

.modal-content {
  background: linear-gradient(135deg, #1e1f2f 0%, #2a2d3a 100%);
  color: white;
  border-radius: 20px;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1);
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.close-button {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  background: rgba(255, 0, 0, 0.2);
  border-color: rgba(255, 0, 0, 0.5);
  transform: scale(1.1);
}

/* 모달 헤더 */
.modal-header {
  display: flex;
  gap: 30px;
  padding: 30px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.poster-section {
  flex-shrink: 0;
}

.modal-poster {
  width: 200px;
  height: 300px;
  object-fit: cover;
  border-radius: 15px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
}

.no-poster {
  width: 200px;
  height: 300px;
  background: #333;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
}

.info-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.movie-title {
  font-size: 2.2rem;
  margin: 0;
  color: #ffd600;
  font-weight: bold;
  line-height: 1.2;
}

.original-title {
  color: #ccc;
  font-style: italic;
  margin: 0;
  font-size: 1.1rem;
}

/* 평점 정보 */
.rating-info {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.rating-badge {
  background: linear-gradient(135deg, #ffd600, #ff8c00);
  color: #000;
  padding: 8px 16px;
  border-radius: 25px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 5px;
}

.vote-count {
  font-size: 0.8rem;
  opacity: 0.8;
}

.popularity-badge {
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
  color: white;
  padding: 8px 16px;
  border-radius: 25px;
  font-weight: bold;
}

/* 상세 정보 그리드 */
.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.label {
  color: #ffd600;
  font-weight: bold;
}

.value {
  color: #fff;
  text-align: right;
}

/* 액션 버튼 */
.action-buttons {
  margin-top: 20px;
}

.favorite-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.favorite-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.favorite-btn.favorited {
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
}

.favorite-btn.favorited:hover {
  box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
}

/* 줄거리 섹션 */
.overview-section {
  padding: 30px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.overview-section h3 {
  color: #ffd600;
  margin: 0 0 15px 0;
  font-size: 1.3rem;
}

.overview-text {
  line-height: 1.7;
  color: #e0e0e0;
  margin: 0;
  font-size: 1rem;
}

/* 추가 정보 */
.additional-info {
  padding: 30px;
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
}

.production-section,
.countries-section {
  flex: 1;
  min-width: 200px;
}

.additional-info h4 {
  color: #ffd600;
  margin: 0 0 15px 0;
  font-size: 1.1rem;
}

.production-companies,
.countries {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.company-tag,
.country-flag {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    margin: 20px;
  }

  .modal-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 20px;
  }

  .modal-poster {
    width: 150px;
    height: 225px;
  }

  .movie-title {
    font-size: 1.8rem;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }

  .additional-info {
    flex-direction: column;
    padding: 20px;
  }
}

/* 스크롤바 스타일 */
.modal-content::-webkit-scrollbar {
  width: 8px;
}

.modal-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.modal-content::-webkit-scrollbar-thumb {
  background: rgba(255, 214, 0, 0.5);
  border-radius: 4px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 214, 0, 0.7);
}
</style>

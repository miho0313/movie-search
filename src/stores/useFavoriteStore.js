import { defineStore } from "pinia";
import { ref, watch } from "vue";

// Pinia 전역 스토어 정의: 'favorite'이라는 이름으로 사용
export const useFavoriteStore = defineStore("favorite", () => {
  const FAVORITE_KEY = "favoriteMovies"; // localStorage에 저장할 키 이름
  const favorites = ref([]); // 찜한 영화 목록(반응형 배열)

  // favorites 배열이 변경될 때마다 localStorage에 자동 저장
  watch(
    favorites,
    (newVal) => {
      localStorage.setItem(FAVORITE_KEY, JSON.stringify(newVal));
    },
    { deep: true }
  );

  // 앱 시작 시 localStorage에서 찜 목록 불러오기
  const loadFavorites = () => {
    const stored = localStorage.getItem(FAVORITE_KEY);
    if (stored) {
      favorites.value = JSON.parse(stored);
    }
  };

  // 해당 영화가 찜 목록에 있는지 확인
  const isFavorite = (movie) => {
    return favorites.value.some((m) => m.id === movie.id);
  };

  // 찜/찜 해제 토글 함수
  const toggleFavorite = (movie) => {
    if (isFavorite(movie)) {
      // 이미 찜한 경우: 목록에서 제거
      favorites.value = favorites.value.filter((m) => m.id !== movie.id);
    } else {
      // 찜하지 않은 경우: 목록에 추가
      favorites.value.push(movie);
    }
  };

  loadFavorites(); // 스토어 생성 시 localStorage에서 초기값 불러오기

  // 컴포넌트에서 사용할 상태와 함수 반환
  return {
    favorites, // 찜한 영화 목록
    isFavorite, // 찜 여부 확인 함수
    toggleFavorite, // 찜 토글 함수
  };
});

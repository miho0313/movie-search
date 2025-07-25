import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useSearchHistoryStore = defineStore("searchHistory", () => {
  const SEARCH_HISTORY_KEY = "searchHistory";
  const MAX_HISTORY_COUNT = 10; // 최대 검색 기록 개수

  const searchHistory = ref([]);

  // searchHistory 배열이 변경될 때마다 localStorage에 자동 저장
  watch(
    searchHistory,
    (newVal) => {
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newVal));
    },
    { deep: true }
  );

  // 앱 시작 시 localStorage에서 검색 기록 불러오기
  const loadSearchHistory = () => {
    const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (stored) {
      searchHistory.value = JSON.parse(stored);
    }
  };

  // 검색어 추가 (중복 제거 및 최신순 정렬)
  const addSearchTerm = (term) => {
    if (!term || term.trim() === "") return;

    const trimmedTerm = term.trim();

    // 기존에 있는 검색어면 제거 (최신으로 올리기 위해)
    searchHistory.value = searchHistory.value.filter(
      (item) => item !== trimmedTerm
    );

    // 맨 앞에 추가
    searchHistory.value.unshift(trimmedTerm);

    // 최대 개수 제한
    if (searchHistory.value.length > MAX_HISTORY_COUNT) {
      searchHistory.value = searchHistory.value.slice(0, MAX_HISTORY_COUNT);
    }
  };

  // 특정 검색어 삭제
  const removeSearchTerm = (term) => {
    searchHistory.value = searchHistory.value.filter((item) => item !== term);
  };

  // 전체 검색 기록 삭제
  const clearSearchHistory = () => {
    searchHistory.value = [];
  };

  // 스토어 생성 시 localStorage에서 초기값 불러오기
  loadSearchHistory();

  return {
    searchHistory,
    addSearchTerm,
    removeSearchTerm,
    clearSearchHistory,
  };
});

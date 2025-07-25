import { createApp } from "vue"; // Vue 애플리케이션 생성 함수 import
import App from "./App.vue"; // 최상위 App 컴포넌트 import
import { createPinia } from "pinia"; // Pinia(상태관리) 생성 함수 import

const app = createApp(App); // Vue 앱 인스턴스 생성
const pinia = createPinia(); // Pinia 인스턴스 생성

app.use(pinia); // Pinia를 전역 상태관리로 등록
app.mount("#app"); // #app 엘리먼트에 Vue 앱

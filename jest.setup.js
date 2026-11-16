// Jest는 .env를 읽지 않는다. 단위 테스트는 실제 서버를 부르지 않으므로 가짜 주소로 채운다
process.env.EXPO_PUBLIC_API_BASE_URL = "https://api.test";

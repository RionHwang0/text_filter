/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',  // 정적 파일로 export
  distDir: 'out',   // 빌드 디렉토리 설정
  images: {
    unoptimized: true, // 정적 내보내기에 필요
  },
  // basePath를 레포지토리 이름으로 설정 (GitHub Pages에 배포할 경우 필요)
  basePath: process.env.NODE_ENV === 'production' ? '/text_filter' : '',
  trailingSlash: true, // GitHub Pages에 배포할 때 유용
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // 브라우저에서 사용할 수 없는 모듈을 빈 객체로 처리
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig 
# 전예지 — AI Engineer

사이트: https://yeji2021.github.io/

이 `source` 브랜치는 포트폴리오의 수정 가능한 원본입니다. `main` 브랜치에는 GitHub Pages에서 제공하는 정적 파일이 있습니다.

## 실행 및 빌드

Node.js 22.13 이상에서:

```sh
npm ci
npm run dev
npm run build
```

빌드 결과는 `out/`에 생성됩니다. 결과를 `main` 브랜치 루트에 복사하고 `.nojekyll` 파일을 유지해 게시합니다.

## 내용 수정

- `content/profile.json`: 프로필과 소개
- `content/projects/*.json`: 프로젝트 설명과 연구 자료
- `content/awards.json`: 수상 실적
- `content/publications.json`: 논문
- `app/`: 화면과 상호작용
- `public/images/`: 이미지

프로젝트 직접 링크는 `/#project=open-vocabulary` 형식입니다.

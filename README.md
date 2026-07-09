# Ôn tập Công nghệ Cơ khí Cơ bản

Web ôn tập trắc nghiệm môn Công nghệ Cơ khí Cơ bản - ĐHBK Hà Nội

## Deploy lên Vercel

1. Push folder này lên GitHub:
```bash
cd ckquiz
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/ckquiz.git
git push -u origin main
```

2. Vào https://vercel.com → Import repo → Deploy

Vercel sẽ tự detect Vite và build.

## Dev local

```bash
npm install
npm run dev
```

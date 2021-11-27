# npm install
# npm install -g typescript
npm run build
mv build/* src/server/public/*
tsc -t es5 src/server/app.ts
npm run start-server
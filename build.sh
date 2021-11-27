# npm install
# npm install -g typescript
npm run build
rm -r src/server/public
mkdir src/server/public/
mv build/* src/server/public/
tsc -t es5 src/server/app.ts
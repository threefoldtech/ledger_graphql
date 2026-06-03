set -e

npm run build
docker-compose down
npm run db:up
sleep 2
npm run process
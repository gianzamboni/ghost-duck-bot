npm install
npm run build
docker build -t ghost-bot .
docker container stop ghost-bot
docker container rm ghost-bot
docker run --network="host" --restart unless-stopped -v ~/repos/media/ghost-bot:/app/static --name ghost-bot ghost-bot
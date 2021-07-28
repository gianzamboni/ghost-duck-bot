docker build -t ghost-bot .
docker container stop ghost-bot
docker container rm ghost-bot
docker run --network="host" --restart unless-stopped -v /home/gian/Documents/ghost-duck-bot/bot/static:/app/static --name ghost-bot ghost-bot
# syntax=docker/dockerfile:1

FROM node:15.13.0
ENV NODE_ENV=production
WORKDIR /app
COPY ["package.json", "package-lock.json",".env.prod.json", "./"]
RUN npm install --production
COPY build ./build
CMD ["npm", "run", "start"]
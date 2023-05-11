FROM node:14-alpine
WORKDIR /app
COPY ./server/package*.json ./
RUN npm install
COPY ./server/ .
COPY ./client/build/ ./public/
VOLUME ["/app/videos"]
EXPOSE 3000
CMD ["npm", "start"]
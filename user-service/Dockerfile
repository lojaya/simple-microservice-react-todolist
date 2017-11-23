FROM node:alpine
WORKDIR /usr/local/user-service
COPY . .
RUN npm install
EXPOSE 3001
CMD ["npm","run","prod"]
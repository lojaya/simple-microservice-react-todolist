FROM node:alpine
WORKDIR /usr/local/todo-service
COPY . .
RUN npm install
EXPOSE 3002
CMD ["npm","run","prod"]
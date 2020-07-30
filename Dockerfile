# BASE
FROM node:14.6-slim 
RUN mkdir /app && chown -R node:node /app
WORKDIR /app
USER node
COPY . . 
RUN npm install
CMD ["node", "src/"]
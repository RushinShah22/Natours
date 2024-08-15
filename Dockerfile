FROM node

WORKDIR /usr/natours
ENV NODE_ENV=production
ENV PORT=80
COPY . .

RUN npm install

CMD ["node", "server.js"]
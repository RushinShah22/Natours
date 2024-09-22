FROM node

RUN npm install --global nodemon
WORKDIR /usr/natours
ENV NODE_ENV=production
ENV PORT=80
EXPOSE 80
COPY . .

RUN npm install

CMD ["npm", "start"]
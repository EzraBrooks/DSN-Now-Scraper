FROM node:8
WORKDIR /app
ADD . /app
RUN npm install --silent
CMD ["npm", "run", "start"]
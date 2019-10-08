FROM mhart/alpine-node:11
WORKDIR /usr/src
COPY package.json package-lock.json /usr/src/
RUN npm i --production
RUN npm i -g now
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

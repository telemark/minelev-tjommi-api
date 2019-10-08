FROM mhart/alpine-node:11 as base
WORKDIR /usr/src
COPY package.json package-lock.json /usr/src/
RUN npm i --production
RUN npm i now
COPY . .

FROM mhart/alpine-node:base-11
WORKDIR /usr/src
COPY --from=base /usr/src .
CMD ["now", "dev"]

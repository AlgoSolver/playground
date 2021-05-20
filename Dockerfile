# pull official base image
FROM alpine

# install node
RUN apk add --update nodejs nodejs-npm g++

# set working directory
RUN mkdir -p /app
WORKDIR /app

# install app dependencies
COPY package*.json ./
RUN npm install

# add app
COPY . ./

# listener port at runtime
EXPOSE 3000

# start app
CMD ["node", "index.js"]
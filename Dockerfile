# pull official base image
FROM ubuntu

# install node
RUN apt update && apt install nodejs && apt install npm

#install c++
RUN apt update && apt install g++

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
# pull official base image
FROM ubuntu

# install node
RUN apt update && apt install -y nodejs && apt install -y npm

#install c++
RUN apt update && apt install -y g++

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
FROM node:16.16.0-alpine

# Create directory in container image for app code
RUN mkdir -p /usr/src/app

# set working directory
WORKDIR /usr/src/app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app
RUN npm install
RUN npm install react-scripts@4.0.3 -g

# add app
COPY . /usr/src/app/

# start app
CMD ["npm", "start"]
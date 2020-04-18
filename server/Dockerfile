FROM node:10.18

WORKDIR /app

# install nodejs dependencies
COPY package.json /app
RUN npm install

# starting service
ADD ./ .
EXPOSE 3000
CMD [ "npm", "start" ]

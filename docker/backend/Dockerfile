FROM node

# Install dependencies
# RUN npm init

WORKDIR /usr/app/

RUN npm update
RUN npm fund
RUN npm install dotenv
RUN npm install express
RUN npm install mysql
RUN npm install cors
RUN npm install https
RUN npm install http
RUN npm install fs
RUN npm install node-telegram-bot-api
RUN npm install --global nodemon

EXPOSE 3001

# Start application
CMD [ "npm", "start" ]
FROM node:16 AS build
WORKDIR /app
RUN git clone https://github.com/echoedinvoker/record.git .
RUN npm install
RUN npm run build

FROM nginx:latest
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80

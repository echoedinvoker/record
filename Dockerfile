FROM node:18 AS build
WORKDIR /app
RUN git clone https://github.com/echoedinvoker/record.git .
RUN npm install
RUN CI=true npm run build || true

FROM nginx:latest
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80

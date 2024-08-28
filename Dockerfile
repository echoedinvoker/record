FROM node:18 AS build
WORKDIR /app
RUN git clone https://github.com/echoedinvoker/record.git .
RUN npm install
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM nginx:latest
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80

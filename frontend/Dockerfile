FROM node:12.22.9-alpine3.15 AS build_stage
RUN adduser -D react-app
WORKDIR /school-register-frontend
RUN chown -R react-app ./
USER react-app
COPY package*.json ./
RUN npm install --silent
ARG backend_url=http://127.0.0.1:3000
ENV REACT_APP_BACKEND_URL=${backend_url}
COPY . ./
RUN npm run build

FROM node:12.22.9-alpine3.15 as production
RUN adduser -D react-app
WORKDIR /school-register-frontend
RUN chown -R react-app ./
USER react-app
ARG profile=production
ENV NODE_ENV=${profile}
RUN npm install serve
COPY --from=build_stage /school-register-frontend/build ./build
CMD npx serve -s build --listen ${PORT}
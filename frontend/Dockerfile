FROM node:12.22.9-alpine3.15 AS build_stage
WORKDIR /school-register-frontend
COPY package*.json ./
RUN npm install --silent
COPY . ./
RUN npm run build

FROM node:12.22.9-alpine3.15 as production
ARG profile=production
ENV NODE_ENV=${profile}
WORKDIR /school-register-frontend
RUN npm install -g serve
COPY --from=build_stage /school-register-frontend/build ./build
CMD serve -s build --listen ${SERVER_PORT}
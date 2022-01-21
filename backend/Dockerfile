FROM node:16.13.2-alpine3.15 AS build_stage
WORKDIR /school-register-backend
COPY package.json ./
COPY yarn.lock ./
RUN yarn install
COPY . ./
RUN yarn build

FROM node:16.13.2-alpine3.15 as production
ARG profile=production
ENV NODE_ENV=${profile}
WORKDIR /school-register-backend
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --production
COPY --from=build_stage /school-register-backend/dist ./dist
CMD ["node", "dist/main"]
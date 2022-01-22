FROM node:16.13.2-alpine3.15 AS build_stage
RUN adduser -D nest-app
WORKDIR /school-register-backend
RUN chown -R nest-app ./
USER nest-app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install
COPY . ./
RUN yarn build

FROM node:16.13.2-alpine3.15 as production
RUN adduser -D nest-app
WORKDIR /school-register-backend
RUN chown -R nest-app ./
USER nest-app
ARG profile=production
ENV NODE_ENV=${profile}
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --production
COPY --from=build_stage /school-register-backend/dist ./dist
CMD ["node", "dist/main"]
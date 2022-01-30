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
RUN apk add --no-cache python3 py3-pip
RUN apk --update add build-base jpeg-dev zlib-dev libjpeg\
    gettext\
    py3-lxml\
    py3-pillow\
    python3-dev\
    && rm -rf /var/cache/apk/*
RUN adduser -D nest-app
WORKDIR /school-register-backend/pdf_reports_generator
COPY ./pdf_reports_generator .
RUN chown -R nest-app ../
USER nest-app
RUN pip3 install --no-cache --upgrade setuptools
RUN pip3 install -r requirements.txt
WORKDIR /school-register-backend
ARG profile=production
ENV NODE_ENV=${profile}
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --production
COPY --from=build_stage /school-register-backend/dist ./dist
CMD ["node", "dist/main"]
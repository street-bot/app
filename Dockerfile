FROM node:14-alpine AS build

ARG GIT_SHA
ENV REACT_APP_SHA1=${GIT_SHA}

COPY ./ ./

RUN yarn install --frozen-lockfile && yarn run build

#---------------------------------------------------------------
FROM nginx:stable-alpine

COPY --from=build ./build /var/www 
COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf
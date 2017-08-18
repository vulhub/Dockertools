FROM node:8.4

MAINTAINER phithon <root@leavesongs.com>

ENV LC_ALL C.UTF-8
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY ./web/ /usr/src/web/

RUN set -ex \
    && apt-get update \
    && cd /usr/src/web \
    && npm install

EXPOSE 3000

WORKDIR /usr/src

CMD ["node", "app"]

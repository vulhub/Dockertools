FROM node:4.3.2

MAINTAINER phithon <root@leavesongs.com>

ENV LC_ALL C.UTF-8
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY ./web/ /usr/src/web/
COPY docker-entrypoint.sh /docker-entrypoint.sh

RUN set -ex \
    && chmod +x /docker-entrypoint.sh \
    && apt-get update \
    && cd /usr/src/web \
    && npm install

EXPOSE 3000

WORKDIR /usr/src/web

ENTRYPOINT ["/docker-entrypoint.sh"]

CMD ["node", "app"]

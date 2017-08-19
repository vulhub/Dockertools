FROM node:4.3.2

MAINTAINER phithon <root@leavesongs.com>

ENV LC_ALL C.UTF-8
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY docker-entrypoint.sh /docker-entrypoint.sh

RUN set -ex \
    && chmod +x /docker-entrypoint.sh \
    && apt-get update \
    && apt-get install -y --no-install-recommends wget libkrb5-dev \
    && wget https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh -O /usr/bin/wait-for-it.sh \
    && chmod +x /usr/bin/wait-for-it.sh

EXPOSE 3000

WORKDIR /usr/src

ENTRYPOINT ["/docker-entrypoint.sh"]

CMD ["node", "app"]

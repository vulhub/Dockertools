FROM mongo:3.4

MAINTAINER phithon <root@leavesongs.com>

ENV LC_ALL C.UTF-8
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY database/ /tmp/

COPY database/db.conf /etc/mongod.conf

RUN cd /tmp/database/ \
    && mongorestore \
    && cd / \
    && rm -rf /tmp/database

CMD ["mongod", "-f", "/etc/mongod.conf"]
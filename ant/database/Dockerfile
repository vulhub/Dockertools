FROM mongo:3.4

MAINTAINER phithon <root@leavesongs.com>

ENV LC_ALL C.UTF-8
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY ./database/ /tmp/database/
COPY ./database/db.conf /etc/mongod.conf
COPY ./init.sh /docker-entrypoint-initdb.d/init.sh
    
CMD ["mongod", "-f", "/etc/mongod.conf"]
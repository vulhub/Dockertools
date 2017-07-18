FROM golang:1.8-alpine as builder
WORKDIR /go/src/app
RUN apk update \
    && apk add -f git \
    && git clone https://github.com/OJ/gobuster.git \
    && cd gobuster \
    && go-wrapper download \
    && go-wrapper install

FROM alpine:latest
MAINTAINER phithon <root@leavesongs.com>
COPY --from=builder /go/bin/gobuster /usr/bin/
ENTRYPOINT ["gobuster"]
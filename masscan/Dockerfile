FROM debian:jessie as builder
RUN set -ex \
    && apt-get update \
    && apt-get install -y gcc make git libpcap-dev \
    && cd /usr/local \
    && git clone https://github.com/robertdavidgraham/masscan \
    && cd masscan \
    && make

FROM debian:jessie
MAINTAINER phithon <root@leavesongs.com>
RUN apt-get update \
    && apt-get install --no-install-recommends -y libpcap-dev \
    && rm -rf /var/lib/apt/lists/*
COPY --from=builder /usr/local/masscan/bin/masscan /usr/bin/
ENTRYPOINT ["masscan"]
# Masscan - Mass IP port scanner

This is the fastest Internet port scanner. It can scan the entire Internet in under 6 minutes, transmitting 10 million packets per second.

Repository site: https://github.com/robertdavidgraham/masscan

## Usage

```
docker run --rm -it vulhub/masscan -p0-65535 --rate=10000 targetip
```

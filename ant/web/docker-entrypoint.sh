#!/bin/bash

set -ex

wait-for-it.sh db:27017 -t 30 -- echo "Success to connect to mongodb..."

exec "$@"

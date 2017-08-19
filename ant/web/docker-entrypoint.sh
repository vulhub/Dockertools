#!/bin/bash

set -ex

while true; do
    if mongo --host $DB_HOST --port $DB_PORT --eval 'quit(0)' &> /dev/null; then
        # success!
        break
    fi
    echo "Waiting for connect to mongodb..." ;;
    sleep 1
done

exec "$@"

#!/bin/sh
set -e

cd /home/container

su-exec node node deploy-commands.js

exec su-exec node node index.js

#!/bin/bash
set -e

host="$1"
shift
cmd="$@"

# Use "$host" as the hostname and "3306" as the port
until nc -z "$host" 3306; do
  echo "MySQL is unavailable - sleeping"
  sleep 2
done

echo "MySQL is up - executing command"
exec $cmd

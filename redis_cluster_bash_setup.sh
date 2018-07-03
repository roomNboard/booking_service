#!/usr/bin/env bash

for ind in `seq 1 3`; do \
 docker run -d \
 -v $PWD/redis.conf:/usr/local/etc/redis/redis.conf \
 --name "redis-$ind" \
 --net red_cluster \
 redis redis-server /usr/local/etc/redis/redis.conf; \
done


echo 'yes' | docker run -i --rm --net red_cluster ruby sh -c '\
 gem install redis \
 && wget http://download.redis.io/redis-stable/src/redis-trib.rb \
 && ruby redis-trib.rb create \
 '"$(for ind in `seq 1 3`; do \
  echo "$(docker inspect -f \
  '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' \
  "redis-$ind")"':6379 '; \
  done)"

docker run -d \
 -v $PWD/redis.conf:/usr/local/etc/redis/redis.conf \
 --name "redis-3" \
 --net red_cluster \
 -p 6381:6381 \
 redis redis-server /usr/local/etc/redis/redis.conf;

 docker run -i --rm --net red_cluster ruby sh -c '\ 
 gem install redis \
 && wget http://download.redis.io/redis-stable/src/redis-trib.rb \
 && ruby redis-trib.rb create 172.19.0.2:6379 172.19.0.3:6380 172.19.0.4:6381
'
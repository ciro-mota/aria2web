FROM alpine:3.24

RUN apk add --no-cache aria2 busybox-extras

COPY www /www

COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh /www/cgi-bin/delete

EXPOSE 8080 6800

ENTRYPOINT ["/entrypoint.sh"]
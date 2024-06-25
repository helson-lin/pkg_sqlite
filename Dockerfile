FROM ubuntu:18.04
WORKDIR /app
CMD cp -r /files /app/tmp
EXPOSE 80
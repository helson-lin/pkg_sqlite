FROM ubuntu:18.04
COPY cp ./dist/docker_sync-node14-linux-x64 /app/
WORKDIR /app
CMD chmod +x docker_sync-node14-linux-x64
EXPOSE 80

ENTRYPOINT ["./docker_sync-node14-linux-x64"]
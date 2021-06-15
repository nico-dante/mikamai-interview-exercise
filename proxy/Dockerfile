FROM nginx:latest

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY cer/cert.pem /etc/ssl/nginx/cert.pem
COPY cer/key.pem /etc/ssl/nginx/key.pem

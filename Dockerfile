FROM node:18-alpine as builder

WORKDIR /app
COPY . .

# Build (if needed) - for now just copy files
RUN echo "Frontend ready"

FROM nginx:alpine

COPY --from=builder /app /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

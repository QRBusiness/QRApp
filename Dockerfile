# Bước 1: Build ứng dụng
FROM node:18 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

ARG VITE_SOCKET_URL
ENV VITE_SOCKET_URL=$VITE_SOCKET_URL

RUN npm run build

# Bước 2: Dùng Nginx để phục vụ
FROM nginx:stable-alpine

# Copy file cấu hình nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy file build từ bước trước vào nginx
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
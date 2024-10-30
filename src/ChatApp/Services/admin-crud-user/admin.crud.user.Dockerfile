FROM golang:alpine3.19  AS builder
WORKDIR /app

# Sao chép tệp go.mod và go.sum để tải xuống các phụ thuộc
COPY go.mod go.sum ./
RUN go mod download

# Sao chép mã nguồn vào hình ảnh
COPY . .

# Biên dịch ứng dụng
RUN CGO_ENABLED=0 GOOS=linux go build -o main ./src/main.go

# Bước 2: Tạo hình ảnh nhỏ hơn để chạy ứng dụng
FROM alpine:latest

# Cài đặt các gói cần thiết
RUN apk --no-cache add ca-certificates

# Sao chép tệp nhị phân từ bước builder
COPY --from=builder /app/main .

# Thiết lập lệnh mặc định để chạy ứng dụng
CMD ["./main"]
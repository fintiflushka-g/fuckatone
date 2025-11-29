# Build stage
FROM golang:1.25 AS builder

WORKDIR /app

# Копируем зависимости и качаем их
COPY messages-service/go.mod messages-service/go.sum ./messages-service/
WORKDIR /app/messages-service
RUN go mod download

# Копируем весь код
COPY messages-service ./ 

# Собираем бинарник
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /app/bin/messages-service ./cmd

# Runtime stage
FROM gcr.io/distroless/base-debian12

WORKDIR /app/messages-service

# Копируем бинарник
COPY --from=builder /app/bin/messages-service .

# Копируем конфиги
COPY messages-service/configs ./configs

EXPOSE 8080

ENTRYPOINT ["/app/messages-service/messages-service"]

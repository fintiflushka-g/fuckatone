package main

import (
	"log/slog"
	"net/http"
	"os"

	"messages-service/internal/config"
	"messages-service/internal/messages"
	"messages-service/internal/storage"
	"messages-service/internal/storage/postgresql"
	messageshttp "messages-service/internal/transport/http/messages"
)

func main() {
	cfg := config.MustLoad()

	log := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	log.Info("starting app", slog.String("env", cfg.Env))

	dbStorage, err := postgresql.New(cfg.PostgreSQL)
	if err != nil {
		panic(err)
	}
	defer func() {
		if err := dbStorage.Close(); err != nil {
			log.Warn("failed to close postgresql connection", slog.Any("error", err))
		}
	}()

	repo := storage.NewMessagesRepo(dbStorage.DB)

	messagesService := messages.NewService(repo, log)

	handler := messageshttp.New(messagesService, log)

	mux := http.NewServeMux()
	handler.Register(mux)

	server := &http.Server{
		Addr:    cfg.HTTPServer.Address,
		Handler: mux,
	}

	log.Info("listening http", slog.String("address", cfg.HTTPServer.Address))

	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Error("http server error", slog.Any("error", err))
	}
}

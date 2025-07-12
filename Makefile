build:
	@IP_HOST=$$(ip route get 1.1.1.1 | awk '{print $$7; exit}'); \
	docker build \
		--build-arg VITE_API_URL=http://$$IP_HOST:8000 \
		--build-arg VITE_SOCKET_URL=ws://$$IP_HOST:8000/ws \
		-t nhathuyd4hp/qrapp-frontend .
push:
	docker push nhathuyd4hp/qrapp-frontend
run:
	docker compose up -d
deploy: build push run

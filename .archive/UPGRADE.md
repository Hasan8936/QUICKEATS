Upgrade summary - Socket scaling and deployment

Summary:
- Enabled socket.io Redis adapter in `src/lib/realtime.ts` (uses REDIS_URL).
- Made `initializeRealtime` async and updated `server.js` to await it.
- Added `start:server` and `loadtest` scripts to `package.json`.
- Added `socket` service to `docker-compose.yml` to run realtime server with Redis.
- Added `loadtest.yml` (Artillery) for basic load testing.

Run locally (Docker):

1. Start infra (Postgres/Mongo/Redis):

```powershell
cd QUICKEATS
docker-compose up -d
```

2. Install dependencies and start Next.js server (dev):

```powershell
npm install
npm run dev
```

3. Start the realtime/socket server (separate process):

```powershell
npm run start:server
# or via docker-compose: docker-compose up socket
```

4. Run basic load test (requires `artillery`):

```powershell
npm run loadtest
```

Notes & Recommendations:
- For true horizontal scaling to support 5k concurrent sockets:
  - Run multiple instances of the socket server behind a load balancer
  - Use sticky sessions or the socket.io cluster/sticky strategy
  - Ensure `REDIS_URL` points to a managed Redis (ElastiCache, Azure Redis)
  - Use a process manager (PM2) or Kubernetes with readiness probes
- Vercel serverless does not support long-lived WebSocket connections. Use a dedicated socket service (container or managed service).

If you want, I can:
- Add a dedicated `src/socket-server/` entry that runs independently
- Add Kubernetes manifests and a Helm chart for production
- Implement sticky-session load balancing example

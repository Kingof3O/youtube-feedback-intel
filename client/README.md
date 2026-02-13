# Frontend (React + Vite)

## Setup
```powershell
npm --prefix client install
Copy-Item client/.env.example client/.env
```

## Run
```powershell
npm --prefix client run dev
```

## Build
```powershell
npm --prefix client run build
```

## Lint
```powershell
npm --prefix client run lint
```

## API Base URL
Set in `client/.env`:
```text
VITE_API_BASE_URL=http://localhost:3000
```

If not set, the client defaults to `http://localhost:3000`.

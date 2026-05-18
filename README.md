# IS2 Project — Frontend

Aplicación web construida con [Next.js](https://nextjs.org), inicializada con [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

---

## Requisitos previos

- Node.js 18+
- npm, yarn, pnpm o bun
- Docker y Docker Compose (para despliegue en contenedor)

---

## Desarrollo local

Instala las dependencias e inicia el servidor de desarrollo:

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

El punto de entrada principal es `src/app/page.tsx`. Los cambios se reflejan automáticamente sin reiniciar el servidor.

---

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera el build de producción |
| `npm run start` | Inicia el servidor en modo producción |
| `npm run lint` | Ejecuta el linter |

---

## Correr imagen Docker

El proyecto está configurado con `output: 'standalone'` para generar un build optimizado para contenedores.

> **Importante:** el repositorio incluye un `docker-compose.override.yml` para desarrollo local con hot reload. Docker Compose lo aplica automáticamente, lo que causa un crash de Turbopack en modo producción. Para levantar en producción siempre usa el flag `-f` para usar solo el archivo base:

```bash
# Build y levantar todos los servicios (producción)
docker compose -f docker-compose.yml up --build

# Solo el frontend
docker compose -f docker-compose.yml up --build frontend

# En segundo plano
docker compose -f docker-compose.yml up -d --build

# Ver logs del frontend
docker compose logs -f frontend

# Detener todos los servicios
docker compose down
```

## Recursos

- [Documentación de Next.js](https://nextjs.org/docs)
- [Tutorial interactivo de Next.js](https://nextjs.org/learn)
- [Repositorio de Next.js en GitHub](https://github.com/vercel/next.js)

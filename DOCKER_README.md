# Docker Setup pro Lidmanovi Web React

Tato aplikace je nakonfigurována pro spuštění v Docker kontejneru s nginx serverem.

## Rychlé spuštění

```bash
# Sestavení a spuštění kontejneru
docker-compose up --build

# Spuštění na pozadí
docker-compose up -d --build
```

Aplikace poběží na `http://localhost:3000`

## Docker příkazy

```bash
# Sestavení Docker image
docker build -t lidmanovi-web .

# Spuštění kontejneru
docker run -p 3000:80 lidmanovi-web

# Zobrazení běžících kontejnerů
docker-compose ps

# Zobrazení logů
docker-compose logs

# Zastavení kontejnerů
docker-compose down

# Restart kontejnerů
docker-compose restart
```

## Konfigurace

- **Port**: Aplikace běží na portu 3000 (mapován na port 80 v kontejneru)
- **Nginx**: Konfigurován pro SPA routing a gzip kompresi
- **Health check**: Automatická kontrola stavu aplikace

## Produkční nasazení

Pro produkční nasazení upravte `docker-compose.yml`:
- Změňte port na 80:80
- Nastavte restart policy
- Přidejte SSL certifikáty
- Nakonfigurujte environment proměnné
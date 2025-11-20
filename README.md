# Desafio: Do Dev ao Deploy

<p align="center">
  <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/1.gif" alt="bulbasaur" width="100">
</p>

Este repositório é o resultado do desafio "Do Dev ao Deploy", que simula um fluxo de trabalho DevOps completo. O objetivo foi pegar uma aplicação web (Django + Next.js) e criar todo o ecossistema de containers e automação para desenvolvimento, testes e produção.

## Tecnologias Utilizadas

- **Backend:** Django, Gunicorn
- **Frontend:** Next.js
- **Banco de Dados:** Postgres
- **Infra (Containers):** Docker, Docker Compose
- **Proxy Reverso (Produção):** Nginx (com SSL)
- **CI/CD:** GitHub Actions
- **Container Registry:** GitHub Container Registry (GHCR)

## Estrutura do Repositório

```

.
├── .github/workflows/       \# Pipeline de CI/CD (GitHub Actions)
├── backend/
│   ├── Dockerfile           \# Imagem de Desenvolvimento (com hot-reload)
│   └── Dockerfile.prod      \# Imagem de Produção (multi-stage, otimizada)
├── frontend/
│   ├── Dockerfile           \# Imagem de Desenvolvimento (com hot-reload)
│   └── Dockerfile.prod      \# Imagem de Produção (multi-stage, otimizada)
├── nginx/
│   ├── nginx.conf           \# Configuração do Nginx (Reverse Proxy)
│   └── ssl/                 \# Certificados SSL (self-signed, ignorado)
├── .env                     \# Variáveis de Desenvolvimento (ignorado)
├── .env.prod                \# Variáveis de Produção (ignorado)
├── docker-compose.yml       \# Orquestrador de Desenvolvimento
└── docker-compose-prod.yml  \# Orquestrador de Produção

```

---

## Como Executar (Ambiente de Desenvolvimento)

Este ambiente é focado em **hot-reload** (mudanças no código são refletidas instantaneamente).

1.  **Crie o arquivo de ambiente** `.env` (na raiz do projeto) e preencha as variáveis de desenvolvimento (como `POSTGRES_USER=admin`, etc.).

2.  **Suba os containers:**

    ```bash
    docker-compose up --build
    ```

3.  **Execute as migrações** (em outro terminal):
    ```bash
    docker-compose exec backend python manage.py migrate
    ```

- O Frontend estará acessível em `http://localhost:3000`.
- O Backend (API) estará acessível em `http://localhost:8000`.

---

## Como Executar (Ambiente de Produção)

Este ambiente é focado em **segurança e performance**, usando Nginx como Proxy Reverso e SSL.

1.  **Crie o arquivo de ambiente** `.env.prod` (na raiz) com credenciais de produção (use senhas fortes!).

2.  **Gere os certificados SSL** (self-signed) para o Nginx:

    ```bash
    mkdir -p nginx/ssl
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout nginx/ssl/selfsigned.key \
    -out nginx/ssl/selfsigned.crt
    ```

3.  **Suba a stack de produção:**
    (Usamos `--env-file` para garantir que as variáveis de produção sejam carregadas corretamente).

    ```bash
    docker-compose --env-file .env.prod -f docker-compose-prod.yml up --build -d
    ```

4.  **Execute as migrações de produção:**
    ```bash
    docker-compose --env-file .env.prod -f docker-compose-prod.yml exec backend-prod python manage.py migrate
    ```

- Sua aplicação estará acessível em `https://localhost` (você precisará aceitar o aviso de segurança do certificado autoassinado).
- O tráfego `http://localhost` será automaticamente redirecionado para `https`.

---

## Resumo do Pipeline de CI/CD

O pipeline configurado em `.github/workflows/ci.yml` automatiza todo o ciclo de vida do projeto:

1.  **CI (Integração Contínua):** Em cada `push` ou `pull_request`, o pipeline executa 3 estágios:

    - **Lint:** Verifica a qualidade e o estilo do código (com `flake8` e `next lint`).
    - **Build:** Garante que as aplicações compilam sem erros (`manage.py check` e `npm run build`).
    - **Test:** Roda os testes unitários (`manage.py test` e `npm run test`) contra um banco de dados Postgres temporário.

2.  **CD (Deploy Contínuo):** Se os 3 estágios acima passarem em um `push` (para `main` ou `develop`):
    - O pipeline se autentica no **GitHub Container Registry (GHCR)**.
    - Ele constrói as imagens de produção otimizadas (usando `Dockerfile.prod`).
    - Ele publica as imagens (`ghcr.io/pedrohsantos/desafio-deploy/backend:latest` e `.../frontend:latest`) no registry, prontas para serem usadas por um servidor de produção.

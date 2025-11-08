# 1. Imagem Base
FROM python:3.14-alpine

# 2. Define o diretório de trabalho dentro do container
WORKDIR /app

# 3. Define variáveis de ambiente do Python
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# 4. Copia e instala as dependências
COPY requirements.txt .
RUN pip install -r requirements.txt

# 5. Copia o resto do código da aplicação
COPY . .

# 6. Comando para rodar o servidor
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
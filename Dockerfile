# Usa una imagen base oficial de Python
FROM python:3.13

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    libjpeg8-dev \
    zlib1g-dev \
    liblcms2-dev \
    libwebp-dev \
    tcl8.6-dev \
    tk8.6-dev \
    git \
    && rm -rf /var/lib/apt/lists/*

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de requerimientos
COPY requirements.txt ./

RUN pip3 install --upgrade pip setuptools

RUN pip install python-dotenv

# Instala las dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Copia el código restante
COPY . .

# Expone el puerto 8000 para Django
EXPOSE 8000
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

# Comando por defecto al iniciar el contenedor
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

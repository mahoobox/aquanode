# Usa una imagen base oficial de Python
FROM python:3.13

RUN apt-get update && apt-get install -y \
    libjpeg-dev \
    zlib1g-dev \
    libpng-dev \
    libfreetype6-dev \
    liblcms2-dev \
    libblas-dev \
    liblapack-dev \
    gfortran \
    git \
    build-essential \
    python3-dev

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de requerimientos
COPY requirements.txt ./

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

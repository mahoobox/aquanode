# Usa una imagen base oficial de Python
FROM python:3.13

# Establece el directorio de trabajo
WORKDIR /app

RUN yum install -y \
    libjpeg-devel \
    zlib-devel \
    libpng-devel \
    freetype-devel \
    lcms2-devel \
    blas-devel \
    lapack-devel \
    gcc

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

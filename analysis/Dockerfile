
# Use the official QGIS image as the base
FROM qgis/qgis:3.40.9-bookworm

# Set environment - root ops
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    QT_QPA_PLATFORM=offscreen \
    QGIS_PREFIX_PATH=/usr \
    PYTHONPATH=/usr/share/qgis/python

# Home and writable directories
ENV HOME=/opt/app-root \
    XDG_CACHE_HOME=/opt/app-root/.cache \
    XDG_CONFIG_HOME=/opt/app-root/.config \
    XDG_DATA_HOME=/opt/app-root/.local/share \
    XDG_RUNTIME_DIR=/opt/app-root/.cache/runtime


# Create QGIS profile + caches and make them group-writable (GID 0)
RUN mkdir -p \
      /opt/app-root/.cache/fontconfig \
      /opt/app-root/.cache/runtime \
      /opt/app-root/.local/share/QGIS/QGIS3/profiles/default \
      /app \
 && chgrp -R 0 /opt/app-root /app \
 && chmod -R g+rwX /opt/app-root /app \
 && chmod 700 /opt/app-root/.cache/runtime


# QGIS auth DB parent directory (profile-aware)
ENV QGIS_AUTH_DB_DIR_PATH=/opt/app-root/.local/share/QGIS/QGIS3/profiles/default
# Seed font cache
RUN fc-cache -rv || true

# App layer
WORKDIR /app

# install pip
RUN apt-get update && \
    apt-get install -y python3-pip && \
    pip3 install --break-system-packages --upgrade pip && \
    ln -s /usr/bin/python3 /usr/bin/python

# Copy source code requirements
COPY . .

# Install Python dependencies
RUN pip3 install --break-system-packages -r requirements.txt

# Install debugpy for remote debugging
RUN pip3 install --break-system-packages debugpy && \
    pip3 install --break-system-packages gunicorn==23.0.0

# ENV
ENV TMPDIR=/tmp


# Set the entrypoint to run the script
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]
#CMD ["python", "-m", "debugpy", "--listen", "0.0.0.0:5678", "--wait-for-client", "barc_analysis.py", "K51121", "2025", "S2", "-o", "-c", "15", "-e", "2025-08-04"]




# Use the official QGIS image as the base
FROM qgis/qgis:3.44.9-trixie

# Set environment - root ops
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    QT_QPA_PLATFORM=offscreen \
    QGIS_PREFIX_PATH=/usr \
    PYTHONPATH=/usr/share/qgis/python \
    UV_SYSTEM_PYTHON=1 \
    UV_CACHE_DIR="/tmp/uv"

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

RUN apt-get update && \
    apt-get install -y --no-install-recommends curl ca-certificates python3 && \
    ln -sf /usr/bin/python3 /usr/bin/python

# Download the 0.7.9 installer
ADD https://astral.sh/uv/0.7.9/install.sh /uv-installer.sh

# Run the installer, move binary, set permissions, remove installer
RUN sh /uv-installer.sh && \
    mv ${HOME}/.local/bin/uv /usr/local/bin/uv && \
    chmod a+rx /usr/local/bin/uv && \
    rm /uv-installer.sh

# App layer
WORKDIR /app

COPY pyproject.toml uv.lock ./

RUN uv export --frozen --no-dev | uv pip install -r -

# Copy source code requirements
COPY . .

# Change ownership for cache to support random UIDs
RUN mkdir -p /tmp/uv && \
    chgrp -R 0 /tmp/uv && \
    chmod -R g+rw /tmp/uv

# ENV
ENV TMPDIR=/tmp


# Set the entrypoint to run the script
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]
#CMD ["python", "-m", "debugpy", "--listen", "0.0.0.0:5678", "--wait-for-client", "barc_analysis.py", "K51121", "2025", "S2", "-o", "-c", "15", "-e", "2025-08-04"]



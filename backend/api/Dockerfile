FROM python:3.12-slim-bookworm

# The installer requires curl (and certificates) to download the release archive
RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates
# set install path for UV
ENV UV_INSTALL_PREFIX="/usr/local"
# Download the 0.7.9 installer
ADD https://astral.sh/uv/0.7.9/install.sh /uv-installer.sh

# Run the installer then remove it
RUN sh /uv-installer.sh && rm /uv-installer.sh

# Set the UV CACHE to a all user writable location
ENV UV_CACHE_DIR="/tmp/uv"
# add api
ADD . /api
WORKDIR /api
# uv add uvicorn tool
RUN uv tool install uvicorn
RUN uv sync --locked

# run app
CMD ["uv", "run", "python", "-m", "uvicorn","main:app","--host","0.0.0.0","--port","8000"]
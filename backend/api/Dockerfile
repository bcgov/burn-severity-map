FROM python:3.12-slim-bookworm

# The installer requires curl (and certificates) to download the release archive
RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates

# Download the 0.7.9 installer
ADD https://astral.sh/uv/0.7.9/install.sh /uv-installer.sh

# Run the installer then remove it
RUN sh /uv-installer.sh && rm /uv-installer.sh

# Ensure the installed binary is on the `PATH`
# ENV PATH="/root/.local/bin/:$PATH"

# Move uv binary to a global path
RUN mv /root/.local/bin/uv /usr/local/bin/uv

# add api
ADD . /api
WORKDIR /api
# uv add uvicorn tool
RUN uv tool install uvicorn
RUN uv sync --locked

# run app
CMD ["uv", "run", "python", "-m", "uvicorn","main:app","--reload","--host","0.0.0.0","--port","8000"]

# # Use a Python image with uv pre-installed
# FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim

# # Install the project into `/api`
# WORKDIR /api

# # Enable bytecode compilation
# ENV UV_COMPILE_BYTECODE=1

# # Copy from the cache instead of linking since it's a mounted volume
# ENV UV_LINK_MODE=copy

# # Ensure installed tools can be executed out of the box
# ENV UV_TOOL_BIN_DIR=/usr/local/bin

# # Set extension directory
# ENV EXTENSION_DIRECTORY=/tmp/duckdb_extensions

# # Install the project's dependencies using the lockfile and settings
# RUN --mount=type=cache,target=/root/.cache/uv \
#     --mount=type=bind,source=uv.lock,target=uv.lock \
#     --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
#     uv sync --locked --no-install-project --no-dev

# # Then, add the rest of the project source code and install it
# # Installing separately from its dependencies allows optimal layer caching
# COPY . /api
# RUN --mount=type=cache,target=/root/.cache/uv \
#     uv sync --locked --no-dev

# # Place executables in the environment at the front of the path
# ENV PATH="/api/.venv/bin:$PATH"

# # Reset the entrypoint, don't invoke `uv`
# ENTRYPOINT []

# # Run the app
# #CMD ["uv", "run", "python", "-m", "uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"]
# CMD ["uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"]
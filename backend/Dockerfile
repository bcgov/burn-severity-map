FROM python:3.12-slim-bookworm AS base

FROM base AS builder

# copy uv binary from UV image at a specific version tag
COPY --from=ghcr.io/astral-sh/uv:0.4.9 /uv /bin/uv

# UV_COMPILE_BYTCODE=1 tells uv to compile python files to .pyc bytecode files. can improve application start time
# UV_LINK_MODE=copy tells uv to copy the python files into the container from the cache mount 
ENV UV_COMPILE_BYTECODE=1 UV_LINK_MODE=COPY

# set working directory
WORKDIR /app 

# install dependencies 
COPY uv.lock pyproject.toml /app/
RUN --mount=type=cache,target=/root/.cache/uv \
  uv sync --frozen --no-install-project --no-dev

# copy the rest of the application
COPY . /app
RUN --mount=type=cache,target=/root/.cache/uv \
  uv sync --frozen --no-dev

###########################################################
FROM base

# copy /app directory from the builder stage
COPY --from=builder /app /app

# set path to the venv's bin directory to run app w/o specifying the full path to the uvicorn executable
ENV PATH="/app/.venv/bin:$PATH"

EXPOSE 8000

CMD ["uvicorn", "uv_docker_example:app", "--host", "0.0.0.0", "--port", "8000"]
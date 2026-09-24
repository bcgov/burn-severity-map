FROM qgis/qgis:3.44.9-trixie

RUN pip install --break-system-packages uv
# COPY --from=uv-source /uv /uvx /bin/

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    QT_QPA_PLATFORM=offscreen \
    QGIS_PREFIX_PATH=/usr \
    PYTHONPATH=/usr/share/qgis/python

ENV HOME=/opt/app-root \
    XDG_CACHE_HOME=/opt/app-root/.cache \
    XDG_CONFIG_HOME=/opt/app-root/.config \
    XDG_DATA_HOME=/opt/app-root/.local/share \
    XDG_RUNTIME_DIR=/opt/app-root/.cache/runtime

ENV VIRTUAL_ENV=/opt/venv
RUN uv venv --system-site-packages $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

RUN mkdir -p \
    /opt/app-root/.cache/fontconfig \
    /opt/app-root/.cache/runtime \
    /opt/app-root/.local/share/QGIS/QGIS3/profiles/default \
    /app \
&& chgrp -R 0 /opt/app-root /app /opt/venv \
&& chmod -R g+rwX /opt/app-root /app /opt/venv \
&& chmod 700 /opt/app-root/.cache/runtime

ENV QGIS_AUTH_DB_DIR_PATH=/opt/app-root/.local/share/QGIS/QGIS3/profiles/default

RUN fc-cache -rv || true

WORKDIR /app

COPY pyproject.toml uv.lock ./

RUN uv export --no-dev --output-file /tmp/requirements.txt && \
    uv pip install -r /tmp/requirements.txt && \
    rm /tmp/requirements.txt


COPY . .

RUN chgrp -R 0 /app && chmod -R g+rwX /app

ENV TMPDIR=/tmp

CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]
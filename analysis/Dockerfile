
# Use the official QGIS image as the base
FROM qgis/qgis:3.40.9-bookworm

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Create working directory
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

# ENV
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV QT_QPA_PLATFORM=offscreen
ENV PYTHONPATH=/usr/share/qgis/python
ENV TMPDIR=/app/tmp

# Create a non-root user and group
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

# Create app and temp directories with proper permissions
WORKDIR /app
RUN mkdir -p /app/tmp && chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Set the entrypoint to run the script
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]


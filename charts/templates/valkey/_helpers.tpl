{{/*
Expand the name of the chart for valkey.
*/}}
{{- define "valkey.name" -}}
{{- printf "valkey" }}
{{- end }}

{{/*
Create a default fully qualified app name for valkey.
*/}}
{{- define "valkey.fullname" -}}
{{- $componentName := include "valkey.name" .  }}
{{- if .Values.valkey.fullnameOverride }}
{{- .Values.valkey.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $componentName | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}

{{/*
Common labels for valkey
*/}}
{{- define "valkey.labels" -}}
{{ include "valkey.selectorLabels" . }}
{{- if .Values.global.tag }}
app.kubernetes.io/image-version: {{ .Values.global.tag | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
app.kubernetes.io/short-name: {{ include "valkey.name" . }}
{{- end }}

{{/*
Selector labels for valkey
*/}}
{{- define "valkey.selectorLabels" -}}
app.kubernetes.io/name: {{ include "valkey.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}
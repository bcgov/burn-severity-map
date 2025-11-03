{{/*
Expand the name of the chart.
*/}}
{{- define "analysis.name" -}}
{{- printf "analysis" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "analysis.fullname" -}}
{{- $componentName := include "analysis.name" .  }}
{{- if .Values.analysis.fullnameOverride }}
{{- .Values.analysis.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $componentName | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "analysis.labels" -}}
{{ include "analysis.selectorLabels" . }}
{{- if .Values.global.tag }}
app.kubernetes.io/image-version: {{ .Values.global.tag | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
app.kubernetes.io/short-name: {{ include "analysis.name" . }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "analysis.selectorLabels" -}}
app.kubernetes.io/name: {{ include "analysis.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}
/** Human-readable incident reference for UI labels (Layer B). */
export function incidentLabel(incident) {
  if (!incident) return '';
  return incident.incidentCode ?? incident.id;
}

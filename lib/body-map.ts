import type { BodyPartId } from "@/lib/body-parts";

export type BodyMapRegionId =
  | "neck"
  | "shoulder_l"
  | "shoulder_r"
  | "chest"
  | "upper_back"
  | "lower_back"
  | "abdomen"
  | "elbow_l"
  | "elbow_r"
  | "wrist_hand_l"
  | "wrist_hand_r"
  | "hip_l"
  | "hip_r"
  | "knee_l"
  | "knee_r"
  | "ankle_foot_l"
  | "ankle_foot_r";

export type BodyMapView = "front" | "back";

export type BodyMapRegion = {
  id: BodyMapRegionId;
  label: string;
  bodyPartId: BodyPartId;
  /** Which views show this region */
  views: BodyMapView[];
  cx: number;
  cy: number;
  rx: number;
  ry: number;
};

export type BodyMapSelection = {
  regionIds: BodyMapRegionId[];
  notes: string;
};

export const BODY_MAP_REGIONS: BodyMapRegion[] = [
  { id: "neck", label: "Cuello", bodyPartId: "neck", views: ["front", "back"], cx: 100, cy: 52, rx: 18, ry: 12 },
  { id: "shoulder_l", label: "Hombro izquierdo", bodyPartId: "shoulder", views: ["front", "back"], cx: 62, cy: 78, rx: 22, ry: 18 },
  { id: "shoulder_r", label: "Hombro derecho", bodyPartId: "shoulder", views: ["front", "back"], cx: 138, cy: 78, rx: 22, ry: 18 },
  { id: "chest", label: "Pecho", bodyPartId: "back", views: ["front"], cx: 100, cy: 105, rx: 28, ry: 22 },
  { id: "upper_back", label: "Espalda alta", bodyPartId: "back", views: ["back"], cx: 100, cy: 105, rx: 30, ry: 24 },
  { id: "abdomen", label: "Abdomen", bodyPartId: "back", views: ["front"], cx: 100, cy: 155, rx: 26, ry: 28 },
  { id: "lower_back", label: "Espalda baja", bodyPartId: "back", views: ["back"], cx: 100, cy: 165, rx: 26, ry: 28 },
  { id: "elbow_l", label: "Codo izquierdo", bodyPartId: "elbow", views: ["front"], cx: 42, cy: 135, rx: 16, ry: 14 },
  { id: "elbow_r", label: "Codo derecho", bodyPartId: "elbow", views: ["front"], cx: 158, cy: 135, rx: 16, ry: 14 },
  { id: "wrist_hand_l", label: "Muñeca / mano izquierda", bodyPartId: "wrist_hand", views: ["front"], cx: 32, cy: 178, rx: 14, ry: 16 },
  { id: "wrist_hand_r", label: "Muñeca / mano derecha", bodyPartId: "wrist_hand", views: ["front"], cx: 168, cy: 178, rx: 14, ry: 16 },
  { id: "hip_l", label: "Cadera izquierda", bodyPartId: "hip", views: ["front"], cx: 78, cy: 205, rx: 18, ry: 16 },
  { id: "hip_r", label: "Cadera derecha", bodyPartId: "hip", views: ["front"], cx: 122, cy: 205, rx: 18, ry: 16 },
  { id: "knee_l", label: "Rodilla izquierda", bodyPartId: "knee", views: ["front"], cx: 78, cy: 275, rx: 16, ry: 20 },
  { id: "knee_r", label: "Rodilla derecha", bodyPartId: "knee", views: ["front"], cx: 122, cy: 275, rx: 16, ry: 20 },
  { id: "ankle_foot_l", label: "Tobillo / pie izquierdo", bodyPartId: "ankle_foot", views: ["front"], cx: 78, cy: 345, rx: 14, ry: 18 },
  { id: "ankle_foot_r", label: "Tobillo / pie derecho", bodyPartId: "ankle_foot", views: ["front"], cx: 122, cy: 345, rx: 14, ry: 18 },
];

export function regionsForView(view: BodyMapView): BodyMapRegion[] {
  return BODY_MAP_REGIONS.filter((r) => r.views.includes(view));
}

export function defaultBodyMapSelection(): BodyMapSelection {
  return { regionIds: [], notes: "" };
}

export function toggleBodyMapRegion(
  selection: BodyMapSelection,
  regionId: BodyMapRegionId
): BodyMapSelection {
  const has = selection.regionIds.includes(regionId);
  return {
    ...selection,
    regionIds: has
      ? selection.regionIds.filter((id) => id !== regionId)
      : [...selection.regionIds, regionId],
  };
}

export function bodyMapRegionLabel(id: BodyMapRegionId): string {
  const region = BODY_MAP_REGIONS.find((r) => r.id === id);
  return region?.label ?? id;
}

export function getSelectedBodyParts(selection: BodyMapSelection): BodyPartId[] {
  const parts = new Set<BodyPartId>();
  for (const id of selection.regionIds) {
    const region = BODY_MAP_REGIONS.find((r) => r.id === id);
    if (region) parts.add(region.bodyPartId);
  }
  return Array.from(parts);
}

export function includesShoulder(selection: BodyMapSelection): boolean {
  return getSelectedBodyParts(selection).includes("shoulder");
}

export function formatBodyMapSelection(selection: BodyMapSelection): string {
  const labels = selection.regionIds.map((id) => bodyMapRegionLabel(id));
  const lines = ["Localización en mapa corporal:"];
  lines.push(
    labels.length
      ? `Zonas señaladas: ${labels.join(", ")}`
      : "Zonas señaladas: (ninguna)"
  );
  if (selection.notes.trim()) {
    lines.push(`Notas del paciente: ${selection.notes.trim()}`);
  }
  return lines.join("\n");
}

export function validateBodyMapSelection(selection: BodyMapSelection): string | null {
  if (selection.regionIds.length === 0) {
    return "Señala al menos una zona del cuerpo donde sientes dolor o molestia.";
  }
  return null;
}

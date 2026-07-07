export const BODY_PARTS = [
  { id: "shoulder", label: "Hombro" },
  { id: "elbow", label: "Codo" },
  { id: "wrist_hand", label: "Muñeca / Mano" },
  { id: "neck", label: "Cuello" },
  { id: "back", label: "Espalda" },
  { id: "hip", label: "Cadera" },
  { id: "knee", label: "Rodilla" },
  { id: "ankle_foot", label: "Tobillo / Pie" },
] as const;

export type BodyPartId = (typeof BODY_PARTS)[number]["id"];

export function bodyPartLabel(id: BodyPartId | ""): string {
  const found = BODY_PARTS.find((p) => p.id === id);
  return found?.label ?? "";
}


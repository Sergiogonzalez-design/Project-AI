/** Module cache so Fisioterapia / guest navigator open without waiting on RPC. */

export type LinkedPhysioCache = {
  physio_id: string;
  physio_name: string | null;
  clinic_name: string | null;
};

let linkedPhysioCache: LinkedPhysioCache | null | undefined;

export function getLinkedPhysioCache(): LinkedPhysioCache | null | undefined {
  return linkedPhysioCache;
}

export function setLinkedPhysioCache(
  next: LinkedPhysioCache | null | undefined
): void {
  linkedPhysioCache = next;
}

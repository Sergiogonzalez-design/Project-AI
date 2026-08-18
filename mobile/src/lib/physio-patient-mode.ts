import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "aikinora_physio_patient_mode";

/** Physio accounts only: preview the patient Consulta questionnaire. */
export async function getPhysioPatientMode(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(KEY)) === "1";
  } catch {
    return false;
  }
}

export async function setPhysioPatientMode(enabled: boolean): Promise<void> {
  try {
    if (enabled) await AsyncStorage.setItem(KEY, "1");
    else await AsyncStorage.removeItem(KEY);
  } catch {
    // ignore storage failures
  }
}

import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { TabParamList } from "./AppTabs";

export type PrimaryWorkspaceRoute = "AIInquiries" | "PhysioConsult" | "Patients" | "PhysioLink";

export function getPrimaryWorkspaceRoute(
  navigation: BottomTabNavigationProp<TabParamList>
): PrimaryWorkspaceRoute | null {
  const names = navigation.getState()?.routeNames ?? [];
  if (names.includes("AIInquiries")) return "AIInquiries";
  if (names.includes("PhysioConsult")) return "PhysioConsult";
  if (names.includes("Patients")) return "Patients";
  if (names.includes("PhysioLink")) return "PhysioLink";
  return null;
}

/** Navigate to Consulta tab (patient or physio). */
export function navigateToPrimaryWorkspace(
  navigation: BottomTabNavigationProp<TabParamList>
): boolean {
  const names = navigation.getState()?.routeNames ?? [];
  const route = names.includes("AIInquiries")
    ? "AIInquiries"
    : names.includes("PhysioConsult")
      ? "PhysioConsult"
      : names.includes("Patients")
        ? "Patients"
        : names.includes("PhysioLink")
          ? "PhysioLink"
          : null;
  if (!route) return false;
  navigation.navigate(route);
  return true;
}

/** Navigate to Paciente tab (physio patients list or patient physio link). */
export function navigateToPacienteTab(
  navigation: BottomTabNavigationProp<TabParamList>
): boolean {
  const names = navigation.getState()?.routeNames ?? [];
  const route = names.includes("Patients")
    ? "Patients"
    : names.includes("PhysioLink")
      ? "PhysioLink"
      : null;
  if (!route) return false;
  navigation.navigate(route);
  return true;
}

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppBackButton } from "../components/AppBackButton";
import { AppBurgerMenu } from "../components/AppBurgerMenu";
import { Colors } from "../lib/colors";
import { useI18n } from "../lib/i18n";
import { AIInquiriesScreen } from "../screens/AIInquiriesScreen";
import { AboutUsScreen } from "../screens/AboutUsScreen";
import { AdminScreen } from "../screens/AdminScreen";
import { ClinicHomeScreen } from "../screens/ClinicHomeScreen";
import { ClinicSearchScreen } from "../screens/ClinicSearchScreen";
import { ClinicTeamScreen } from "../screens/ClinicTeamScreen";
import { PhysioConsultScreen } from "../screens/PhysioConsultScreen";
import { PhysioLinkScreen } from "../screens/PhysioLinkScreen";
import { PhysioPatientsScreen } from "../screens/PhysioPatientsScreen";
import { ProfileScreen } from "../screens/ProfileScreen";

export type TabParamList = {
  AIInquiries: undefined;
  PhysioLink: undefined;
  ClinicSearch: undefined;
  Patients: undefined;
  PhysioConsult: undefined;
  ClinicConsult: undefined;
  ClinicHome: undefined;
  ClinicTeam: undefined;
  AboutUs: undefined;
  Admin: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

type AppTabsProps = {
  isAdmin?: boolean;
  isPhysio?: boolean;
  isClinic?: boolean;
};

export function AppTabs({
  isAdmin = false,
  isPhysio = false,
  isClinic = false,
}: AppTabsProps) {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();

  const screenOptions = {
    headerStatusBarHeight: insets.top,
    headerStyle: {
      backgroundColor: Colors.white,
      shadowColor: "transparent" as const,
      elevation: 0,
      borderBottomWidth: 1,
      borderBottomColor: Colors.border,
    },
    headerTintColor: Colors.text,
    headerTitleStyle: {
      fontWeight: "700" as const,
      fontSize: 17,
      letterSpacing: -0.3,
      color: Colors.text,
    },
    headerShadowVisible: false,
    headerLeft: () => <AppBackButton />,
    headerRight: () => (
      <AppBurgerMenu
        isPhysio={isPhysio}
        isClinic={isClinic}
        isAdmin={isAdmin}
      />
    ),
    tabBarStyle: { display: "none" as const },
  };

  return (
    <Tab.Navigator
      initialRouteName={
        isClinic ? "ClinicConsult" : isPhysio ? "Patients" : "AIInquiries"
      }
      screenOptions={screenOptions}
    >
      {isClinic ? (
        <>
          <Tab.Screen
            name="ClinicConsult"
            component={PhysioConsultScreen}
            options={{ title: t.headers.consulta, headerLeft: () => null }}
          />
          <Tab.Screen
            name="ClinicHome"
            component={ClinicHomeScreen}
            options={{ title: t.headers.clinica }}
          />
          <Tab.Screen
            name="ClinicTeam"
            component={ClinicTeamScreen}
            options={{ title: "Equipo" }}
          />
        </>
      ) : isPhysio ? (
        <>
          <Tab.Screen
            name="Patients"
            component={PhysioPatientsScreen}
            options={{ title: t.headers.clinica }}
          />
          <Tab.Screen
            name="PhysioConsult"
            component={PhysioConsultScreen}
            options={{ title: t.headers.consulta, headerLeft: () => null }}
          />
        </>
      ) : (
        <>
          <Tab.Screen
            name="AIInquiries"
            component={AIInquiriesScreen}
            options={{ title: t.headers.consulta, headerLeft: () => null }}
          />
          <Tab.Screen
            name="PhysioLink"
            component={PhysioLinkScreen}
            options={{ title: t.headers.fisioterapia, headerLeft: () => null }}
          />
          <Tab.Screen
            name="ClinicSearch"
            component={ClinicSearchScreen}
            options={{ title: t.headers.buscar }}
          />
        </>
      )}
      <Tab.Screen
        name="AboutUs"
        component={AboutUsScreen}
        options={{ title: t.headers.sobreNosotros }}
      />
      {isAdmin ? (
        <Tab.Screen
          name="Admin"
          component={AdminScreen}
          options={{ title: t.headers.admin }}
        />
      ) : null}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: t.headers.perfil }}
      />
    </Tab.Navigator>
  );
}

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { AppBackButton } from "../components/AppBackButton";
import { AppBurgerMenu } from "../components/AppBurgerMenu";
import { Colors } from "../lib/colors";
import { useI18n } from "../lib/i18n";
import { AIInquiriesScreen } from "../screens/AIInquiriesScreen";
import { AboutUsScreen } from "../screens/AboutUsScreen";
import { AdminScreen } from "../screens/AdminScreen";
import { PhysioConsultScreen } from "../screens/PhysioConsultScreen";
import { PhysioLinkScreen } from "../screens/PhysioLinkScreen";
import { PhysioPatientsScreen } from "../screens/PhysioPatientsScreen";
import { ProfileScreen } from "../screens/ProfileScreen";

export type TabParamList = {
  AIInquiries: undefined;
  PhysioLink: undefined;
  Patients: undefined;
  PhysioConsult: undefined;
  AboutUs: undefined;
  Admin: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

type AppTabsProps = {
  isAdmin?: boolean;
  isPhysio?: boolean;
};

export function AppTabs({
  isAdmin = false,
  isPhysio = false,
}: AppTabsProps) {
  const { t } = useI18n();

  const screenOptions = {
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
        isAdmin={isAdmin}
      />
    ),
    tabBarStyle: { display: "none" as const },
  };

  return (
    <Tab.Navigator
      initialRouteName={isPhysio ? "Patients" : "PhysioLink"}
      screenOptions={screenOptions}
    >
      {isPhysio ? (
        <>
          <Tab.Screen
            name="Patients"
            component={PhysioPatientsScreen}
            options={{ title: "Clínica" }}
          />
          <Tab.Screen
            name="PhysioConsult"
            component={PhysioConsultScreen}
            options={{ title: "Consulta", headerLeft: () => null }}
          />
        </>
      ) : (
        <>
          <Tab.Screen
            name="PhysioLink"
            component={PhysioLinkScreen}
            options={{ title: "Fisioterapia" }}
          />
          <Tab.Screen
            name="AIInquiries"
            component={AIInquiriesScreen}
            options={{ title: t.headers.consulta, headerLeft: () => null }}
          />
        </>
      )}
      <Tab.Screen
        name="AboutUs"
        component={AboutUsScreen}
        options={{ title: "About" }}
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
        options={{ title: "Profile" }}
      />
    </Tab.Navigator>
  );
}

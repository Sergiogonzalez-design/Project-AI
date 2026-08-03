import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { PhysioAvatar } from "../components/PhysioAvatar";
import { KinoraLogoIcon } from "../components/KinoraLogoIcon";
import { ProfileTabIcon } from "../components/ProfileTabIcon";
import { Colors } from "../lib/colors";
import { useI18n } from "../lib/i18n";
import { AIInquiriesScreen } from "../screens/AIInquiriesScreen";
import { AboutUsScreen } from "../screens/AboutUsScreen";
import { AdminScreen } from "../screens/AdminScreen";
import { PhysioLinkScreen } from "../screens/PhysioLinkScreen";
import { PhysioPatientsScreen } from "../screens/PhysioPatientsScreen";
import { ProfileScreen } from "../screens/ProfileScreen";

export type TabParamList = {
  AIInquiries: undefined;
  PhysioLink: undefined;
  Patients: undefined;
  AboutUs: undefined;
  Admin: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

type AppTabsProps = {
  isAdmin?: boolean;
  isPhysio?: boolean;
};

export function AppTabs({ isAdmin = false, isPhysio = false }: AppTabsProps) {
  const { t } = useI18n();

  return (
    <Tab.Navigator
      initialRouteName={isPhysio ? "Patients" : "AIInquiries"}
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.white,
          shadowColor: "transparent",
          elevation: 0,
          borderBottomWidth: 1,
          borderBottomColor: Colors.border,
        },
        headerTintColor: Colors.text,
        headerTitleStyle: {
          fontWeight: "700",
          fontSize: 17,
          letterSpacing: -0.3,
          color: Colors.text,
        },
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: Colors.tabBar,
          borderTopColor: Colors.tabBarBorder,
          borderTopWidth: StyleSheet.hairlineWidth,
          height: Platform.OS === "ios" ? 88 : 72,
          paddingBottom: Platform.OS === "ios" ? 28 : 12,
          paddingTop: 8,
          shadowColor: Colors.primary,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
          elevation: 12,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          letterSpacing: -0.1,
          marginTop: 2,
        },
        tabBarActiveTintColor: Colors.tabIconActive,
        tabBarInactiveTintColor: Colors.tabIconInactive,
      }}
    >
      {isPhysio ? (
        <Tab.Screen
          name="Patients"
          component={PhysioPatientsScreen}
          options={{
            title: "Pacientes",
            tabBarLabel: "Pacientes",
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? "people" : "people-outline"}
                size={24}
                color={focused ? Colors.tabIconActive : Colors.tabIconInactive}
              />
            ),
          }}
        />
      ) : (
        <>
          <Tab.Screen
            name="AIInquiries"
            component={AIInquiriesScreen}
            options={{
              title: t.headers.consulta,
              tabBarLabel: t.tabs.consulta,
              tabBarIcon: ({ focused }) => (
                <View style={[styles.tabIconWrap, focused && styles.tabIconWrapFocused]}>
                  <PhysioAvatar size={24} style={styles.physioTabAvatar} />
                </View>
              ),
            }}
          />
          <Tab.Screen
            name="PhysioLink"
            component={PhysioLinkScreen}
            options={{
              title: "Fisioterapia",
              tabBarLabel: "Fisioterapia",
              tabBarIcon: ({ focused }) => (
                <Ionicons
                  name={focused ? "medkit" : "medkit-outline"}
                  size={24}
                  color={focused ? Colors.tabIconActive : Colors.tabIconInactive}
                />
              ),
            }}
          />
        </>
      )}
      <Tab.Screen
        name="AboutUs"
        component={AboutUsScreen}
        options={{
          title: t.headers.sobreNosotros,
          tabBarLabel: t.tabs.nosotros,
          tabBarIcon: ({ focused }) => <KinoraLogoIcon focused={focused} />,
        }}
      />
      {isAdmin ? (
        <Tab.Screen
          name="Admin"
          component={AdminScreen}
          options={{
            title: t.headers.admin,
            tabBarLabel: t.tabs.admin,
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? "shield-checkmark" : "shield-checkmark-outline"}
                size={24}
                color={focused ? Colors.tabIconActive : Colors.tabIconInactive}
              />
            ),
          }}
        />
      ) : null}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: t.headers.perfil,
          tabBarLabel: t.tabs.perfil,
          tabBarIcon: ({ focused }) => <ProfileTabIcon focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabIconWrap: {
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "transparent",
    padding: 1,
  },
  tabIconWrapFocused: {
    borderColor: Colors.tabIconActive,
  },
  physioTabAvatar: {
    marginRight: 0,
  },
});

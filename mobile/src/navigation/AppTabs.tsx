import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../lib/colors";
import { HomeScreen } from "../screens/HomeScreen";
import { AIInquiriesScreen } from "../screens/AIInquiriesScreen";
import { ContactScreen } from "../screens/ContactScreen";
import { ProfileScreen } from "../screens/ProfileScreen";

export type TabParamList = {
  Home: undefined;
  AIInquiries: undefined;
  Contact: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

function TabIcon({
  emoji,
  label,
  focused,
}: {
  emoji: string;
  label: string;
  focused: boolean;
}) {
  return (
    <View style={tabIconStyles.wrapper}>
      <Text style={tabIconStyles.emoji}>{emoji}</Text>
      <Text
        style={[
          tabIconStyles.label,
          focused ? tabIconStyles.labelActive : tabIconStyles.labelInactive,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const tabIconStyles = StyleSheet.create({
  wrapper: { alignItems: "center", paddingTop: 4 },
  emoji: { fontSize: 22 },
  label: { fontSize: 10, marginTop: 2, fontWeight: "600" },
  labelActive: { color: Colors.tabIconActive },
  labelInactive: { color: Colors.tabIconInactive },
});

export function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: Colors.white,
        headerTitleStyle: { fontWeight: "700", fontSize: 18 },
        tabBarStyle: {
          backgroundColor: Colors.tabBar,
          borderTopColor: Colors.tabBarBorder,
          borderTopWidth: 1,
          height: 82,
          paddingBottom: 16,
          paddingTop: 4,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "PhysioGuide AI",
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🏠" label="Inicio" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="AIInquiries"
        component={AIInquiriesScreen}
        options={{
          title: "Consulta IA",
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🤖" label="IA" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Contact"
        component={ContactScreen}
        options={{
          title: "Contacto",
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="💬" label="Contacto" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Perfil",
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="👤" label="Perfil" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

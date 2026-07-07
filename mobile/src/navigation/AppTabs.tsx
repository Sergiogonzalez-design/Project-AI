import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { Colors } from "../lib/colors";
import { AIInquiriesScreen } from "../screens/AIInquiriesScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { ProfileScreen } from "../screens/ProfileScreen";

export type TabParamList = {
  Home: undefined;
  AIInquiries: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

function tabIcon(
  outlineName: IoniconsName,
  filledName: IoniconsName,
  focused: boolean
) {
  return (
    <Ionicons
      name={focused ? filledName : outlineName}
      size={24}
      color={focused ? Colors.tabIconActive : Colors.tabIconInactive}
    />
  );
}

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
          paddingTop: 6,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          marginTop: 2,
        },
        tabBarActiveTintColor: Colors.tabIconActive,
        tabBarInactiveTintColor: Colors.tabIconInactive,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "PhysioGuide AI",
          tabBarLabel: "Inicio",
          tabBarIcon: ({ focused }) =>
            tabIcon("home-outline", "home", focused),
        }}
      />
      <Tab.Screen
        name="AIInquiries"
        component={AIInquiriesScreen}
        options={{
          title: "Consulta",
          tabBarLabel: "Consulta",
          tabBarIcon: ({ focused }) =>
            tabIcon("chatbubble-ellipses-outline", "chatbubble-ellipses", focused),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Perfil",
          tabBarLabel: "Perfil",
          tabBarIcon: ({ focused }) =>
            tabIcon("person-outline", "person", focused),
        }}
      />
    </Tab.Navigator>
  );
}

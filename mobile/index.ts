try {
  require("react-native-gesture-handler");
} catch (error) {
  console.warn("[AIKinora] gesture-handler failed to load", error);
}

// Dismiss the launch screen before loading App. App.tsx used to import every
// screen first; if that work hangs, hideAsync never runs and testers stay on the icon.
try {
  const SplashScreen = require("expo-splash-screen");
  const hide = () => {
    try {
      if (typeof SplashScreen.hide === "function") SplashScreen.hide();
      else SplashScreen.hideAsync?.().catch(() => {});
    } catch {
      /* native module not ready yet */
    }
  };
  hide();
  const id = setInterval(hide, 200);
  setTimeout(() => clearInterval(id), 15000);
} catch {
  /* splash module missing */
}

const { registerRootComponent } = require("expo");
const React = require("react");
const { Text, View } = require("react-native");

let App;
try {
  App = require("./App").default;
} catch (error) {
  const message =
    error instanceof Error ? error.message : String(error ?? "unknown error");
  App = function LoadError() {
    return React.createElement(
      View,
      {
        style: {
          flex: 1,
          justifyContent: "center",
          padding: 24,
          backgroundColor: "#F8FAFC",
        },
      },
      React.createElement(
        Text,
        {
          style: {
            fontSize: 18,
            fontWeight: "700",
            textAlign: "center",
            color: "#0F172A",
          },
        },
        "AIKinora no pudo iniciar"
      ),
      React.createElement(
        Text,
        {
          style: {
            marginTop: 12,
            fontSize: 14,
            lineHeight: 20,
            textAlign: "center",
            color: "#64748B",
          },
        },
        message
      )
    );
  };
}

registerRootComponent(App);

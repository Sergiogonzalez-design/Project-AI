try {
  require("react-native-gesture-handler");
} catch (error) {
  console.warn("[AIKinora] gesture-handler failed to load", error);
}

const { registerRootComponent } = require("expo");
const App = require("./App").default;

registerRootComponent(App);

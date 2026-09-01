/**
 * Sets Android large notification icon to Physio's avatar so reminders show his
 * face beside the message (standard largeIcon slot — left of the text).
 */
const { withAndroidManifest, withDangerousMod, AndroidConfig } = require("@expo/config-plugins");
const { generateImageAsync } = require("@expo/image-utils");
const fs = require("fs");
const path = require("path");

const DRAWABLE_NAME = "physio_notification_large";
const META_KEY = "expo.modules.notifications.large_notification_icon";
const SOURCE = "./assets/physio/physio-avatar.png";

function withPhysioLargeIconManifest(config) {
  return withAndroidManifest(config, (config) => {
    const app = AndroidConfig.Manifest.getMainApplicationOrThrow(config.modResults);
    AndroidConfig.Manifest.addMetaDataItemToMainApplication(
      app,
      META_KEY,
      `@drawable/${DRAWABLE_NAME}`,
      "resource"
    );
    return config;
  });
}

function withPhysioLargeIconAssets(config) {
  return withDangerousMod(config, ["android", async (config) => {
    const projectRoot = config.modRequest.projectRoot;
    const src = path.resolve(projectRoot, SOURCE);
    const drawableDir = path.join(
      projectRoot,
      "android/app/src/main/res/drawable-xxhdpi"
    );
    if (!fs.existsSync(drawableDir)) {
      fs.mkdirSync(drawableDir, { recursive: true });
    }
    const { source } = await generateImageAsync(
      { projectRoot, cacheType: "physio-notification-large" },
      {
        src,
        width: 192,
        height: 192,
        resizeMode: "cover",
        backgroundColor: "#EFF6FF",
      }
    );
    fs.writeFileSync(
      path.join(drawableDir, `${DRAWABLE_NAME}.png`),
      source
    );
    return config;
  }]);
}

module.exports = function withPhysioNotificationLargeIcon(config) {
  config = withPhysioLargeIconAssets(config);
  config = withPhysioLargeIconManifest(config);
  return config;
};

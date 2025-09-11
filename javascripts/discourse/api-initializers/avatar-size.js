import { withSilencedDeprecations } from "discourse/lib/deprecated";
import { withPluginApi } from "discourse/lib/plugin-api";

function avatarSize(api) {
  // Change avatar size on desktop
  api.registerValueTransformer("post-avatar-size", () => 60);

  // Wrap the old widget code while silencing deprecation warnings
  withSilencedDeprecations("discourse.post-stream-widget-overrides", () =>
    oldAvatarSize(api)
  );
}

// Old widget code (still needed for pre-Glimmer widgets)
function oldAvatarSize(api) {
  api.changeWidgetSetting("post-avatar", "size", 60);
}

export default {
  name: "avatar-size",

  initialize(container) {
    // ------------------------------------------------------------------
    // Exit unless we’re viewing a topic list in the “community” category
    // ------------------------------------------------------------------
    if (!document.body.classList.contains("category-community")) {
      return;
    }

    const site = container.lookup("site:main");
    if (!site.mobileView) {
      withPluginApi((api) => avatarSize(api));
    }
  },
};

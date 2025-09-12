import { withSilencedDeprecations } from "discourse/lib/deprecated";
import { withPluginApi } from "discourse/lib/plugin-api";

function applyAvatarSize(api) {
  api.registerValueTransformer("post-avatar-size", () => 60);

  // legacy widget support
  withSilencedDeprecations("discourse.post-stream-widget-overrides", () =>
    api.changeWidgetSetting("post-avatar", "size", 60)
  );
}

export default {
  name: "avatar-size",

  initialize(container) {
    const site = container.lookup("site:main");
    if (site.mobileView) {
      return; // desktop only
    }

    withPluginApi("1.8.0", (api) => {
      let done = false;

      const runIfCommunity = () => {
        if (done) {
          return;
        }
        if (window?.location?.pathname?.includes("/c/community")) {
          applyAvatarSize(api);
          done = true;
        }
      };

      runIfCommunity();
      api.onPageChange(runIfCommunity);
    });
  },
};

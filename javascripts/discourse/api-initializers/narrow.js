import NarrowDesktop from "discourse/lib/narrow-desktop";
import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "narrow-view",

  initialize() {
    withPluginApi("0.8.13", (api) => {
      const runIfCommunity = () => {
        if (window?.location?.pathname?.includes("/c/community")) {
          // Treat widths < 1000 px as “narrow desktop”
          NarrowDesktop.isNarrowDesktopView = (width) => width < 1000;
        }
      };

      runIfCommunity();
      api.onPageChange(runIfCommunity);
    });
  },
};

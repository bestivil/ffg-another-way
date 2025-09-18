import NarrowDesktop from "discourse/lib/narrow-desktop";
import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "narrow-view",

  initialize() {
    withPluginApi("0.8.13", (api) => {
      const originalIsNarrow = NarrowDesktop.isNarrowDesktopView;
      let applied = false;

      const updateForRoute = () => {
        const onCommunity =
          window?.location?.pathname?.includes("/c/community");
        if (onCommunity) {
          if (!applied) {
            NarrowDesktop.isNarrowDesktopView = (width) => width < 1000;
            applied = true;
          }
        } else if (applied) {
          NarrowDesktop.isNarrowDesktopView = originalIsNarrow;
          applied = false;
        }
      };

      updateForRoute();
      api.onPageChange(updateForRoute);
    });
  },
};

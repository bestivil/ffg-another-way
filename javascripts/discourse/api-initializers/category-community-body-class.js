import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "category-community-body-class",

  initialize() {
    withPluginApi("0.8.13", (api) => {
      const syncBodyClass = () => {
        const onCommunity = window?.location?.pathname?.includes("/c/community");
        if (onCommunity) {
          document.body.classList.add("category-community");
        } else {
          document.body.classList.remove("category-community");
        }
      };

      syncBodyClass();
      api.onPageChange(syncBodyClass);
    });
  },
};



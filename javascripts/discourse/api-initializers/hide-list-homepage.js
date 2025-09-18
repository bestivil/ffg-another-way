import { withPluginApi } from "discourse/lib/plugin-api";
import { defaultHomepage } from "discourse/lib/utilities";

export default {
  name: "hide-list-homepage",

  initialize() {
    withPluginApi("0.8.13", (api) => {
      const setBodyClass = () => {
        const home = defaultHomepage();
        const path = window?.location?.pathname || "/";
        const isHome = path === "/" || path === `/${home}`;

        if (isHome) {
          document.body.classList.add("custom-homepage");
        } else {
          document.body.classList.remove("custom-homepage");
        }
      };

      setBodyClass();
      api.onPageChange(setBodyClass);
    });
  },
};

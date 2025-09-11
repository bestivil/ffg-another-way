import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "discourse-navigation-controls",

  initialize() {
    withPluginApi("0.8.13", (api) => {
      if (!document.body.classList.contains("category-community")) {
        return;
      }

      const site = api.container.lookup("site:main");
      if (!site.mobileView) {
        return;
      }

      let scrollTop = window.scrollY;
      const body = document.body;
      const hiddenNavClass = "nav-controls-hidden";
      const scrollMax = 0;
      let lastScrollTop = 0;

      const hideNav = () => body.classList.add(hiddenNavClass);
      const showNav = () => body.classList.remove(hiddenNavClass);

      window.addEventListener("scroll", () => {
        scrollTop = window.scrollY;

        if (
          lastScrollTop < scrollTop &&
          scrollTop > scrollMax &&
          !body.classList.contains(hiddenNavClass)
        ) {
          hideNav();
        } else if (
          lastScrollTop > scrollTop &&
          body.classList.contains(hiddenNavClass)
        ) {
          showNav();
        }

        lastScrollTop = scrollTop;
      });
    });
  },
};

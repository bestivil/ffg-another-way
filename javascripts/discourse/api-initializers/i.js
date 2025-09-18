import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "discourse-navigation-controls",

  initialize() {
    withPluginApi("0.8.13", (api) => {
      let listenerAttached = false;
      let scrollHandler = null;

      /**
       * Attaches the mobile scroll listener for the Community category
       */
      const attachScrollListener = () => {
        if (listenerAttached) {
          return;
        }

        let scrollTop = window.scrollY;
        const body = document.body;
        const hiddenNavClass = "nav-controls-hidden";
        const scrollMax = 0;
        let lastScrollTop = 0;

        const hideNav = () => body.classList.add(hiddenNavClass);
        const showNav = () => body.classList.remove(hiddenNavClass);

        scrollHandler = () => {
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
        };

        window.addEventListener("scroll", scrollHandler);
        listenerAttached = true;
      };

      /**
       * Detaches the scroll listener and resets body state
       */
      const detachScrollListener = () => {
        if (!listenerAttached) {
          return;
        }
        if (scrollHandler) {
          window.removeEventListener("scroll", scrollHandler);
          scrollHandler = null;
        }
        document.body.classList.remove("nav-controls-hidden");
        listenerAttached = false;
      };

      /**
       * Keeps the scroll listener attached only when on /c/community in mobile view
       */
      const updateForRoute = () => {
        const onCommunity =
          window?.location?.pathname?.includes("/c/community");
        const site = api.container.lookup("site:main");
        const isMobile = !!site.mobileView;

        if (onCommunity && isMobile) {
          attachScrollListener();
        } else {
          detachScrollListener();
        }
      };

      updateForRoute();
      api.onPageChange(updateForRoute);
    });
  },
};

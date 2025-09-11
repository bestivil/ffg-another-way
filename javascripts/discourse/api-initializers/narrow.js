import NarrowDesktop from "discourse/lib/narrow-desktop";

export default {
  name: "narrow-view",

  initialize() {
    // ------------------------------------------------------------------
    // Exit unless we’re inside the “community” category
    // ------------------------------------------------------------------
    if (!document.body.classList.contains("category-community")) {
      return;
    }

    // Treat widths < 1000 px as “narrow desktop”
    NarrowDesktop.isNarrowDesktopView = (width) => width < 1000;
  },
};

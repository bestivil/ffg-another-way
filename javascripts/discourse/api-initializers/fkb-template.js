import { apiInitializer } from "discourse/lib/api";
import TliTopSection from "../components/topic-list-item/tli-top-section";
import TliMiddleSection from "../components/topic-list-item/tli-middle-section";
import FkbPanel from "../components/fkb-panel";

export default apiInitializer("1.8.0", (api) => {
  let initialized = false;

  const runIfCommunity = () => {
    if (initialized) {
      return;
    }
    if (!window?.location?.pathname?.includes("/c/community")) {
      return;
    }

    if (!settings.disable_topic_list_modification) {
      api.registerValueTransformer(
        "topic-list-item-mobile-layout",
        () => false
      );
    }

    api.registerValueTransformer("topic-list-columns", ({ value: columns }) => {
      if (!settings.disable_topic_list_modification) {
        columns.delete("posters");
        columns.delete("replies");
        columns.delete("views");
        columns.delete("activity");
      }
      return columns;
    });

    if (!settings.disable_topic_list_modification) {
      api.renderInOutlet("topic-list-before-link", TliTopSection);
      api.renderInOutlet("topic-list-main-link-bottom", TliMiddleSection);
    }

    api.renderInOutlet("discovery-below", FkbPanel);

    api.modifyClass(
      "component:discovery/topics",
      (Superclass) =>
        class extends Superclass {
          get renderNewListHeaderControls() {
            return (
              this.showTopicsAndRepliesToggle && !this.args.bulkSelectEnabled
            );
          }
        }
    );

    api.onPageChange(() => {
      if (!window?.location?.pathname?.includes("/c/community")) {
        return;
      }
      const fkbHidden = localStorage.getItem("fkb_panel_hidden") === "true";
      const fkbVisible = localStorage.getItem("fkb_panel_hidden") === "false";
      const isHidden = document.body.classList.contains("fkb-panel-hidden");

      if (fkbHidden && !isHidden) {
        document.body.classList.add("fkb-panel-hidden");
      } else if (fkbVisible && isHidden) {
        document.body.classList.remove("fkb-panel-hidden");
      }
    });

    initialized = true;
  };

  runIfCommunity();
  api.onPageChange(runIfCommunity);
});

import { apiInitializer } from "discourse/lib/api";
import TliTopSection from "../components/topic-list-item/tli-top-section";
import TliMiddleSection from "../components/topic-list-item/tli-middle-section";
import FkbPanel from "../components/fkb-panel";

export default apiInitializer("1.8.0", (api) => {
  let initialized = false;
  let teardownApplied = false;
  let registered = false;

  if (!registered) {
    if (!settings.disable_topic_list_modification) {
      api.registerValueTransformer("topic-list-item-mobile-layout", () => {
        const onCommunity =
          window?.location?.pathname?.includes("/c/community");
        if (onCommunity) {
          return false;
        }
        return undefined;
      });
    }

    api.registerValueTransformer("topic-list-columns", ({ value: columns }) => {
      const onCommunity = window?.location?.pathname?.includes("/c/community");
      if (onCommunity && !settings.disable_topic_list_modification) {
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
            const onCommunity =
              window?.location?.pathname?.includes("/c/community");
            return (
              onCommunity &&
              this.showTopicsAndRepliesToggle &&
              !this.args.bulkSelectEnabled
            );
          }
        }
    );

    registered = true;
  }

  const syncPanelState = () => {
    const onCommunity = window?.location?.pathname?.includes("/c/community");
    const fkbHidden = localStorage.getItem("fkb_panel_hidden") === "true";
    const fkbVisible = localStorage.getItem("fkb_panel_hidden") === "false";
    const isHidden = document.body.classList.contains("fkb-panel-hidden");

    if (onCommunity) {
      if (fkbHidden && !isHidden) {
        document.body.classList.add("fkb-panel-hidden");
      } else if (fkbVisible && isHidden) {
        document.body.classList.remove("fkb-panel-hidden");
      }
      teardownApplied = false;
    } else {
      if (!teardownApplied) {
        document.body.classList.remove("fkb-panel-hidden");
        teardownApplied = true;
      }
    }

    initialized = true;
  };

  syncPanelState();
  api.onPageChange(syncPanelState);
});

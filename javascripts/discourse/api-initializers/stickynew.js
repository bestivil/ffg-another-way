import { apiInitializer } from "discourse/lib/api";
import { action } from "@ember/object";
import { popupAjaxError } from "discourse/lib/ajax-error";

export default apiInitializer("1.8.0", (api) => {
  // ------------------------------------------------------------------
  // Exit unless we’re inside the “community” category
  // ------------------------------------------------------------------
  if (!document.body.classList.contains("category-community")) {
    return;
  }

  /* --------------------------------------------------------------
     (everything below is the original banner logic)
  -------------------------------------------------------------- */

  // Sticky banner on Latest
  api.modifyClass(
    "component:discovery/topics",
    (Superclass) =>
      class extends Superclass {
        @action
        async showInserted(event) {
          event?.preventDefault();

          if (this.args.model.loadingBefore) {
            return;
          }

          document.querySelector(".list-controls")?.scrollIntoView();

          try {
            const topicIds = [...this.topicTrackingState.newIncoming];
            await this.args.model.loadBefore(topicIds, true);
            this.topicTrackingState.clearIncoming(topicIds);
          } catch (e) {
            popupAjaxError(e);
          }
        }
      }
  );

  // Sticky banner on Category
  api.modifyClass(
    "controller:discovery/categories",
    (Superclass) =>
      class extends Superclass {
        @action
        showInserted(event) {
          event?.preventDefault();

          document.querySelector(".list-controls")?.scrollIntoView();

          this.model.loadBefore(
            this.topicTrackingState.get("newIncoming"),
            true
          );
          this.topicTrackingState.resetTracking();
        }
      }
  );

  // Sticky banner on PM
  api.modifyClass(
    "controller:user-topics-list",
    (Superclass) =>
      class extends Superclass {
        @action
        async showInserted(event) {
          event?.preventDefault();

          if (this.model.loadingBefore) {
            return;
          }

          document.querySelector(".user-navigation-primary")?.scrollIntoView();

          try {
            const topicIds = [...this.pmTopicTrackingState.newIncoming];
            await this.model.loadBefore(topicIds);
            this.pmTopicTrackingState.resetIncomingTracking(topicIds);
          } catch (e) {
            popupAjaxError(e);
          }
        }
      }
  );
});

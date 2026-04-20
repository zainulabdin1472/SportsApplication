import type { ListingSummary } from "../api/schemas";

export function conditionLabel(condition: ListingSummary["condition"]) {
  switch (condition) {
    case "new":
      return "New";
    case "like_new":
      return "Like new";
    case "used":
      return "Used";
    default:
      return condition;
  }
}

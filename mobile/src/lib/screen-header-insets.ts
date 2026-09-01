import type { EdgeInsets } from "react-native-safe-area-context";

/** Top inset for in-screen headers when the tab navigator header is hidden. */
export function screenHeaderTopInset(insets: EdgeInsets): number {
  return Math.max(insets.top, 12) + 8;
}

/** Padding for a full-width top bar (back / title / close). */
export function screenHeaderBarPadding(insets: EdgeInsets) {
  return {
    paddingTop: screenHeaderTopInset(insets),
    paddingBottom: 12,
  };
}

/** Fallback height for a custom top bar before onLayout runs (e.g. after resume). */
export function estimatedCustomTopBarHeight(insets: EdgeInsets): number {
  return screenHeaderTopInset(insets) + 52;
}

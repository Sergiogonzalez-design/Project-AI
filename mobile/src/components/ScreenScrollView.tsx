import { useScrollToTop } from "@react-navigation/native";
import React, { forwardRef, useRef } from "react";
import { ScrollView, type ScrollViewProps } from "react-native";

/** ScrollView that jumps to the top when its screen gains focus (tab change or back). */
export const ScreenScrollView = forwardRef<ScrollView, ScrollViewProps>(
  function ScreenScrollView(props, ref) {
    const innerRef = useRef<ScrollView>(null);
    const scrollRef =
      ref && typeof ref !== "function" ? ref : innerRef;

    useScrollToTop(scrollRef as React.RefObject<ScrollView>);

    return <ScrollView ref={scrollRef} {...props} />;
  }
);

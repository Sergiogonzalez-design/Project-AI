import React, { createContext, useContext } from "react";
import { TextInput, type TextInputProps } from "react-native";

type QuestionnaireKeyboardContextValue = {
  onFieldFocus: () => void;
};

const QuestionnaireKeyboardContext =
  createContext<QuestionnaireKeyboardContextValue | null>(null);

export function QuestionnaireKeyboardProvider({
  onFieldFocus,
  children,
}: {
  onFieldFocus: () => void;
  children: React.ReactNode;
}) {
  return (
    <QuestionnaireKeyboardContext.Provider value={{ onFieldFocus }}>
      {children}
    </QuestionnaireKeyboardContext.Provider>
  );
}

/**
 * TextInput for questionnaire fields. When focused, asks the parent scroll view
 * to keep the field above the software keyboard.
 */
export const ConsultaTextInput = React.forwardRef<TextInput, TextInputProps>(
  function ConsultaTextInput(props, ref) {
    const ctx = useContext(QuestionnaireKeyboardContext);

    return (
      <TextInput
        {...props}
        ref={ref}
        onFocus={(e) => {
          props.onFocus?.(e);
          if (!ctx) return;
          // Keyboard / layout often settle after a short delay.
          requestAnimationFrame(() => {
            ctx.onFieldFocus();
            setTimeout(() => ctx.onFieldFocus(), 80);
            setTimeout(() => ctx.onFieldFocus(), 280);
          });
        }}
      />
    );
  }
);

import { createContext, useContext } from "react";

export const EditorialEditorContext = createContext(null);

export function useEditorialEditor() {
  const context = useContext(EditorialEditorContext);
  if (!context) {
    throw new Error("useEditorialEditor must be used within EditorialEditorProvider");
  }
  return context;
}

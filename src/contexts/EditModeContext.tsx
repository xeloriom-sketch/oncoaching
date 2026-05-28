import { createContext, useContext } from "react";

export interface EditModeCtx {
  isEditMode: boolean;
  pageKey: string;
  getFieldValue: (fieldKey: string) => string;
  updateField: (fieldKey: string, value: string) => void;
}

export const EditModeContext = createContext<EditModeCtx>({
  isEditMode: false,
  pageKey: "",
  getFieldValue: () => "",
  updateField: () => {},
});

export const useEditMode = () => useContext(EditModeContext);

import { createContext, useContext } from "react";

export interface EditModeCtx {
  isEditMode: boolean;
  pageKey: string;
  activeFieldKey: string | null;
  setActiveFieldKey: (key: string | null) => void;
  getFieldValue: (fieldKey: string) => string;
  updateField: (fieldKey: string, value: string) => void;
  previewMode: boolean;
}

export const EditModeContext = createContext<EditModeCtx>({
  isEditMode: false,
  pageKey: "",
  activeFieldKey: null,
  setActiveFieldKey: () => {},
  getFieldValue: () => "",
  updateField: () => {},
  previewMode: false,
});

export const useEditMode = () => useContext(EditModeContext);

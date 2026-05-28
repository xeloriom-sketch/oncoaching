import { createContext, useContext } from "react";

export interface EditModeCtx {
  isEditMode: boolean;
}

export const EditModeContext = createContext<EditModeCtx>({ isEditMode: false });

export const useEditMode = () => useContext(EditModeContext);

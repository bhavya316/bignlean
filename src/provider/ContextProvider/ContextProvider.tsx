"use client";
import {
  createContext,
  Dispatch,
  ReactNode,
  useReducer,
  useContext,
} from "react";
import { initialState } from "./InitialState";
import reducer from "./Reducer";
import { Action, InitialState } from "@/utils/Types";

const AppContext = createContext<InitialState>(initialState);

const DispatchContext = createContext<Dispatch<Action>>(({}: Action) => {});

export default function ContextProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AppContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
export const useDispatchContext = () => useContext(DispatchContext);

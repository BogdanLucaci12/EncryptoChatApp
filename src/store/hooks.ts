import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import { AppDispatch, RootState } from "./store";

type DispatchFunction=()=>AppDispatch;

export const useDispatcher:DispatchFunction=useDispatch
export const useSelectored:TypedUseSelectorHook<RootState>=useSelector
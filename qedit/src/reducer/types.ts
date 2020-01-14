
import * as Redux from "redux";

export type Action = Redux.Action<string>;
export type ParameterizedAction<T> = Redux.Action<string> & { payload: T };

export type Choice = Readonly<string>;

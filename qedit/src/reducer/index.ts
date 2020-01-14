
import * as Redux from "redux";
import { choicesNum } from "./editor";

export type State = {
    choicesNum: number
};

export default Redux.combineReducers<State>({
    choicesNum
});

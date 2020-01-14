
import * as Redux from "redux";
import { choices, difficulty } from "./editor";
import { Choice } from "./types";

export type State = {
    choices: Choice[],
    difficulty: number
};

export default Redux.combineReducers<State>({
    choices,
    difficulty
});

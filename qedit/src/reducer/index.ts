
import * as Redux from "redux";
import { choices, difficulty, correctNumber } from "./editor";
import { Choice } from "./types";

export type State = {
    choices: Choice[],
    difficulty: number,
    correctNumber: number
};

export default Redux.combineReducers<State>({
    choices,
    difficulty,
    correctNumber
});

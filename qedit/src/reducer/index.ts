
import * as Redux from "redux";
import { choices, difficulty, correctNumber, showEditorPopup } from "./editor";
import { Choice } from "./types";

export type State = {
    showEditorPopup: boolean,
    choices: Choice[],
    difficulty: number,
    correctNumber: number
};

export default Redux.combineReducers<State>({
    showEditorPopup,
    choices,
    difficulty,
    correctNumber
});

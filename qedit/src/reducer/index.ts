
import * as Redux from "redux";
import { choices, difficulty, correctNumber, showEditorPopup, editOriginId } from "./editor";
import { Choice } from "./types";

export type State = {
    showEditorPopup: boolean,
    editOriginId: number | null,
    choices: Choice[],
    difficulty: number,
    correctNumber: number
};

export default Redux.combineReducers<State>({
    showEditorPopup,
    editOriginId,
    choices,
    difficulty,
    correctNumber
});

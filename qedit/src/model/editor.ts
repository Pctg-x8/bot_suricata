
import * as sqlite from "sqlite3";
import { Choice } from "./question";

export type EditorState = {
    readonly id: number,
    readonly difficulty: number,
    readonly qText: string,
    readonly choices: Choice[],
    readonly correctNumber: number,
    readonly choiceAtrandom: boolean,
    readonly correctText: string,
    readonly incorrectText: string
};
export function newEmptyEditorState(id: number): EditorState
{
    return {
        id,
        difficulty: 1,
        qText: "",
        choices: [""],
        correctNumber: 0,
        choiceAtrandom: false,
        correctText: "",
        incorrectText: ""
    };
}

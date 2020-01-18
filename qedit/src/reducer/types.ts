
import * as Redux from "redux";

export type Action = Redux.Action<string>;
export type ParameterizedAction<T> = Redux.Action<string> & { payload: T };

export type Choice = Readonly<string>;

export type EditorState = {
    readonly id: number,
    readonly difficulty: number,
    readonly qText: string,
    readonly choices: Choice[],
    readonly correctNumber: number,
    readonly correctText: string,
    readonly incorrectText: string
};
export function initEditorState(id: number): EditorState
{
    return {
        id,
        difficulty: 1,
        qText: "",
        choices: [""],
        correctNumber: 0,
        correctText: "",
        incorrectText: ""
    };
}

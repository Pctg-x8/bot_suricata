
import { EditorState, newEmptyEditorState, editorStateFromQuestion } from "../model/editor";
import * as Action from "../action/editor";

export type EditorActions = Action.CreateQuestionAction | Action.EditQuestionAction | Action.CloseQuestionAction;
export function initEditorState(state: EditorState | null = null, action: EditorActions): EditorState | null
{
    switch (action.type)
    {
    case Action.CREATE_QUESTION:
        return newEmptyEditorState(0);
    case Action.EDIT_QUESTION:
        return editorStateFromQuestion(action.payload);
    case Action.CLOSE_QUESTION:
        return null;
    default:
        return state;
    }
}

export function editorOriginId(state: number | null = null, action: EditorActions): number | null
{
    switch (action.type)
    {
    case Action.CREATE_QUESTION:
        return null;
    case Action.EDIT_QUESTION:
        return action.payload.id;
    default:
        return state;
    }
}

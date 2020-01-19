
import { EditorState, newEmptyEditorState, editorStateFromQuestion } from "../model/editor";
import * as Action from "../action/editor";

export type EditorActions = Action.CreateQuestionAction | Action.EditQuestionAction | Action.CloseQuestionAction;
export function initEditorState(state: EditorState | null = null, action: EditorActions): EditorState | null
{
    switch (action.type)
    {
    case Action.TypeTags.Create:
        return newEmptyEditorState(0);
    case Action.TypeTags.Edit:
        return editorStateFromQuestion(action.payload);
    case Action.TypeTags.Close:
        return null;
    default:
        return state;
    }
}

export function editorOriginId(state: number | null = null, action: EditorActions): number | null
{
    switch (action.type)
    {
    case Action.TypeTags.Create:
        return null;
    case Action.TypeTags.Edit:
        return action.payload.id;
    default:
        return state;
    }
}

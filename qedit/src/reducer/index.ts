
import * as Redux from "redux";
import { initEditorState, editorOriginId } from "./editor";
import { EditorState } from "./types";

export type State = {
    initEditorState: EditorState | null,
    editorOriginId: number | null
};

export default Redux.combineReducers<State>({
    initEditorState,
    editorOriginId
});

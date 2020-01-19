
import * as Redux from "redux";
import { initEditorState, editorOriginId } from "./editor";
import { questionList } from "./app";
import { EditorState } from "../model/editor";
import { QuestionTableRow } from "../model/question";

export type State = {
    questionList: QuestionTableRow[],
    initEditorState: EditorState | null,
    editorOriginId: number | null
};

export default Redux.combineReducers<State>({
    questionList,
    initEditorState,
    editorOriginId
});

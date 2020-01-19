
import * as Redux from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { State } from "../reducer/index";
import * as AppActions from "./app";
import { questionFromEditorState, EditorState } from "../model/editor";
import QuestionDBAccessor, { Question } from "../model/question";

export enum TypeTags
{
    Create = "Suricata.Editor.Action.Editor.Create",
    Edit = "Suricata.Editor.Action.Editor.Edit",
    Close = "Suricata.Editor.Action.Editor.Close"
}

export interface CreateQuestionAction extends Redux.Action<string>
{
    type: TypeTags.Create;
    payload: number;
}
export function createQuestion(): ThunkAction<Promise<void>, State, void, CreateQuestionAction>
{
    return async (d: ThunkDispatch<State, void, CreateQuestionAction>) =>
    {
        const maxId = await QuestionDBAccessor.getMaxIdNumber();
        d({ type: TypeTags.Create, payload: maxId + 1 });
    }
}

export interface EditQuestionAction extends Redux.Action<string>
{
    type: TypeTags.Edit;
    payload: Question;
}
export function editQuestion(id: number): ThunkAction<Promise<void>, State, void, EditQuestionAction>
{
    return async (d: ThunkDispatch<State, void ,EditQuestionAction>) =>
    {
        const row = await QuestionDBAccessor.load(id);
        d({ type: TypeTags.Edit, payload: row });
    };
}

export interface CloseQuestionAction extends Redux.Action<string>
{
    type: TypeTags.Close;
}
export function closeQuestion(): CloseQuestionAction
{
    return { type: TypeTags.Close };
}

export function removeQuestion(id: number): ThunkAction<Promise<void>, State, void, AppActions.SetQuestionListAction>
{
    return async (d: ThunkDispatch<State, void, AppActions.SetQuestionListAction>) =>
    {
        await QuestionDBAccessor.remove(id);
        d(AppActions.refreshQuestionList());
    };
}

export function saveAndClose(st: EditorState, oldId?: number): ThunkAction<Promise<void>, State, void, CloseQuestionAction>
{
    return async (d: ThunkDispatch<State, void, CloseQuestionAction>) =>
    {
        await QuestionDBAccessor.replace(questionFromEditorState(st), oldId);
        d(closeQuestion());
        d(AppActions.refreshQuestionList());
    };
}

//! App Global Actions

import * as Redux from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import QuestionDBAccessor, { QuestionTableRow } from "../model/question";
import { State } from "../reducer/index";

export enum TypeTags
{
    SetQuestionList = "Suricata.Editor.Action.App.SetQuestionList"
}

export interface SetQuestionListAction extends Redux.Action<string>
{
    type: TypeTags.SetQuestionList,
    payload: QuestionTableRow[]
}
export function refreshQuestionList(): ThunkAction<Promise<void>, State, void, SetQuestionListAction>
{
    return async (d: ThunkDispatch<State, void, SetQuestionListAction>) =>
    {
        const rows = await QuestionDBAccessor.loadAllAsTableRow();
        d({ type: TypeTags.SetQuestionList, payload: rows });
    };
}

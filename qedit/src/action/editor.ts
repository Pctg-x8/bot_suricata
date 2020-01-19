
import * as Redux from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { State } from "../reducer/index";
import { refreshQuestionList } from "./app";
import { questionFromEditorState, EditorState } from "../model/editor";
import QuestionDBAccessor, { Question } from "../model/question";

export const CREATE_QUESTION = "Suricata.Editor.Action.Editor.Create";
export interface CreateQuestionAction extends Redux.Action<string>
{
    type: typeof CREATE_QUESTION;
}
export function createQuestion(): CreateQuestionAction
{
    return { type: CREATE_QUESTION };
}

export const EDIT_QUESTION = "Suricata.Editor.Action.Editor.Edit";
export interface EditQuestionAction extends Redux.Action<string>
{
    type: typeof EDIT_QUESTION;
    payload: Question;
}
export function editQuestion(id: number): ThunkAction<Promise<void>, State, void, EditQuestionAction>
{
    return async (d: ThunkDispatch<State, void ,EditQuestionAction>) =>
    {
        const row = await QuestionDBAccessor.load(id);
        d({ type: EDIT_QUESTION, payload: row });
    };
}

export const CLOSE_QUESTION = "Suricata.Editor.Action.Editor.Close";
export interface CloseQuestionAction extends Redux.Action<string>
{
    type: typeof CLOSE_QUESTION;
}
export function closeQuestion(): CloseQuestionAction
{
    return { type: CLOSE_QUESTION };
}

export const CHANGE_DIFFICULTY = "Suricata.Editor.Action.Difficulty.Change";
export interface ChangeDifficultyAction extends Redux.Action<string>
{
    type: typeof CHANGE_DIFFICULTY;
    payload: number;
}
export function changeDifficulty(newDifficulty: number): ChangeDifficultyAction
{
    return { type: CHANGE_DIFFICULTY, payload: newDifficulty };
}

export const NEW_CHOICE = "Suricata.Editor.Action.Choices.Add";
export function newChoice(): Redux.Action<string>
{
    return { type: NEW_CHOICE };
}

export const REMOVE_CHOICE = "Suricata.Editor.Action.Choices.Remove";
export interface RemoveChoiceAction extends Redux.Action<string>
{
    type: typeof REMOVE_CHOICE;
    payload: [number, number];
}
export function removeChoice(currentNum: number, num: number): RemoveChoiceAction
{
    return { type: REMOVE_CHOICE, payload: [num, currentNum - 1] };
}

export const UPDATE_CHOICE_TEXT = "Suricata.Editor.Action.Choices.UpdateText";
export interface UpdateChoiceAction extends Redux.Action<string>
{
    type: typeof UPDATE_CHOICE_TEXT;
    payload: [number, string];
}
export function updateChoiceText(num: number, text: string): UpdateChoiceAction
{
    return { type: UPDATE_CHOICE_TEXT, payload: [num, text] };
}

export const SET_CORRECT_NUMBER = "Suricata.Editor.Action.CorrectNumber.Set";
export interface SetCorrectNumberAction extends Redux.Action<string>
{
    type: typeof SET_CORRECT_NUMBER;
    payload: number;
}
export function setCorrectNumber(num: number): SetCorrectNumberAction
{
    return { type: SET_CORRECT_NUMBER, payload: num };
}

export const UP_CHOICE = "Suricata.Editor.Action.Choices.Up";
export interface UpChoiceAction extends Redux.Action<string>
{
    type: typeof UP_CHOICE;
    payload: number;
}
export function upChoicePosition(num: number): UpChoiceAction
{
    return { type: UP_CHOICE, payload: num };
}

export const DOWN_CHOICE = "Suricata.Editor.Action.Choices.Down";
export interface DownChoiceAction extends Redux.Action<string>
{
    type:typeof DOWN_CHOICE;
    payload: number;
}
export function downChoicePosition(num: number): DownChoiceAction
{
    return { type: DOWN_CHOICE, payload: num };
}

export function saveAndClose(st: EditorState): ThunkAction<Promise<void>, State, void, CloseQuestionAction>
{
    return async (d: ThunkDispatch<State, void, CloseQuestionAction>) =>
    {
        await QuestionDBAccessor.replace(questionFromEditorState(st));
        d(closeQuestion());
        d(refreshQuestionList());
    };
}


import * as Redux from "redux";
import { ParameterizedAction, Choice } from "../reducer/types";

export const CHANGE_DIFFICULTY = "Suricata.Editor.Action.Difficulty.Change";
export function changeDifficulty(newDifficulty: number): ParameterizedAction<number>
{
    return { type: CHANGE_DIFFICULTY, payload: newDifficulty };
}

export const NEW_CHOICE = "Suricata.Editor.Action.Choices.Add";
export function newChoice(): Redux.Action<string>
{
    return { type: NEW_CHOICE };
}

export const REMOVE_CHOICE = "Suricata.Editor.Action.Choices.Remove";
export function removeChoice(num: number): ParameterizedAction<number>
{
    return { type: REMOVE_CHOICE, payload: num };
}

export const UPDATE_CHOICE_TEXT = "Suricata.Editor.Action.Choices.UpdateText";
export function updateChoiceText(num: number, text: string): ParameterizedAction<[number, string]>
{
    return { type: UPDATE_CHOICE_TEXT, payload: [num, text] };
}

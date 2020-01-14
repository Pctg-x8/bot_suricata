
import * as Redux from "redux";
import { ParameterizedAction, Choice } from "./types";
import * as Action from "../action/editor";

type RemoveChoiceAction = { type: "Suricata.Editor.Action.Choices.Remove", payload: number };
type NewChoiceAction = { type: "Suricata.Editor.Action.Choices.Add" };
type UpdateChoiceTextAction = { type: "Suricata.Editor.Action.Choices.UpdateText", payload: [number, string] };
type ChoicesActions = RemoveChoiceAction | NewChoiceAction | UpdateChoiceTextAction;

export function choices(state: Choice[] = [""], action: ChoicesActions): Choice[]
{
    switch (action.type)
    {
    case Action.NEW_CHOICE:
        return [...state, ""];
    case Action.REMOVE_CHOICE:
        if (state.length <= 1) { return state; }
        else
        {
            state.splice(action.payload, 1);
            return state;
        }
    case Action.UPDATE_CHOICE_TEXT:
        { state[action.payload[0]] = action.payload[1]; return state; }
    default: return state;
    }
}

export function difficulty(state: number = 1, action: ParameterizedAction<number>): number
{
    switch (action.type)
    {
    case Action.CHANGE_DIFFICULTY:
        return action.payload;
    default: return state;
    }
}

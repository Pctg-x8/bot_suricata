
import * as Redux from "redux";
import { ParameterizedAction, Choice } from "./types";
import * as Action from "../action/editor";

export function showEditorPopup(state: boolean = false, action: Redux.Action<string>): boolean
{
    switch (action.type)
    {
    case Action.CREATE_QUESTION:
    case Action.EDIT_QUESTION:
        return true;
    case Action.CLOSE_QUESTION:
        return false;
    default: return state;
    }
}

type EditTriggerActions = Action.CreateQuestionAction | Action.EditQuestionAction;
export function editOriginId(state: number | null = null, action: EditTriggerActions): number | null
{
    switch (action.type)
    {
    case Action.CREATE_QUESTION:
        return null;
    case Action.EDIT_QUESTION:
        return action.payload;
    default: return state;
    }
}

type ChoicesAcceptActions = Redux.Action<typeof Action.NEW_CHOICE> | Action.RemoveChoiceAction | Action.UpdateChoiceAction | Action.UpChoiceAction | Action.DownChoiceAction;
export function choices(state: Choice[] = [""], action: ChoicesAcceptActions): Choice[]
{
    switch (action.type)
    {
    case Action.NEW_CHOICE:
        return [...state, ""];
    case Action.REMOVE_CHOICE:
        if (state.length <= 1) { return state; }
        else
        {
            state.splice(action.payload[0], 1);
            return state;
        }
    case Action.UPDATE_CHOICE_TEXT:
        { state[action.payload[0]] = action.payload[1]; return state; }
    case Action.UP_CHOICE:
        {
            const t = state[action.payload - 1];
            state[action.payload - 1] = state[action.payload];
            state[action.payload] = t;
            return state;
        }
    case Action.DOWN_CHOICE:
        {
            const t = state[action.payload + 1];
            state[action.payload + 1] = state[action.payload];
            state[action.payload] = t;
            return state;
        }
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

type CorrectNumberAcceptActions = Action.SetCorrectNumberAction | Action.RemoveChoiceAction | Action.UpChoiceAction | Action.DownChoiceAction;
export function correctNumber(state: number = 0, action: CorrectNumberAcceptActions): number
{
    switch (action.type)
    {
    case Action.SET_CORRECT_NUMBER:
        return action.payload;
    case Action.REMOVE_CHOICE:
        // Fixing out of range designation
        return Math.min(state, action.payload[1] - 1);
    case Action.UP_CHOICE: return state == action.payload ? state - 1 : state;
    case Action.DOWN_CHOICE: return state == action.payload ? state + 1 : state;
    default: return state;
    }
}

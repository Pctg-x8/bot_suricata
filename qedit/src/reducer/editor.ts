
import * as Redux from "redux";
import { ParameterizedAction, Choice } from "./types";
import * as Action from "../action/editor";

type RemoveChoiceAction = { type: typeof Action.REMOVE_CHOICE, payload: [number, number] };
type UnparameteredChoiceAction = { type: typeof Action.NEW_CHOICE };
type UpdateChoiceTextAction = { type: typeof Action.UPDATE_CHOICE_TEXT, payload: [number, string] };
type UpDownChoiceAction = { type: typeof Action.UP_CHOICE | typeof Action.DOWN_CHOICE, payload: number };
type ChoicesActions = RemoveChoiceAction | UnparameteredChoiceAction | UpdateChoiceTextAction | UpDownChoiceAction;

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

type SetCorrectNumber = { type: typeof Action.SET_CORRECT_NUMBER, payload: number };
type CorrectNumberActions = SetCorrectNumber | RemoveChoiceAction | UpDownChoiceAction;

export function correctNumber(state: number = 0, action: CorrectNumberActions): number
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

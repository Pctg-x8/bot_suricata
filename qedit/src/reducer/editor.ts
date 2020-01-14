
import * as Redux from "redux";

export function choicesNum(state: number = 1, action: Redux.Action<string>): number
{
    switch (action.type)
    {
    default: return state;
    }
}

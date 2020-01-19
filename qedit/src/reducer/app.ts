
import { QuestionTableRow, Question } from "../model/question";
import * as Action from "../action/app";

type QuestionListTriggerActions = Action.SetQuestionListAction;
export function questionList(state: QuestionTableRow[] = [], action: QuestionListTriggerActions): QuestionTableRow[]
{
    switch (action.type)
    {
    case Action.TypeTags.SetQuestionList:
        return action.payload;
    default:
        return state;
    }
}

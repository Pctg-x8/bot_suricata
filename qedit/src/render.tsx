
import "./style.sass";
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Redux from "redux";
import thunk from "redux-thunk";
import { Provider, useSelector, useDispatch } from "react-redux";
import Reducers, { State } from "./reducer/index";
import QuestionDBAccessor, { Choice, QuestionTableRow } from "./model/question";
import * as EditorActions from "./action/editor";
import * as AppActions from "./action/app";
import { newEmptyEditorState, EditorState } from "./model/editor";

const DifficultyDescText = [
    "少しの知識でも楽しめる、簡単なテスト、ですの",
    "図鑑を見たり、解説をよく読んだりしてるなら解けるレベル、ですわね",
    "オマケ的なパネルや、図鑑をよく読み込んでいないと解けない問題ですの！",
    "博士論文を読み込むレベルの問題、ですわね......"
];

function QuestionEditorPopup(): JSX.Element
{
    const d = useDispatch();
    const [originId, initEditorState] = useSelector((s: State) => [s.editorOriginId, s.initEditorState]);
    const [localEditorState, updateLocalEditorState] = React.useState(initEditorState ?? newEmptyEditorState(0));
    const patchLocalEditorState = React.useCallback(
        (diff: Partial<EditorState>) => updateLocalEditorState({ ...localEditorState, ...diff }),
        [updateLocalEditorState, localEditorState]);

    // Update InitValue //
    React.useEffect(() =>
    {
        if (!initEditorState) return;

        updateLocalEditorState(initEditorState);
    }, [initEditorState, originId]);

    const upChoicePosition = React.useCallback((n: number) =>
    {
        if (n <= 0) return;
        let diff: Partial<EditorState> = {};
        if (localEditorState.correctNumber == n - 1) diff = { ...diff, correctNumber: n };
        if (localEditorState.correctNumber == n) diff = { ...diff, correctNumber: n - 1 };
        diff = {
            ...diff,
            choices: [
                ...localEditorState.choices.slice(0, n - 1),
                localEditorState.choices[n], localEditorState.choices[n - 1],
                ...localEditorState.choices.slice(n + 1)
            ]
        };
        patchLocalEditorState(diff);
    }, [patchLocalEditorState, localEditorState.correctNumber, localEditorState.choices]);
    const downChoicePosition = React.useCallback((n: number) =>
    {
        if (n >= localEditorState.choices.length) return;
        let diff: Partial<EditorState> = {};
        if (localEditorState.correctNumber == n + 1) diff = { ...diff, correctNumber: n };
        if (localEditorState.correctNumber == n) diff = { ...diff, correctNumber: n + 1 };
        diff = {
            ...diff,
            choices: [
                ...localEditorState.choices.slice(0, n),
                localEditorState.choices[n + 1],
                localEditorState.choices[n],
                ...localEditorState.choices.slice(n + 2)
            ]
        };
        patchLocalEditorState(diff);
    }, [patchLocalEditorState, localEditorState.correctNumber, localEditorState.choices]);
    const addChoice = React.useCallback(() =>
    {
        patchLocalEditorState({ choices: [...localEditorState.choices, ""] });
    }, [patchLocalEditorState, localEditorState.choices]);
    const removeChoice = React.useCallback((n: number) =>
    {
        if (localEditorState.choices.length == 1) return;
        let diff: Partial<EditorState> = {};
        if (localEditorState.correctNumber == localEditorState.choices.length - 1)
        {
            diff = { ...diff, correctNumber: localEditorState.choices.length - 2 };
        }
        diff = {
            ...diff,
            choices: [...localEditorState.choices.slice(0, n), ...localEditorState.choices.slice(n + 1)]
        };
        patchLocalEditorState(diff);
    }, [patchLocalEditorState, localEditorState.choices, localEditorState.correctNumber]);
    const updateChoiceText = React.useCallback((n: number, text: string) =>
    {
        patchLocalEditorState({
            choices: [...localEditorState.choices.slice(0, n), text, ...localEditorState.choices.slice(n + 1)]
        });
    }, [patchLocalEditorState, localEditorState.choices]);

    const visibilityClasses = initEditorState ? "show" : "";
    const isEditMode = originId != null;
    const title = isEditMode ? "クイズを編集" : "新しいクイズ";
    const choiceUis = React.useMemo(() => localEditorState.choices.map((ch: string, n: number) => (
        <li key={n}>
            <input type="radio" className="inline" name="correct" value={1}
                checked={localEditorState.correctNumber == n}
                onChange={_ => patchLocalEditorState({ correctNumber: n })} />
            <span>{n + 1}.&nbsp;</span>
            <input type="text" className="inline expanded"
                value={ch} onChange={e => updateChoiceText(n, e.target.value)} />
            <button type="button" disabled={n == 0}
                onClick={_ => upChoicePosition(n)}>↑</button>
            <button type="button" disabled={n == localEditorState.choices.length - 1}
                onClick={_ => downChoicePosition(n)}>↓</button>
            <button type="button"
                disabled={localEditorState.choices.length <= 1}
                onClick={_ => removeChoice(n)}>×</button>
        </li>
    )), [localEditorState.choices, localEditorState.correctNumber, patchLocalEditorState]);
    return <section id="qedit">
        <div className={visibilityClasses} id="popup-overlay"></div>
        <div className={ [visibilityClasses, "popup"].join(" ") }>
            <h1>{title}</h1>
            <div className="container">
                <form>
                    <div className="row">
                        <label htmlFor="q_id">ID:&nbsp;</label>
                        <input type="number" id="q_id"
                            value={localEditorState.id}
                            onChange={e => patchLocalEditorState({ id: parseInt(e.target.value) })} />
                    </div>
                    <div className="row">
                        <label htmlFor="difficulty">推定難易度:&nbsp;</label>
                        <select id="difficulty"
                            value={localEditorState.difficulty}
                            onChange={e => patchLocalEditorState({ difficulty: parseInt(e.target.value) })}>
                            <option value={1}>Beginner(1)</option>
                            <option value={2}>Intermediate(2)</option>
                            <option value={3}>Advanced(3)</option>
                            <option value={4}>Expert(4)</option>
                        </select>
                    </div>
                    <div className="row nospace">
                        <p style={{ paddingLeft: "6em", opacity: 0.5, fontStyle: "italic" }}>
                            {DifficultyDescText[localEditorState.difficulty - 1]}
                        </p>
                    </div>
                    <div className="row twoliner">
                        <label htmlFor="q_text">クイズ内容:</label>
                        <textarea id="q_text" rows={5}
                            value={localEditorState.qText}
                            onChange={e => patchLocalEditorState({ qText: e.target.value })}>
                        </textarea>
                    </div>
                    <div className="subgroup">
                        <header>
                            <h3>
                                <span>選択肢:</span>
                                <input type="checkbox" id="choiceAtrandom" className="inline"
                                    checked={localEditorState.choiceAtrandom}
                                    onChange={e => patchLocalEditorState({ choiceAtrandom: e.target.checked })} />
                                <label htmlFor="choiceAtrandom">ランダムな順番で出題</label>
                            </h3>
                            <button type="button" onClick={_ => addChoice()}>＋</button>
                        </header>
                        <ul>{choiceUis}</ul>
                    </div>
                    <div className="row twoliner">
                        <label htmlFor="a_text_desc_correct">正解時の解説文:</label>
                        <textarea id="a_text_desc_correct" rows={2}
                            value={localEditorState.correctText}
                            onChange={e => patchLocalEditorState({ correctText: e.target.value })}>
                        </textarea>
                    </div>
                    <div className="row twoliner">
                        <label htmlFor="a_text_desc_incorrect">不正解時の解説文:</label>
                        <textarea id="a_text_desc_incorrect" rows={2}
                            value={localEditorState.incorrectText}
                            onChange={e => patchLocalEditorState({ incorrectText: e.target.value })}>
                        </textarea>
                    </div>
                    <div className="row right">
                        <button type="button" onClick={_ => d(EditorActions.closeQuestion())}>取り消し</button>
                        <button type="button" onClick={_ => d(EditorActions.saveAndClose(localEditorState, originId))}>
                            {!isEditMode ? "作成" : "保存"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </section>;
}

class QuestionRow
{
    constructor(readonly id: number, readonly text: string, readonly numChoices: number) {}
    static FromModel(r: QuestionTableRow): QuestionRow
    {
        return new QuestionRow(r.id, r.qText, r.ansCount);
    }

    asRowElements(onRowHover: (_: React.MouseEvent) => void, onRowBlur: (_: React.MouseEvent) => void, dispatch: Redux.Dispatch<any>, selected: boolean, key: string): JSX.Element[]
    {
        const commonClass = selected ? ["selected"] : [];
        const text = this.text.split("\n").map((l, n) => n > 0 ? [<br key={`${key}_Q_${n}`} />, l] : [l]);

        return [
            <div key={`${key}_Id`} className={[...commonClass, "numcenter"].join(" ")}
                onMouseOver={onRowHover} onMouseOut={onRowBlur}
                onClick={_ => dispatch(EditorActions.editQuestion(this.id))}>
                    {this.id}
            </div>,
            <div key={`${key}_Q`} className={[...commonClass, "nohpad"].join(" ")}
                onMouseOver={onRowHover} onMouseOut={onRowBlur}
                onClick={_ => dispatch(EditorActions.editQuestion(this.id))}>
                    {text}
            </div>,
            <div key={`${key}_Ans`} className={[...commonClass, "numcenter"].join(" ")}
                onMouseOver={onRowHover} onMouseOut={onRowBlur}
                onClick={_ => dispatch(EditorActions.editQuestion(this.id))}>
                    {this.numChoices}
            </div>,
            <div key={`${key}_Del`} className={[...commonClass, "numcenter", "deleteBtn"].join(" ")}
                onMouseOver={onRowHover} onMouseOut={onRowBlur}
                onClick={_ => dispatch(EditorActions.removeQuestion(this.id))}>
                    削除
            </div>
        ];
    }
}

function QuestionList(): JSX.Element
{
    const d = useDispatch();
    const [hoverIndex, setHoverIndex] = React.useState<number | null>(null);

    const rowModels = useSelector((s: State) => s.questionList);
    const rows = React.useMemo(() => rowModels.map(QuestionRow.FromModel), [rowModels]);

    React.useEffect(() =>
    {
        // Initial Fetch
        d(AppActions.refreshQuestionList());
    }, []);
    const hoverOnAppenderRow = hoverIndex >= rows.length;

    return <section id="qlist">
        <div>
            <div className="head numcenter">ID</div>
            <div className="head nohpad">設問</div>
            <div className="head numcenter">選択肢</div>
            <div className="head"></div>

            {
                rows.map((r, n) => r.asRowElements(_ => setHoverIndex(n), _ => setHoverIndex(null), d, hoverIndex == n, n.toString()))
            }

            <div className={hoverOnAppenderRow ? "selected addrow" : "addrow"}
                onMouseOver={_ => setHoverIndex(rows.length)} onMouseOut={_ => setHoverIndex(null)}
                onClick={_ => d(EditorActions.createQuestion())}></div>
            <div className={hoverOnAppenderRow ? "selected nohpad addrow" : "nohpad addrow"}
                onMouseOver={_ => setHoverIndex(rows.length)} onMouseOut={_ => setHoverIndex(null)}
                onClick={_ => d(EditorActions.createQuestion())}>追加...</div>
            <div className={hoverOnAppenderRow ? "selected addrow" : "addrow"}
                onMouseOver={_ => setHoverIndex(rows.length)} onMouseOut={_ => setHoverIndex(null)}
                onClick={_ => d(EditorActions.createQuestion())}></div>
            <div className={hoverOnAppenderRow ? "selected addrow" : "addrow"}
                onMouseOver={_ => setHoverIndex(rows.length)} onMouseOut={_ => setHoverIndex(null)}
                onClick={_ => d(EditorActions.createQuestion())}></div>
        </div>
    </section>;
}

function AppMain(): JSX.Element
{
    return <div>
        <QuestionList />
        <QuestionEditorPopup />
    </div>;
}

const store = Redux.createStore(Reducers, Redux.applyMiddleware(thunk));

ReactDOM.render(<Provider store={store}><AppMain /></Provider>, document.getElementById("app"));

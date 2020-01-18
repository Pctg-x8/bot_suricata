
import "./style.sass";
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Redux from "redux";
import { Provider, useSelector, useDispatch } from "react-redux";
import Reducers, { State } from "./reducer/index";
import { Choice } from "./reducer/types";
import * as EditorActions from "./action/editor";

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
    const qText = React.useRef<HTMLTextAreaElement>();
    const aDescCorrect = React.useRef<HTMLTextAreaElement>();
    const aDescIncorrect = React.useRef<HTMLTextAreaElement>();

    const [choices, updateChoices] = React.useState<Choice[]>(initEditorState?.choices ?? []);
    const [correctNumber, updateCorrectNumber] = React.useState(initEditorState?.correctNumber ?? 0);
    const [difficulty, updateDifficulty] = React.useState(initEditorState?.difficulty ?? 1);
    const [id, updateId] = React.useState(originId ?? 0);
    const [choiceAtrandom, updateChoiceAtrandom] = React.useState(initEditorState?.choiceAtrandom ?? false);

    const saveCurrent = React.useCallback(() =>
    {
        console.log(qText.current.value);
        console.log(aDescCorrect.current.value);
        console.log(aDescIncorrect.current.value);
    }, [qText, aDescCorrect, aDescIncorrect]);

    // Update InitValue //
    React.useEffect(() =>
    {
        if (!initEditorState) return;

        updateId(originId ?? initEditorState.id);
        updateDifficulty(initEditorState.difficulty);
        updateChoices(initEditorState.choices);
        updateCorrectNumber(initEditorState.correctNumber);
        updateChoiceAtrandom(initEditorState.choiceAtrandom);
    }, [initEditorState, originId]);

    const upChoicePosition = React.useCallback((n: number) =>
    {
        if (n <= 0) return;
        if (correctNumber == n - 1) updateCorrectNumber(n);
        if (correctNumber == n) updateCorrectNumber(n - 1);
        updateChoices([...choices.slice(0, n - 1), choices[n], choices[n - 1], ...choices.slice(n + 1)]);
    }, [choices]);
    const downChoicePosition = React.useCallback((n: number) =>
    {
        if (n >= choices.length) return;
        if (correctNumber == n + 1) updateCorrectNumber(n);
        if (correctNumber == n) updateCorrectNumber(n + 1);
        updateChoices([...choices.slice(0, n), choices[n + 1], choices[n], ...choices.slice(n + 2)]);
    }, [choices]);
    const addChoice = React.useCallback(() =>
    {
        updateChoices([...choices, ""]);
    }, [choices]);
    const removeChoice = React.useCallback((n: number) =>
    {
        if (choices.length == 1) return;
        if (correctNumber == choices.length - 1) updateCorrectNumber(choices.length - 2);
        updateChoices([...choices.slice(0, n), ...choices.slice(n + 1)]);
    }, [choices]);
    const updateChoiceText = React.useCallback((n: number, text: string) =>
    {
        updateChoices([...choices.slice(0, n), text, ...choices.slice(n + 1)]);
    }, [choices]);

    const visibilityClasses = initEditorState ? "show" : "";
    const isEditMode = originId != null;
    const title = isEditMode ? "クイズを編集" : "新しいクイズ";
    const choiceUis = React.useMemo(() => choices.map((ch: string, n: number) => (
        <li key={n}>
            <input type="radio" className="inline" name="correct" value={1}
                checked={correctNumber == n}
                onChange={_ => updateCorrectNumber(n)} />
            <span>{n + 1}.&nbsp;</span>
            <input type="text" className="inline expanded"
                value={ch} onChange={e => updateChoiceText(n, e.target.value)} />
            <button type="button" disabled={n == 0}
                onClick={_ => upChoicePosition(n)}>↑</button>
            <button type="button" disabled={n == choices.length - 1}
                onClick={_ => downChoicePosition(n)}>↓</button>
            <button type="button"
                disabled={choices.length <= 1}
                onClick={_ => removeChoice(n)}>×</button>
        </li>
    )), [choices, correctNumber]);
    return <section id="qedit">
        <div className={visibilityClasses} id="popup-overlay"></div>
        <div className={ [visibilityClasses, "popup"].join(" ") }>
            <h1>{title}</h1>
            <div className="container">
                <form>
                    <div className="row">
                        <label htmlFor="q_id">ID:&nbsp;</label>
                        <input type="number" id="q_id" value={id} onChange={e => updateId(parseInt(e.target.value))} />
                    </div>
                    <div className="row">
                        <label htmlFor="difficulty">推定難易度:&nbsp;</label>
                        <select id="difficulty"
                            value={difficulty}
                            onChange={e => updateDifficulty(parseInt(e.target.value))}>
                            <option value={1}>Beginner(1)</option>
                            <option value={2}>Intermediate(2)</option>
                            <option value={3}>Advanced(3)</option>
                            <option value={4}>Expert(4)</option>
                        </select>
                    </div>
                    <div className="row nospace">
                        <p style={{ paddingLeft: "6em", opacity: 0.5, fontStyle: "italic" }}>{DifficultyDescText[difficulty - 1]}</p>
                    </div>
                    <div className="row twoliner">
                        <label htmlFor="q_text">クイズ内容:</label>
                        <textarea id="q_text" rows={5} ref={qText}></textarea>
                    </div>
                    <div className="subgroup">
                        <header>
                            <h3>
                                <span>選択肢:</span>
                                <input type="checkbox" id="choiceAtrandom" className="inline"
                                    checked={choiceAtrandom}
                                    onChange={e => updateChoiceAtrandom(e.target.checked)} />
                                <label htmlFor="choiceAtrandom">ランダムな順番で出題</label>
                            </h3>
                            <button type="button" onClick={_ => addChoice()}>＋</button>
                        </header>
                        <ul>{choiceUis}</ul>
                    </div>
                    <div className="row twoliner">
                        <label htmlFor="a_text_desc_correct">正解時の解説文:</label>
                        <textarea id="a_text_desc_correct" rows={2} ref={aDescCorrect}></textarea>
                    </div>
                    <div className="row twoliner">
                        <label htmlFor="a_text_desc_incorrect">不正解時の解説文:</label>
                        <textarea id="a_text_desc_incorrect" rows={2} ref={aDescIncorrect}></textarea>
                    </div>
                    <div className="row right">
                        <button type="button" onClick={_ => d(EditorActions.closeQuestion())}>取り消し</button>
                        <button type="button" onClick={saveCurrent}>{!isEditMode ? "作成" : "保存"}</button>
                    </div>
                </form>
            </div>
        </div>
    </section>;
}

class QuestionRow
{
    constructor(readonly id: number, readonly text: string, readonly numChoices: number) {}

    asRowElements(onRowHover: (_: React.MouseEvent) => void, onRowBlur: (_: React.MouseEvent) => void, dispatch: Redux.Dispatch, selected: boolean, key: string): JSX.Element[]
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
            </div>
        ];
    }
}

function QuestionList(): JSX.Element
{
    const d = useDispatch();
    const [hoverIndex, setHoverIndex] = React.useState<number | null>(null);

    const rows = [
        new QuestionRow(999, "あああ\nあああああ", 2),
        new QuestionRow(998, "あああ\n\あいいいい\nテスト", 3),
        new QuestionRow(10524, "テストですの", 28),
    ];

    return <section id="qlist">
        <div>
            <div className="head numcenter">ID</div>
            <div className="head nohpad">設問</div>
            <div className="head numcenter">選択肢</div>

            {
                rows.map((r, n) => r.asRowElements(_ => setHoverIndex(n), _ => setHoverIndex(null), d, hoverIndex == n, n.toString()))
            }
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

const store = Redux.createStore(Reducers);

ReactDOM.render(<Provider store={store}><AppMain /></Provider>, document.getElementById("app"));

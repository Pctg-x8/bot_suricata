
import "./style.sass";
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Redux from "redux";
import { Provider, useSelector, useDispatch } from "react-redux";
import Reducers, { State } from "./reducer/index";
import * as EditorActions from "./action/editor";

const DifficultyDescText = [
    "少しの知識でも楽しめる、簡単なテスト、ですの",
    "図鑑を見たり、解説をよく読んだりしてるなら解けるレベル、ですわね",
    "オマケ的なパネルや、図鑑をよく読み込んでいないと解けない問題ですの！",
    "博士論文を読み込むレベルの問題、ですわね......"
];

type EditorPopupProperties =
{
    editingOriginId?: number
};
function QuestionEditorPopup(props: EditorPopupProperties): JSX.Element
{
    const isEditMode = props.editingOriginId;
    const title = isEditMode ? "クイズを編集" : "新しいクイズ";

    const d = useDispatch();
    const [
        show, choices, currentDifficulty, currentCorrectNum
    ] = useSelector((s: State) => [
        s.showEditorPopup, s.choices, s.difficulty, s.correctNumber
    ]);
    const qText = React.useRef<HTMLTextAreaElement>();
    const aDescCorrect = React.useRef<HTMLTextAreaElement>();
    const aDescIncorrect = React.useRef<HTMLTextAreaElement>();

    const saveCurrent = React.useCallback(() =>
    {
        console.log(qText.current.value);
        console.log(aDescCorrect.current.value);
        console.log(aDescIncorrect.current.value);
    }, [qText, aDescCorrect, aDescIncorrect]);

    const visibilityClasses = show ? "show" : "";
    const choiceUis = choices.map((ch, n: number) => (
        <li key={n}>
            <input type="radio" className="inline" name="correct" value={1}
                checked={currentCorrectNum == n}
                onChange={_ => d(EditorActions.setCorrectNumber(n))} />
            <span>{n + 1}.&nbsp;</span>
            <input type="text" className="inline expanded"
                value={ch} onChange={e => d(EditorActions.updateChoiceText(n, e.target.value))} />
            <button type="button" disabled={n == 0}
                onClick={_ => d(EditorActions.upChoicePosition(n))}>↑</button>
            <button type="button" disabled={n == choices.length - 1}
                onClick={_ => d(EditorActions.downChoicePosition(n))}>↓</button>
            <button type="button"
                disabled={choices.length <= 1}
                onClick={_ => d(EditorActions.removeChoice(choices.length, n))}>×</button>
        </li>
    ));
    return <section id="qedit">
        <div className={visibilityClasses} id="popup-overlay"></div>
        <div className={ [visibilityClasses, "popup"].join(" ") }>
            <h1>{title}</h1>
            <div className="container">
                <form>
                    <div className="row">
                        <label htmlFor="q_id">ID:&nbsp;</label>
                        <input type="input" id="q_id" defaultValue={props.editingOriginId} />
                    </div>
                    <div className="row">
                        <label htmlFor="difficulty">推定難易度:&nbsp;</label>
                        <select id="difficulty"
                            value={currentDifficulty}
                            onChange={e => d(EditorActions.changeDifficulty(parseInt(e.target.value)))}>
                            <option value={1}>Beginner(1)</option>
                            <option value={2}>Intermediate(2)</option>
                            <option value={3}>Advanced(3)</option>
                            <option value={4}>Expert(4)</option>
                        </select>
                    </div>
                    <div className="row nospace">
                        <p style={{ paddingLeft: "6em", opacity: 0.5, fontStyle: "italic" }}>{DifficultyDescText[currentDifficulty - 1]}</p>
                    </div>
                    <div className="row twoliner">
                        <label htmlFor="q_text">クイズ内容:</label>
                        <textarea id="q_text" rows={5} ref={qText}></textarea>
                    </div>
                    <div className="subgroup">
                        <header>
                            <h3>選択肢:</h3>
                            <button type="button" onClick={_ => d(EditorActions.newChoice())}>＋</button>
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
                        <button type="button">取り消し</button>
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

    asRowElements(onRowHover: (_: React.MouseEvent) => void, onRowBlur: (_: React.MouseEvent) => void, dispatch: Redux.Dispatch, selected: boolean): JSX.Element[]
    {
        const commonClass = selected ? ["selected"] : [];
        const text = this.text.split("\n").map((l, n) => n > 0 ? [<br />, l] : [l]);

        return [
            <div className={[...commonClass, "numcenter"].join(" ")}
                onMouseOver={onRowHover} onMouseOut={onRowBlur}
                onClick={_ => dispatch(EditorActions.editQuestion(this.id))}>
                    {this.id}
            </div>,
            <div className={[...commonClass, "nohpad"].join(" ")}
                onMouseOver={onRowHover} onMouseOut={onRowBlur}
                onClick={_ => dispatch(EditorActions.editQuestion(this.id))}>
                    {text}
            </div>,
            <div className={[...commonClass, "numcenter"].join(" ")}
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
                rows.map((r, n) => r.asRowElements(_ => setHoverIndex(n), _ => setHoverIndex(null), d, hoverIndex == n))
            }
        </div>
    </section>;
}

function AppMain(): JSX.Element
{
    const [showEditor, editOriginId] = useSelector((s: State) => [s.showEditorPopup, s.editOriginId]);

    if (showEditor)
    {
        return <div><QuestionList /><QuestionEditorPopup editingOriginId={editOriginId} /></div>;
    }
    else
    {
        return <div><QuestionList /></div>;
    }
}

const store = Redux.createStore(Reducers);

ReactDOM.render(<Provider store={store}><AppMain /></Provider>, document.getElementById("app"));

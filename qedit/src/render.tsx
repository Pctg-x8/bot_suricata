
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
    create: boolean
};
function QuestionEditorPopup(props: EditorPopupProperties): JSX.Element
{
    const title = props.create ? "新しいクイズ" : "クイズを編集";

    const d = useDispatch();
    const [
        choices, currentDifficulty, currentCorrectNum
    ] = useSelector((s: State) => [
        s.choices, s.difficulty, s.correctNumber
    ]);

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
    return <section className="popup">
        <h1>{title}</h1>
        <div className="container">
            <form>
                <div className="row">
                    <label htmlFor="q_id">ID:&nbsp;</label>
                    <input type="input" id="q_id" />
                </div>
                <div className="row">
                    <label htmlFor="difficulty">推定難易度:&nbsp;</label>
                    <select id="difficulty" onChange={e => d(EditorActions.changeDifficulty(parseInt(e.target.value)))}>
                        <option value={1} selected={currentDifficulty == 1}>Beginner(1)</option>
                        <option value={2} selected={currentDifficulty == 2}>Intermediate(2)</option>
                        <option value={3} selected={currentDifficulty == 3}>Advanced(3)</option>
                        <option value={4} selected={currentDifficulty == 4}>Expert(4)</option>
                    </select>
                </div>
                <div className="row nospace">
                    <p style={{ paddingLeft: "6em", opacity: 0.5, fontStyle: "italic" }}>{DifficultyDescText[currentDifficulty - 1]}</p>
                </div>
                <div className="row twoliner">
                    <label htmlFor="q_text">クイズ内容:</label>
                    <textarea id="q_text" rows={5}></textarea>
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
                    <textarea id="a_text_desc_correct" rows={2}></textarea>
                </div>
                <div className="row twoliner">
                    <label htmlFor="a_text_desc_incorrect">不正解時の解説文:</label>
                    <textarea id="a_text_desc_incorrect" rows={2}></textarea>
                </div>
                <div className="row right">
                    {!props.create && <button type="button">キャンセル</button>}
                    <button type="submit">作成</button>
                </div>
            </form>
        </div>
    </section>;
}

function AppMain(): JSX.Element
{
    return <div>
        <QuestionEditorPopup create={false} />
    </div>;
}

const store = Redux.createStore(Reducers);

ReactDOM.render(<Provider store={store}><AppMain /></Provider>, document.getElementById("app"));

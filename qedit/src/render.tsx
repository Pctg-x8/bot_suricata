
import "./style.sass";
import * as React from "react";
import * as ReactDOM from "react-dom";

type EditorPopupProperties =
{
    create: boolean
};
function QuestionEditorPopup(props: EditorPopupProperties): JSX.Element
{
    const title = props.create ? "新しいクイズ" : "クイズを編集";

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
                    <select id="difficulty">
                        <option value={1}>Beginner(1)</option>
                        <option value={2}>Intermediate(2)</option>
                        <option value={3}>Advanced(3)</option>
                        <option value={4}>Expert(4)</option>
                    </select>
                </div>
                <div className="row twoliner">
                    <label htmlFor="q_text">クイズ内容:</label>
                    <textarea id="q_text" rows={5}></textarea>
                </div>
                <div className="subgroup">
                    <header>
                        <h3>選択肢:</h3>
                        <button type="button">＋</button>
                    </header>
                    <ul>
                        <li>
                            <input type="radio" className="inline" name="correct" value={1} />
                            <input type="text" className="inline expanded" />
                            <button type="button">×</button>
                        </li>
                        <li>
                            <input type="radio" className="inline" name="correct" value={2} />
                            <input type="text" className="inline expanded" />
                            <button type="button">×</button>
                        </li>
                    </ul>
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

ReactDOM.render(<AppMain />, document.getElementById("app"));

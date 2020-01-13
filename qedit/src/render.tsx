
import "./style.sass";
import * as React from "react";
import * as ReactDOM from "react-dom";

function QuestionEditorPopup(): JSX.Element
{
    return <section className="popup">
        <h1>新しいクイズ</h1>
        <div className="container">
            <form>
                <div className="row">
                    <label htmlFor="q_id">ID:&nbsp;</label>
                    <input type="input" id="q_id" />
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
                            <input type="radio" className="inline" />
                            <input type="text" className="inline expanded" />
                            <button type="button">×</button>
                        </li>
                        <li>
                            <input type="radio" className="inline" />
                            <input type="text" className="inline expanded" />
                            <button type="button">×</button>
                        </li>
                    </ul>
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
        <QuestionEditorPopup />
    </div>;
}

ReactDOM.render(<AppMain />, document.getElementById("app"));

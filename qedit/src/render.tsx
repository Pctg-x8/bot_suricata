
import "./style.sass";
import * as React from "react";
import * as ReactDOM from "react-dom";

function AppMain(): JSX.Element
{
    return <section className="popup">
        <h1>AppMain</h1>
    </section>;
}

ReactDOM.render(<AppMain />, document.getElementById("app"));

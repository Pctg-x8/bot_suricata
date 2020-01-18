
import * as LocalDB from "sqlite3";
import { statSync } from "fs";

export type Choice = Readonly<string>;

export type Question = {
    readonly id: number,
    readonly difficulty: number,
    readonly qText: string,
    readonly aTextDescCorrect: string,
    readonly aTextDescIncorrect: string,
    readonly orderedChoices: Choice[]
};

class QuestionDB
{
    readonly con: LocalDB.Database;

    constructor()
    {
        this.con = new LocalDB.Database("../qa.db");
    }

    async load(id: number): Promise<Question>
    {
        const qrow = await new Promise<any>((resv, rej) =>
            this.con.prepare("Select id, difficulty, q_text, a_text_desc_correct, a_text_desc_incorrect from qa where id = ?")
                .get(id, (err, row) => { if (err) rej(err); else resv(row); })
        );
        const stmt_choices = this.con.prepare("Select a_text from choices where q_id = ? order by num");

        return new Promise<Question>((resv, rej) =>
        {
            const choices: string[] = [];
            stmt_choices.each(qrow.id, (e, r) => 
            {
                if (e) return rej(e);
                choices.push(r.a_text);
            }, (e) =>
            {
                if (e) rej(e);
                else resv({
                    id: qrow.id,
                    difficulty: qrow.difficulty,
                    qText: qrow.q_text,
                    aTextDescCorrect: qrow.a_text_desc_correct,
                    aTextDescIncorrect: qrow.a_text_desc_incorrect,
                    orderedChoices: choices
                });
            });
        });
    }
}

const qdb = new QuestionDB();
export default qdb;

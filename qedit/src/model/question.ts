
import * as LocalDB from "sqlite3";

export type Choice = Readonly<string>;

export type Question = {
    readonly id: number,
    readonly difficulty: number,
    readonly qText: string,
    readonly aTextDescCorrect: string,
    readonly aTextDescIncorrect: string,
    readonly orderedChoices: Choice[],
    readonly correctAnsNum: number,
    readonly showChoiceAtrandom: boolean
};
export type QuestionTableRow = {
    readonly id: number,
    readonly qText: string,
    readonly ansCount: number
};

class QuestionDB
{
    readonly con: LocalDB.Database;

    constructor()
    {
        this.con = new LocalDB.Database("../qa.db");
    }

    loadAllAsTableRow(): Promise<QuestionTableRow[]>
    {
        const rows: QuestionTableRow[] = [];
        return new Promise((resv, rej) =>
            this.con.each(
                "Select id, q_text, count(q_text) as ans_count from qa left join choices on q_id = id group by q_text",
                (e, r) =>
                {
                    if (e) return rej(e);
                    rows.push({ id: r.id, qText: r.q_text, ansCount: r.ans_count });
                },
                (e, _) =>
                {
                    if (e) rej(e); else resv(rows);
                }
            )
        );
    }
    async load(id: number): Promise<Question | null>
    {
        const qrow = await new Promise<any>((resv, rej) =>
            this.con.prepare("Select id, difficulty, q_text, a_text_desc_correct, a_text_desc_incorrect, correct_answer_num, show_choice_atrandom from qa where id = ?")
                .get(id, (err, row) => { if (err) rej(err); else resv(row); })
        );
        const stmt_choices = this.con.prepare("Select a_text from choices where q_id = ? order by num");
        if (!qrow) return null;

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
                    orderedChoices: choices,
                    correctAnsNum: qrow.correct_answer_num,
                    showChoiceAtrandom: qrow.show_choice_atrandom
                });
            });
        });
    }
}

const qdb = new QuestionDB();
export default qdb;

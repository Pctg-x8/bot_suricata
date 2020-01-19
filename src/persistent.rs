
#[derive(Debug)]
pub enum QueryError
{
    PoolService(r2d2::Error),
    Sqlite(rusqlite::Error)
}
impl From<r2d2::Error> for QueryError
{
    fn from(v: r2d2::Error) -> Self { Self::PoolService(v) }
}
impl From<rusqlite::Error> for QueryError
{
    fn from(v: rusqlite::Error) -> Self { Self::Sqlite(v) }
}

pub struct Persistent
{
    cpool: r2d2::Pool<r2d2_sqlite::SqliteConnectionManager>
}
impl Persistent
{
    pub fn new(db_file_path: &str) -> Result<Self, r2d2::Error>
    {
        let cm = r2d2_sqlite::SqliteConnectionManager::file(db_file_path);
        let cpool = r2d2::Pool::new(cm)?;

        Ok(Persistent { cpool })
    }
}

#[derive(Debug)]
pub struct Question
{
    pub difficulty_level: u32,
    pub q_text: String,
    pub a_text_desc_correct: String,
    pub a_text_desc_incorrect: String,
    pub ordered_choices: Vec<String>,
    pub correct_ans_number: u32,
    pub show_choice_atrandom: bool
}
impl Persistent
{
    pub fn fetch_question_atrandom(&self) -> Result<Question, QueryError>
    {
        // Note: 取得処理が重くなってきたら、その時クエリを考え直す
        let con = self.cpool.get()?;
        let mut stmt = con.prepare("Select a_text from choices where q_id=? order by num")?;

        let (qid, difficulty_level, q_text, a_text_desc_correct, a_text_desc_incorrect, correct_ans_number, show_choice_atrandom) = con.query_row(
            "Select id, difficulty, q_text, a_text_desc_correct, a_text_desc_incorrect, correct_answer_num, show_choice_atrandom from qa order by random() limit 1",
            rusqlite::NO_PARAMS,
            |r| Ok((r.get::<_, u32>(0)?, r.get(1)?, r.get(2)?, r.get(3)?, r.get(4)?, r.get(5)?, r.get(6)?))
        )?;
        let mut crs = stmt.query(&[&qid])?;

        let mut ordered_choices = Vec::new();
        while let Some(r) = crs.next()? { ordered_choices.push(r.get(0)?); }
        
        Ok(Question
        {
            difficulty_level,
            q_text, a_text_desc_correct, a_text_desc_incorrect,
            ordered_choices,
            correct_ans_number,
            show_choice_atrandom
        })
    }
}


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
    pub choices: Vec<String>
}
impl Persistent
{
    pub fn fetch_question_atrandom(&self) -> Result<Question, QueryError>
    {
        // Note: 取得処理が重くなってきたら、その時クエリを考え直す
        let con = self.cpool.get()?;
        let mut stmt = con.prepare("Select a_text from choices where q_id=? order by num")?;

        let (qid, difficulty_level, q_text, a_text_desc_correct, a_text_desc_incorrect) = con.query_row(
            "Select id, difficulty, q_text, a_text_desc_correct, a_text_desc_incorrect from qa order by random() limit 1",
            rusqlite::NO_PARAMS,
            |r| Ok((r.get::<_, u32>(0)?, r.get(1)?, r.get(2)?, r.get(3)?, r.get(4)?))
        )?;
        let mut crs = stmt.query(&[&qid])?;

        let mut choices = Vec::new();
        while let Some(r) = crs.next()? { choices.push(r.get(0)?); }
        
        Ok(Question
        {
            difficulty_level,
            q_text, a_text_desc_correct, a_text_desc_incorrect,
            choices
        })
    }
}

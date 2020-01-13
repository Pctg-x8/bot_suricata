
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

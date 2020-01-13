
mod persistent;
use persistent::Persistent;

fn main()
{
    let p = Persistent::new("qa.db").expect("failed to initialize persistent masters");
    let q = p.fetch_question_atrandom().expect("failed to fetch a question");

    println!("今日のわくわく動物クイズ、ですわ！");
    println!("{:#?}", q);
}

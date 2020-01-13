
mod persistent;
use persistent::Persistent;

fn main()
{
    let p = Persistent::new("qa.db");

    println!("Hello, world!");
}

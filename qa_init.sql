-- sink this sql to create empty qa.db

Create table qa (
    id Integer Primary key,
    q_text Text Not null Unique,
    a_text_desc_corrent Text Not null,
    a_text_desc_incorrect Text
);

Create table choices (
    q_id Integer Not null References qa(id) on delete Cascade,
    num Integer Not null,
    a_text Text Not null,
    Unique(q_id, num, a_text)
);

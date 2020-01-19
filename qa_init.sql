-- sink this sql to create empty qa.db

Create table qa (
    id Integer Primary key,
    difficulty Integer Not null,
    q_text Text Not null Unique,
    correct_answer_num Integer Not null,
    show_choice_atrandom Boolean Not null Default false,
    a_text_desc_correct Text Not null,
    a_text_desc_incorrect Text
);

Create table choices (
    q_id Integer Not null References qa(id) on delete Cascade,
    num Integer Not null,
    a_text Text Not null,
    Unique(q_id, num)
);

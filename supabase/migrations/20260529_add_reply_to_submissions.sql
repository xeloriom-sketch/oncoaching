alter table submissions
  add column if not exists reply_text    text,
  add column if not exists replied_at   timestamptz;

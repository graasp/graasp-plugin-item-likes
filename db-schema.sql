CREATE TABLE item_like (
  id uuid DEFAULT uuid_generate_v4(),
  item_id uuid NOT NULL REFERENCES item("id") ON DELETE CASCADE,
  member_id uuid NOT NULL REFERENCES member("id") ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc'),
  PRIMARY KEY (item_id, member_id)
);
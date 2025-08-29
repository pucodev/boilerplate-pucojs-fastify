CREATE TABLE public.items (
  id serial PRIMARY KEY,
  name VARCHAR(100) NULL,
  created_at timestamptz NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO
  public.items (name)
VALUES
  ('demo1'),
  ('demo2');

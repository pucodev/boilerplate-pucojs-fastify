CREATE TABLE public.users (
  id serial PRIMARY KEY,
  firstname VARCHAR(255) NULL,
  lastname VARCHAR(255) NULL,
  email VARCHAR(100) NULL,
  created_at timestamptz NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NULL DEFAULT CURRENT_TIMESTAMP
);

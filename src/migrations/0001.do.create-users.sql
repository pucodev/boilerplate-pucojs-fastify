CREATE TABLE public.users (
  id serial PRIMARY KEY,
  firstname VARCHAR(255) NOT NULL,
  lastname VARCHAR(255) NOT NULL,
  email VARCHAR(100) NOT NULL,
  created_at timestamptz NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NULL DEFAULT CURRENT_TIMESTAMP
);

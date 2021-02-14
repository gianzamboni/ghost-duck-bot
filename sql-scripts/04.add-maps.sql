CREATE TYPE phasmo.map_size AS ENUM ('small', 'medium', 'large');

CREATE TABLE phasmo.map (
    id SMALLINT NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 0 MINVALUE 0 MAXVALUE 20 CACHE 1 ),
    name CHARACTER VARYING(50) COLLATE pg_catalog."default" NOT NULL,
    size phasmo.map_size NOT NULL,
    gif_link CHARACTER VARYING(50),

    CONSTRAINT "PK_MAP_TYPE" PRIMARY KEY (id),
    CONSTRAINT "UNIQUE_MAP_NAME" UNIQUE (name)
);

INSERT INTO phasmo.map (name, size, gif_link) VALUES
  ('tanglewood street house', 'small', 'https://gph.is/g/a9RMYYJ'),
  ('edgefield street house', 'small', 'https://gph.is/g/a9RMYeP'),
  ('ridgeview road house', 'small', 'https://gph.is/g/4oW9MMK'),
  ('grafton farmhouse', 'small', 'https://gph.is/g/ZPGBgXl'),
  ('bleasdale farmhouse', 'small', 'https://gph.is/g/aXVQkJR'),
  ('brownstone high school', 'medium', 'https://gph.is/g/apW91QB'),
  ('prison', 'medium', 'https://gph.is/g/EGnD7NJ'),
  ('asylum', 'large', 'https://gph.is/g/aRjB6gO');
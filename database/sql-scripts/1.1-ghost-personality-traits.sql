  ALTER TABLE ghost_type
      ADD COLUMN advice text;

  UPDATE ghost_type SET
    advice = 'The Spirit is, fittingly, the most generic of the Ghosts and has no special powers. This kind of becomes annoying when you''re trying to guess because the lack of any distinction makes it difficult to rule out. The Spirit Box can be finicky, but the Writing and Fingerprints can help pinpoint this guy.'::text
  WHERE name='spirit';

  UPDATE ghost_type SET
    advice = 'The Wraith can also travel through walls, but since Ghosts already teleport to begin with, this doesn''t have as big of an effect as you''ll expect on gameplay or identifying it. You''ll hear less footsteps when a Wraith is around, so if you''ve heard a conspicuous absence of these, you may have one on your hands. NOTE: Just because a Ghost walked into a wall and vanished does not mean that it''s a Wraith. This is a graphical bug and does not rule the Wraith in or out as a suspect.'::text
  WHERE name='wraith';

  UPDATE ghost_type SET
    advice = 'Since you have a photo camera right there - wait for the Phantom to appear (which it loves to do) and take a picture. If it instantly disappears and you have one of the pieces of evidence, chances are it''s a Phantom.'::text
  WHERE name='phantom';

  UPDATE ghost_type SET
    advice = 'This one is pretty easy to bullseye. The fingerprints are easy enough to spot due to how the Poltergeist’s special power works; when the Poltergeist interacts with an object, it ''swings'' and affects multiple objects at once. This means that if you walk into a room and see multiple objects already on the floor before you enter, or if the Ghost whacks a bottle of cream off the sink and turns it on in one go, my money''s on the Poltergeist..'::text
  WHERE name='poltergeist';

  UPDATE ghost_type SET
    advice = 'If you''re far from the Ghost Room and a hunt begins, and you nearly-immediately hear Ghost footsteps, chances are you''re facing a Banshee and you are its target - she will always begin a Hunt near you. Not much comfort, since you''ll realize this far too late, and pretty useless on smaller maps.'::text
  WHERE name='banshee';

  UPDATE ghost_type SET
    advice = 'The Jinn is actually fairly unique. A hidden passive allows it to nuke your sanity if you run into it, but this may be a bug. The easiest way to tell a Jinn is by what it interacts with - if the only things going off are electronics (lights, cars, stoves, radios, phones), then you''re likely facing a Jinn. The Jinn will almost never cut the power, although it''s not unheard of.'::text
  WHERE name='jinn';

  UPDATE ghost_type SET
    advice = 'Ostensibly, she''ll focus on lights - turning them off, killing the fusebox, etc. This doesn''t always bear out, and sometimes the Mare will heavily interact with objects as well, as well as sometimes turn the lights on. You will get lucky occasionally and clearly see a pattern of turning the lights/breakers off, but this isn''t guaranteed. '::text
  WHERE name='mare';

  UPDATE ghost_type SET
    advice = 'The Revenant has one tell, but it''s hard to spot and requires a Hunt. When the Hunt begins, you can hear the Revenant''s footsteps - they''ll be relatively quick. Hide in a closet, and you''ll hear them slow down to a crawl. Aside from this, they don''t have many unique traits.'::text
  WHERE name='revenant';

  UPDATE ghost_type SET
    advice = 'Shades are super annoying, and go one of two ways; either they''ll live up entirely to their name, or just totally ignore it. They''ll either be super passive and never act, or they''ll be super aggressive, rivaling Demons.'::text
  WHERE name='shade';

  UPDATE ghost_type SET
    advice = 'Demons aren''t particularly hard to pinpoint, but a pissed-off Demon will really give you a bad day. Expect near-constant hunts. You can check for a Demon with a Ouija board'::text
  WHERE name='demon';

  UPDATE ghost_type SET
    advice = 'The Yurei''s big tell is the sanity hit - it''ll be pretty big, especially if you''re in the building for some time. Aside from this, you''ll have to do this based on the evidence.'::text
  WHERE name='yurei';

  UPDATE ghost_type SET
    advice = 'The Oni seems to like to move objects around, but only one at a time and long distances. Aside from this, there''s not many great tells.'::text
  WHERE name='oni';

UPDATE metadata SET
  value = '1.1'
WHERE name='version';
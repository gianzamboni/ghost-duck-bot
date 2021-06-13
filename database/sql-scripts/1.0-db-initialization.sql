-- Create metadata table
CREATE TABLE IF NOT EXISTS metadata(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 0 MINVALUE 0 MAXVALUE 9223372036854775807 CACHE 1 ),
    name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    value character varying(100) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "PK_METADATA" PRIMARY KEY (id)
);

-- Create Ghost Type table
CREATE TABLE ghost_type (
    id smallint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 0 MINVALUE 0 MAXVALUE 20 CACHE 1 ),
    name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    weakness text COLLATE pg_catalog."default",
    strength text COLLATE pg_catalog."default",
    details text COLLATE pg_catalog."default",
    CONSTRAINT "PK_GHOTST_TYPE" PRIMARY KEY (id),
    CONSTRAINT "UNIQUE_GHOST_NAME" UNIQUE (name)
);

-- Create Evidence table
CREATE TABLE evidence (
    id smallint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 0 MINVALUE 0 MAXVALUE 10 CACHE 1 ),
    name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    short_name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "PK_EVIDENCE" PRIMARY KEY (id),
    CONSTRAINT "UNIQUE_EVIDENCE_NAME" UNIQUE (name),
    CONSTRAINT "UNIQUE_EVIDENCE_SHORT_NAME" UNIQUE (short_name)
);

-- Create Ghost gives Evidence table
CREATE TABLE ghost_gives_evidence (
    ghost_id smallint NOT NULL,
    evidence_id smallint NOT NULL,
    CONSTRAINT "PK_ghost_evidence" PRIMARY KEY (ghost_id, evidence_id),
    CONSTRAINT "FK_GIVES_EVIDENCE_ID" FOREIGN KEY (evidence_id)
        REFERENCES evidence (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT "FK_GIVES_GHOST_ID" FOREIGN KEY (ghost_id)
        REFERENCES ghost_type (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

INSERT INTO ghost_type(name, strength, weakness, details) VALUES
    ('spirit',
        'Using Smudge Sticks on a Spirit will stop it attacking for 120 seconds instead of 90.',
        'The spirit has no discernible strengths, however it is known to increase its hunting as your sanity drops.',
        'In the absence of evidence, it is very difficult to distinguish a Spirit from any other given ghost type; Though they have no particular behaviors, it is exactly their lack of any defining traits that can confuse investigators, as Spirits can be mistaken for other ghost types until evidence is gathered, with the use Smudge Sticks being the only sign otherwise. Ranging from shy to active, passive to hostile, slow-moving to quick when hunting, a Spirit can have any number of perceived characteristics.'),
    ('wraith',
        'Wraiths almost never touch the ground, meaning footprint sounds are rare to non-existant. It can travel through walls and doors without opening them. Wraiths will however leave footprints in salt if stepped in.',
        'Wraiths have a toxic reaction to Salt. If a Wraith comes into contact with a pile of salt, it will immediately cease attacking.',
        'The Wraith''s power is that it will teleport onto a random player in the Ghost Room, emitting an interaction EMF.'),
    ('phantom',
        'Looking at a Phantom will considerably drop your Sanity. This refers to any visible manifestations of the Phantom, including during a Hunt.',
        'Taking a photo of the Phantom will make it temporarily disappear. The Photo Camera will make it disappear, but it will not stop a Hunt.',
        'When the Phantom manifests, it can take on the appearance of one of your teammates, not excluding the appearance of the viewer'),
    ('poltergeist',
        'A Poltergeist is capable of influencing more objects at once than any other Ghosts, and is capable of shutting multiple doors at once.',
        'A Poltergeist is almost ineffective in an empty room.',
        'A Poltergeist''s ability to manipulate objects, specifically doors, can make it easier to identify. However, if the ghost is one that specifically affects multiple light fixtures and other electronics at once, it''s more likely to be a Jinn.'),
    ('banshee',
        'A Banshee will focus on one player at a time until it kills them.',
        'Banshees fear the Crucifix, which boosts the Hunt-stopping range of one from 3 meters to 5 meters against it',
        'Once a Banshee uses its power, it will begin to navigate to its chosen target. Line-of-sight blockers and hiding have no effect on the Banshee''s ability to navigate to the player, and it will be able to reach them. After reaching the player, it will wait ~20 seconds, then proceed to begin a hunt if the player has been within direct line-of-sight of the Banshee while it was navigating to the player.'),
    ('jinn',
        'A Jinn will travel at a faster speed if its victim is far away.',
        'Turning off the location''s power source will prevent the Jinn from using its ability.',
        'Jinns tend to interact with electronics more than any other  They may cause phones to ring, radios to activate, TV''s to turn on, or car alarms to go off more often. This also extends to light switches, which may cause unsure investigators to confuse a Jinn for a Mare or Poltergeist'),
    ('mare',
        'Increased chance to attack in the dark. As such, it will do what it can to achieve this, such as turning off lights and tripping the fuse box.',
        'Turning the lights on will lower its chance to attack.',
        'It tends to turn lights and the fuse box off more than any other ghost type when active, although if a ghost switches lights back on, it is much more likely to be a Poltergeist or Jinn'),
    ('revenant',
        'A Revenant will travel at a significantly faster speed when hunting a victim. Additionally, the Revenant can freely switch whoever it is targeting during a Hunt.',
        'Hiding from the Revenant will cause it to move very slowly.',
        'Unlike other Ghosts, who will often have a specific target selected when starting a Hunt they will hone in on, Revenants can freely switch targets if there is another player that is closer by - and especially one that is in plain view and available, making its goal of killing players more convenient.'),
    ('shade',
        'As a shy ghost, a Shade will rarely perform actions in the presence of two or more people, making it harder to detect.',
        'Conversely, a Shade will rarely start a Hunt when players are grouped together.',
        'If a Shade is already hunting, it will prefer to target players that are alone. The Shade follows the general definition of "alone", in the sense of a player being in a room on their own, even if other players are physically close.'),
    ('demon',
        'Demons are the most aggressive and enter hunt mode more.',
        'Asking a Demon successful questions on the Ouija Board won''t lower the user''s sanity',
        'They are notorious for initiating hunts frequently, a trait that is exacerbated by lower sanity levels, and compounded by higher difficulties like Professional where hunts last much longer. Taking all of these factors into account, Demons at their most aggressive will hunt in intervals as short as half-minutes, forcing the players to spend more total time hiding than investigating.'),
    ('yurei',
        'Yurei have been known to have a stronger effect on people''s Sanity.',
        'Using Smudge Sticks on the Yurei''s Ghost Room will cause it to not wander around the location for ~90 seconds.',
        'The sanity drain is believed to scale with difficulty. Be sure to keep track of Sanity, and use Sanity Pills when necessary, as players will ultimately reach lower sanity levels faster, allowing for the Yurei to become more aggressive and be able trigger Hunts sooner into a mission.'),
    ('oni',
        'Oni are more active when people are nearby and have been seen moving objects at great speed.',
        'Being more active will make the Oni easier to find and identify.',
        'Unlike with most other ghost types, splitting up is the best method of defense when searching for an Oni, as it much less active while players are alone.  it will throw objects around the room with great force when interacting with them. However, these objects are not dangerous to the hunters or their sanity unlike those thrown by Poltergeists.');

-- FILL EVIDENCE TABLE
INSERT INTO evidence(name, short_name) VALUES
    ('ghost orb', 'orb'),
    ('spirit box', 'box'),
    ('fingerprints', 'prints'),
    ('emf level 5', 'emf'),
    ('freezing temperatures', 'freeze'),
    ('ghost writing', 'writing');

-- FILL GHOST GIVES EVIDENCE
INSERT INTO ghost_gives_evidence(ghost_id, evidence_id) VALUES
    ((SELECT id FROM ghost_type WHERE name='banshee'), (SELECT id FROM evidence WHERE name='emf level 5')),
    ((SELECT id FROM ghost_type WHERE name='banshee'), (SELECT id FROM evidence WHERE name='fingerprints')),
    ((SELECT id FROM ghost_type WHERE name='banshee'), (SELECT id FROM evidence WHERE name='freezing temperatures')),
    ((SELECT id FROM ghost_type WHERE name='demon'), (SELECT id FROM evidence WHERE name='ghost writing')),
    ((SELECT id FROM ghost_type WHERE name='demon'), (SELECT id FROM evidence WHERE name='spirit box')),
    ((SELECT id FROM ghost_type WHERE name='demon'), (SELECT id FROM evidence WHERE name='freezing temperatures')),
    ((SELECT id FROM ghost_type WHERE name='jinn'), (SELECT id FROM evidence WHERE name='emf level 5')),
    ((SELECT id FROM ghost_type WHERE name='jinn'), (SELECT id FROM evidence WHERE name='spirit box')),
    ((SELECT id FROM ghost_type WHERE name='jinn'), (SELECT id FROM evidence WHERE name='ghost orb')),
    ((SELECT id FROM ghost_type WHERE name='mare'), (SELECT id FROM evidence WHERE name='spirit box')),
    ((SELECT id FROM ghost_type WHERE name='mare'), (SELECT id FROM evidence WHERE name='freezing temperatures')),
    ((SELECT id FROM ghost_type WHERE name='mare'), (SELECT id FROM evidence WHERE name='ghost orb')),
    ((SELECT id FROM ghost_type WHERE name='oni'), (SELECT id FROM evidence WHERE name='emf level 5')),
    ((SELECT id FROM ghost_type WHERE name='oni'), (SELECT id FROM evidence WHERE name='ghost writing')),
    ((SELECT id FROM ghost_type WHERE name='oni'), (SELECT id FROM evidence WHERE name='spirit box')),
    ((SELECT id FROM ghost_type WHERE name='phantom'), (SELECT id FROM evidence WHERE name='emf level 5')),
    ((SELECT id FROM ghost_type WHERE name='phantom'), (SELECT id FROM evidence WHERE name='freezing temperatures')),
    ((SELECT id FROM ghost_type WHERE name='phantom'), (SELECT id FROM evidence WHERE name='ghost orb')),
    ((SELECT id FROM ghost_type WHERE name='poltergeist'), (SELECT id FROM evidence WHERE name='fingerprints')),
    ((SELECT id FROM ghost_type WHERE name='poltergeist'), (SELECT id FROM evidence WHERE name='spirit box')),
    ((SELECT id FROM ghost_type WHERE name='poltergeist'), (SELECT id FROM evidence WHERE name='ghost orb')),
    ((SELECT id FROM ghost_type WHERE name='revenant'), (SELECT id FROM evidence WHERE name='emf level 5')),
    ((SELECT id FROM ghost_type WHERE name='revenant'), (SELECT id FROM evidence WHERE name='ghost writing')),
    ((SELECT id FROM ghost_type WHERE name='revenant'), (SELECT id FROM evidence WHERE name='fingerprints')),
    ((SELECT id FROM ghost_type WHERE name='shade'), (SELECT id FROM evidence WHERE name='emf level 5')),
    ((SELECT id FROM ghost_type WHERE name='shade'), (SELECT id FROM evidence WHERE name='ghost writing')),
    ((SELECT id FROM ghost_type WHERE name='shade'), (SELECT id FROM evidence WHERE name='ghost orb')),
    ((SELECT id FROM ghost_type WHERE name='spirit'), (SELECT id FROM evidence WHERE name='fingerprints')),
    ((SELECT id FROM ghost_type WHERE name='spirit'), (SELECT id FROM evidence WHERE name='ghost writing')),
    ((SELECT id FROM ghost_type WHERE name='spirit'), (SELECT id FROM evidence WHERE name='spirit box')),
    ((SELECT id FROM ghost_type WHERE name='wraith'), (SELECT id FROM evidence WHERE name='fingerprints')),
    ((SELECT id FROM ghost_type WHERE name='wraith'), (SELECT id FROM evidence WHERE name='freezing temperatures')),
    ((SELECT id FROM ghost_type WHERE name='wraith'), (SELECT id FROM evidence WHERE name='spirit box')),
    ((SELECT id FROM ghost_type WHERE name='yurei'), (SELECT id FROM evidence WHERE name='ghost writing')),
    ((SELECT id FROM ghost_type WHERE name='yurei'), (SELECT id FROM evidence WHERE name='freezing temperatures')),
    ((SELECT id FROM ghost_type WHERE name='yurei'), (SELECT id FROM evidence WHERE name='ghost orb'));

GRANT CONNECT ON DATABASE phasmo TO discord_bot;
GRANT USAGE ON SCHEMA public TO discord_bot;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO discord_bot;

INSERT INTO metadata (name, value)
VALUES ('version'::character varying, '1.0'::character varying)
returning id;
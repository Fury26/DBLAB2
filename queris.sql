-- deleting club example

DELETE FROM club_stadium WHERE club_id = 6;
DELETE FROM clubs_tournaments WHERE club_id = 6;
DELETE FROM match WHERE home_club_id = 6 OR away_club_id = 6;
UPDATE player SET club_id = NULL WHERE club_id = 6;
DELETE FROM club WHERE id = 6;
SELECT * FROM club;

-- deleting from stadiun
DELETE FROM club_stadium WHERE stadium_id = id;
DELETE FROM stadiun WHERE id = id;

-- inset into match
INSERT INTO match(tournament_id, home_club_id, away_club_id, datetime, result, ticket_cost) 
values(2, 7, 5, '10/11/2020'::timestamp, '1:0', '30'::money);

SELECT * FROM match;


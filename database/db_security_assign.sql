CREATE ROLE cyber_app
LOGIN
PASSWORD 'cyberapp123';


GRANT CONNECT ON DATABASE cyber_lakshya
TO cyber_app;

GRANT USAGE ON SCHEMA public
TO cyber_app;

GRANT SELECT, INSERT, UPDATE, DELETE
ON ALL TABLES IN SCHEMA public
TO cyber_app;

GRANT USAGE, SELECT
ON ALL SEQUENCES IN SCHEMA public
TO cyber_app;


--------
CREATE ROLE cyber_readonly
LOGIN
PASSWORD 'cyberreadonly123';

GRANT CONNECT ON DATABASE cyber_lakshya
TO cyber_readonly;

GRANT USAGE ON SCHEMA public
TO cyber_readonly;

GRANT SELECT
ON ALL TABLES IN SCHEMA public
TO cyber_readonly;
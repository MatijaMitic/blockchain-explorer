CREATE USER 'bc-user'@'192.168.1.103' IDENTIFIED BY '1234';
GRANT ALL PRIVILEGES ON  blockchain_explorer.* TO 'bc-user'@'192.168.1.103'
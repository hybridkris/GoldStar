SQLite format 3   @                                                                     -�    D                                                                                                                                                                                                                                                                                                                                                                                                                                               �"�'tablestarstarCREATE TABLE star (
	id INTEGER NOT NULL, 
	description VARCHAR(120), 
	category VARCHAR(100), 
	created DATETIME, 
	issuer_id INTEGER, 
	owner_id INTEGER, 
	PRIMARY KEY (id), 
	FOREIGN KEY(issuer_id) REFERENCES user (id), 
	FOREIGN KEY(owner_id) REFERENCES user (id)
)�9�UtableuseruserCREATE TABLE user (
	id INTEGER NOT NULL, 
	"firstName" VARCHAR(50) NOT NULL, 
	"lastName" VARCHAR(50) NOT NULL, 
	email VARCHAR(100) NOT NULL, 
	PRIMARY KEY (id)
)   U ��xU                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     ! +StacyMoschgatsmm144@pitt.edu, GLouWolfordlwolford@problemsolutions.net) CMarkDeweymdewey@problemsolutions.net- EMathewGrahammgraham@problemsolutions.net                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
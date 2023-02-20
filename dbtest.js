const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(
	'./var/db/alimento.db',
	sqlite3.OPEN_READWRITE,
	(err) => {
		if (err) return console.error(err.message);
		console.log('DB CONNECTED');
	}
);

db.get('SELECT * FROM federated_credentials', [], (err, rows) => {
	if (err) return console.error(err.message);
	console.log(rows);
});

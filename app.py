from flask import Flask, render_template
from flask.ext.sqlalchemy import SQLAlchemy
import datetime
import flask.ext.restless


app = Flask(__name__)
app.config['DEBUG'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
db = SQLAlchemy(app)


class Star(db.Model):

	id = db.Column(db.Integer, primary_key=True)
	description = db.Column(db.Unicode(120))
	category = db.Column(db.Unicode(100))
	created = db.Column(db.DateTime, default = datetime.datetime.now())
	issuer_id = db.Column(db.Integer, db.ForeignKey('user.id'))
	owner_id = db.Column(db.Integer, db.ForeignKey('user.id'))
	issuer = db.relationship("User", backref="issued", primaryjoin='Star.issuer_id==User.id')
	owner = db.relationship("User", backref="stars", primaryjoin="Star.owner_id==User.id")

class User(db.Model):

	id = db.Column(db.Integer, primary_key = True)
	firstName = db.Column(db.Unicode(50))
	lastName = db.Column(db.Unicode(50))
	email = db.Column(db.Unicode(100))
	

@app.route('/index.html')
@app.route('/')
def index():
	return render_template('index.html')

@app.route('/main.html')
def main_route():
	return render_template('main.html')
db.create_all()


manager = flask.ext.restless.APIManager(app, flask_sqlalchemy_db=db)


manager.create_api(User, methods=['GET', 'POST', 'DELETE'])
manager.create_api(Star, methods=['GET', 'POST', 'DELETE'])	
def main():


	# start the flask loop
	app.run()

if __name__ == "__main__":
	main()

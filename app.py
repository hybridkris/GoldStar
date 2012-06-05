import flask.ext.restless
import datetime
import bcrypt
import flask.ext.sqlalchemy
from flask import Flask, render_template, request, redirect, url_for, session, flash, g, jsonify
from flaskext.oauth import OAuth
from flask.ext.login import current_user, login_user, LoginManager, UserMixin, login_required, logout_user
from flask.ext.wtf import PasswordField, SubmitField, TextField, Form
from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property
import userPageUser
import StarObject
import page


# Create the app for Flask
app = Flask(__name__)
app.config['DEBUG'] = True
SECRET_KEY = 'development key'
#app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://zoubpmfsdtxwoq:3G0ELHUf2BcAOSF1hUxDceKsQL@ec2-23-23-234-187.compute-1.amazonaws.com/resource44881'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///testdb.sqlite'
db = flask.ext.sqlalchemy.SQLAlchemy(app)
TWITTER_APP_ID = '8YsjtlJjL8kRaGDv1SZjmQ'
TWITTER_APP_SECRET_ID = 'QVAWDUstIpIHWhZegr5CqQm1XJHWtBIzOacQdXzP7o'

app.secret_key = SECRET_KEY
oauth = OAuth()

twitter = oauth.remote_app('twitter',
	base_url = 'http://api.twitter.com/1/',
	request_token_url = 'https://api.twitter.com/oauth/request_token',
	access_token_url = 'https://api.twitter.com/oauth/access_token',
	#authorize_url = 'https://api.twitter.com/oauth/authorize',
	authorize_url='http://api.twitter.com/oauth/authenticate',
	consumer_key = TWITTER_APP_ID,
	consumer_secret = TWITTER_APP_SECRET_ID
	)


# User Table Exception and Validation handling
class userValidation(Exception):
	pass

# Star Table Exception and Validation handling
class starValidation(Exception):
	pass


#Star Table that stores Star information between two users
class Star(db.Model):

	id = db.Column(db.Integer, primary_key=True)
	description = db.Column(db.Unicode)
	category = db.Column(db.Unicode)
	created = db.Column(db.DateTime, default = datetime.datetime.now())
	issuer_id = db.Column(db.Integer, db.ForeignKey('user.id'))
	owner_id = db.Column(db.Integer, db.ForeignKey('user.id'))
	hashtag = db.Column(db.Unicode)
	issuer = db.relationship("User", backref="issued", primaryjoin='Star.issuer_id==User.id')
	owner = db.relationship("User", backref="stars", primaryjoin="Star.owner_id==User.id")
	#Validation defs which validate 1 parameter of the table at a time

	#Validates the Description
	@validates('description')
	def validate_description(self, key, string):
		e = ""
		string = string.strip()
		if len(string) > 120:
			e = "Description Length is too long"
		if len(e) > 0:
			exception = starValidation();
			exception.errors = dict(description = e)
			raise exception
		return unicode(string)

	#Validates the Category
	@validates('category')
	def validate_category(self, key, string):
		e = ""
		string = string.strip()
		if len(string) > 100:
			e = "Category Length is too long"
		if len(e) > 0:
			exception = starValidation()
			exception.errors = dict(category = e)
			raise exception
		return unicode(string)

	#Validates the owner ID
	@validates('owner_id')
	def validate_owner_id(self, key, string):
		e=""
		string = str(string)
		if not string.isdigit():
			e = "Digits are only allowed for the ID"
		if str(self.issuer_id) == string:
			e = "Can't give yourself a star"
		if len(e):
			exception = starValidation()
			exception.errors = dict(owner_id = e)
			raise exception
		return int(string)

	#Validates the issuer ID
	@validates('issuer_id')
	def validate_issuer_id(self, key, string):
		e=""
		string = str(string)
		if not string.isdigit():
			e = "Digits are only allowed for the ID"
		if len(e):
			exception = starValidation()
			exception.errors = dict(issuer_id = e)
			raise exception
		return int(string)

#User Table which stores user information and links to stars
class User(db.Model, UserMixin):

	id = db.Column(db.Integer, primary_key = True)
	password = db.Column(db.Unicode)
	firstName = db.Column(db.Unicode)#, nullable = False)
	lastName = db.Column(db.Unicode)#, nullable = False)
	email = db.Column((db.Unicode), unique=True)#, nullable = False)
	twitterUser = db.Column(db.Unicode)
	oauth_token = db.Column(db.Unicode)
	oauth_secret = db.Column(db.Unicode)
	#Validation defs which validate 1 parameter of the table at a time

	#Encrypts Password
	@validates('password')
	def validate_password(self, key, string):
		return unicode(bcrypt.hashpw(string, bcrypt.gensalt()))

	#Validates User Name	
	@validates('userName')
	def validate_userName(self, key, string):
		e=""
		if User.query.filter_by(userName = unicode(string)).count() > 0:
			e = "Username is already being used!"
		if len(e):
			exception = userValidation()
			exception.errors = dict(userName = e)
			raise exception
		return unicode(string.strip())

	#Validates the First Name
	@validates('firstName')
	def validate_firstName(self, key, string):
		string = string.strip()
		if not string.isalpha() or not len(string):
			exception = userValidation()
			exception.errors = dict(firstName = 'Invalid First Name')
			raise exception
		return unicode(string)

	#Validates the Last Name
	@validates('lastName')
	def validate_lastName(self, key, string):
		string = string.strip()
		if not string.isalpha() or not len(string):
			exception = userValidation()
			exception.errors = dict(lastName = 'Invalid Last Name')
			raise exception
		return unicode(string)

	#Validates the Email
	@validates('email')
	def validate_email(self, key, string):
		e = ""
		string = string.strip()
		if not "@" in string:
			e = u"There is no @ in the email"
		if not "." in string:
			e = u"There is no . in the email"
		elif len(string) == 0:
			e = u"No Email Entered"
		elif User.query.filter_by(email = unicode(string)).count() > 0:
			e = u"Email is already being used"
		if len(e) != 0:
			exception = userValidation()
			exception.errors = dict(email = e)
			raise exception
		return unicode(string)

class LoginForm(Form):
	username = TextField('username')
	password = PasswordField('password')
	submit = SubmitField('Login')

login_manager = LoginManager()
login_manager.setup_app(app)


#Initialize the Database
db.create_all()
#Creates an API manager
manager = flask.ext.restless.APIManager(app, flask_sqlalchemy_db=db)

@login_manager.user_loader
def load_user(userid):
	return User.query.get(userid)

#Twitter Authorizations
@app.before_request
def before_request():
	g.user = None
	if 'user_id' in session:
		g.user = User.query.get(session['user_id'])

@app.after_request
def after_request(response):
	db.session.remove()
	return response

@twitter.tokengetter
def get_twitter_token():
	user = g.user
	if user is not None:
		return user.oauth_token, user.oauth_secret

@app.route('/twit')
def twit():
	return twitter.authorize(callback=url_for('oauth_authorized', 
		next = request.args.get('next') or request.referrer or None))

@app.route('/oauth_authorized')
@twitter.authorized_handler
def oauth_authorized(resp):
	if resp is None:
		flash(u'You denied the request to sign in.')
	if resp is not None:
		print resp['screen_name']
	return redirect('/index.html')

@app.route('/tweet', methods = ['POST'])
def tweet():
	if g.user is None:
		return redirect('/twit')
	status = u'@juggler2009 test tag testing 1 2'
	resp = twitter.post('statuses/update.json', data = {'status': status})
	return redirect('/index.html')


#The main index of the Gold Star App
#OLD Login screen
@app.route('/index.html')
def index_route():
	p = page.Page("Gold Star!", False)
	return render_template('index.html', page = p)

#Displays the entire Gold Star App
#OLD GIVE A STAR SCREEN
@app.route('/main.html')
def main_route():
	p = page.Page("Gold Star!", False)
	return render_template('main.html', loginID = current_user.get_id(), page = p)
	
@app.route('/')
@app.route('/mobileview.html')
def mobileview_route():
	if current_user.is_authenticated():
		p = page.Page("Gold Star!", False)
		userID = current_user.get_id()
		u = User.query.filter_by(id = userID).one()
		thisUser = userPageUser.userPageUser(u.firstName, u.lastName, current_user.get_id())
		return render_template('mobileview.html', page = p, user = thisUser)
	else:
		return redirect('login')

#Flask Login Information
@app.route('/login', methods = ['POST', 'GET'])
def login():
	form = LoginForm()
	try:
		if form.validate_on_submit() and request.method == 'POST':
			username, password = form.username.data, form.password.data
			username = username.lower()
			user = User.query.filter_by(email = username).one()
			if bcrypt.hashpw(password, user.password) == user.password:
				login_user(user)
				print "Logged In successfully"
				return redirect('mobileview.html')
		elif request.method == 'POST':
			loginINFO = request.json
			user = User.query.filter_by(email = unicode(loginINFO['email'])).one()
			if bcrypt.hashpw(loginINFO['password'], user.password) == user.password:
				login_user(user)
				print "Logged In successfully"
				return jsonify(dict(id = current_user.get_id()))
	except Exception as ex:
		print ex.message
		flash('Invalid username or password')
	p = page.Page("Log in!", False)
	userID = current_user.get_id()
	if userID !=  None:
		u = User.query.filter_by(id = userID).one()
		thisUser = userPageUser.userPageUser(u.firstName, u.lastName,0)
	else:
		thisUser = None
	return render_template("login.html", form=form, page = p, user = thisUser)

#user page
@app.route('/users/<int:userID>')
def userPage(userID):
	try:
		u = User.query.filter_by(id = userID).one()
		thisUser = userPageUser.userPageUser(u.firstName, u.lastName, userID)
		p = page.Page("Check out this user!", False)
		return render_template("users.html", user = thisUser, page = p)
	except Exception as ex:
		p = page.Page("Oops!", False)
		userID = current_user.get_id()
		u = User.query.filter_by(id = userID).one()
		thisUser = userPageUser.userPageUser(u.firstName, u.lastName, userID)
		return render_template("error.html", page = p, user = thisUser)

#starLanding Page
@app.route('/star/<int:starID>')
def starPage(starID):
	try:
		s = Star.query.filter_by(id = starID).one()
		issuer = User.query.filter_by(id = s.issuer_id).one()
		owner = User.query.filter_by(id = s.owner_id).one()
		thisStar = StarObject.starObject(issuer.firstName + ' ' + issuer.lastName, owner.firstName + ' ' + owner.lastName, s.description)
		p = page.Page("Check out this star!", False)
		userID = current_user.get_id()
		u = User.query.filter_by(id = userID).one()
		thisUser = userPageUser.userPageUser(u.firstName, u.lastName, u.id)
		return render_template("star.html", star = thisStar, page = p, user = thisUser)
	except Exception as ex:
		p = page.Page("Oops!", False)
		userID = current_user.get_id()
		u = User.query.filter_by(id = userID).one()
		thisUser = userPageUser.userPageUser(u.firstName, u.lastName,u.id )
		return render_template("error.html",page = p,user = thisUser)

#createAccountPage
@app.route('/signup')
def createUser():
	p = page.Page("Sign Up!", True)
	try:
		userID = current_user.get_id()
		u = User.query.filter_by(id = userID).one()
		thisUser = userPageUser.userPageUser(u.firstName, u.lastName, 0)
	except Exception as ex:
		thisUser = none
	return render_template("signup.html", page = p, user = thisUser)


#feedback page
@app.route('/feedback')
def feedback():
	p = page.Page("Feedback!", False)
	userID = current_user.get_id()
	u = User.query.filter_by(id = userID).one()
	thisUser = userPageUser.userPageUser(u.firstName, u.lastName, u.id)
	return render_template("feedback.html", page = p, user = thisUser)

@app.route("/logout")
@login_required
def logout():
	logout_user()
	return redirect('/')

auth_func = lambda: current_user.is_authenticated()
#Creates the API
#manager.create_api(User, methods=['GET', 'POST'], validation_exceptions=[userValidation], authentication_required_for=['GET'], authentication_function=auth_func)
manager.create_api(User, methods=['GET', 'POST'], validation_exceptions=[userValidation], authentication_required_for=['GET'], authentication_function=auth_func, 
	include_columns=['firstName', 'lastName', 'twitterUser', 'stars', 'issued'])
manager.create_api(Star, methods=['GET', 'POST'], validation_exceptions=[starValidation])


if __name__ == '__main__':
	app.run(host='0.0.0.0')

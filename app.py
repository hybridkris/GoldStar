import flask.ext.restless
import datetime
import bcrypt
import flask.ext.sqlalchemy
import operator
from flask import Flask, render_template, request, redirect, url_for, session, flash, g, jsonify
from flaskext.oauth import OAuth
from flask.ext.login import current_user, login_user, LoginManager, UserMixin, login_required, logout_user
from flask.ext.wtf import PasswordField, SubmitField, TextField, Form
from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy import distinct
from threading import Thread
from collections import Counter
import userPageUser
import StarObject
import page
from pythontincan import startThread
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
	created = db.Column(db.DateTime, default = datetime.datetime.now)
	issuer_id = db.Column(db.Integer, db.ForeignKey('user.id'))
	owner_id = db.Column(db.Integer, db.ForeignKey('user.id'))
	hashtag = db.Column(db.Unicode)
	issuer = db.relationship("User", backref="issued", primaryjoin='Star.issuer_id==User.id')
	owner = db.relationship("User", backref="stars", primaryjoin="Star.owner_id==User.id")
	#Validation defs which validate 1 parameter of the table at a time

	@validates('hashtag')
	def validate_hashtag(self, key, string):
		string = string.lower()
		if '#' in string:
			string = string.replace('#','')
		return unicode(string)

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
		string = string.upper()
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
	try:
		g.user = None
		if 'user_id' in session:
			g.user = User.query.get(session['user_id'])
	except Exception as ex:
		print ex.message
@app.after_request
def after_request(response):
	db.session.remove()
	return response

@twitter.tokengetter
def get_twitter_token():
	token = session.get("twitter_token")
	user = g.user
	if user is not None and user.oauth_token == None and user.oauth_secret == None:
		token = session.get("twitter_token")
		if token is not None:
			user.oauth_token, user.oauth_secret = token
			db.session.commit()
		return token
	else:
		return str(user.oauth_token), str(user.oauth_secret)

@app.route('/twitterauth')
def twitterauth():
	if current_user.is_authenticated():
		return twitter.authorize(callback=url_for('oauth_authorized', 
			next = request.args.get('next') or request.referrer or None))
	else:
		return redirect('/error')

@app.route('/oauth_authorized')
@twitter.authorized_handler
def oauth_authorized(resp):
	if resp is None:
		flash(u'You denied the request to sign in.')
	if resp is not None:
		user = User.query.get(current_user.get_id())
		user.oauth_token = resp['oauth_token']
		user.oauth_secret = resp['oauth_token_secret']
		db.session.commit()
		session['user_id'] = current_user.get_id()
	return redirect('/mobileview.html')

def tweet(star_id):
	session = db.create_scoped_session()
	query = session.query(Star)
	star = query.get(star_id)		
	if star.owner.twitterUser:
		status = 'I gave #GoldStars to @' + star.owner.twitterUser + ' because he ' + star.category + ' me. #' + star.hashtag + 'www.Goldstars.me'
	else:
		fullName = star.owner.firstName + ' ' + star.owner.lastName
		status = 'I gave #GoldStars to ' + fullName + ' because he ' + star.category + ' me. #' + star.hashtag + ' www.Goldstars.me'
	resp = twitter.post('statuses/update.json', data = {'status': status})
	output = jsonify(dict(tweet = "Tweet Successful"))		
#End Twitter Auth

#The main index of the Gold Star App
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
				return redirect('mobileview.html')
		elif request.method == 'POST':
			loginINFO = request.json
			user = User.query.filter_by(email = unicode(loginINFO['email'])).one()
			if bcrypt.hashpw(loginINFO['password'], user.password) == user.password:
				login_user(user)
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

@app.route('/test')
def test():
	return render_template('test.html')
#user page
@app.route('/users/<int:userID>')
def userPage(userID):
	try:
		#get info for other user
		profileUser = User.query.filter_by(id = userID).one()
		starsIssued = len(profileUser.issued)
		starsReceived = len(profileUser.stars)
		otherUser = userPageUser.userPageUser(profileUser.firstName, profileUser.lastName, userID)
		otherUser.addStarsCount(starsIssued, starsReceived)
		#get info for this user
		if current_user.is_authenticated():
			me = User.query.filter_by(id = current_user.get_id()).one()
			thisUser = userPageUser.userPageUser(me.firstName, me.lastName, me.id)
			p = page.Page("Check out this user!", False)
		else:
			thisUser = None
			p = page.Page("Check out this user!", True)
		return render_template("users.html", user = thisUser, page = p, theOtherUser = otherUser)
	except Exception as ex:
		print ex.message
		return redirect('/error')

#starLanding Page
@app.route('/star/<int:starID>')
def starPage(starID):
	try:
		s = Star.query.filter_by(id = starID).one()
		thisStar = StarObject.starObject(str(s.issuer.firstName + ' ' + s.issuer.lastName), str(s.owner.firstName + ' ' + s.owner.lastName), s.description)
		if current_user.is_authenticated():
			userID = current_user.get_id()
			u = User.query.filter_by(id = userID).one()
			thisUser = userPageUser.userPageUser(u.firstName, u.lastName, u.id)
			p = page.Page("Check out this star!", False)
		else:
			thisUser = None
			p = page.Page("Check out this star!", True)
		return render_template("star.html", star = thisStar, page = p, user = thisUser)
	except Exception as ex:
		print ex.message
		return redirect('/error')

#createAccountPage
@app.route('/signup')
def createUser():
	p = page.Page("Sign Up!", True)
	try:
		userID = current_user.get_id()
		u = User.query.filter_by(id = userID).one()
		thisUser = userPageUser.userPageUser(u.firstName, u.lastName, 0)
	except Exception as ex:
		thisUser = None
	return render_template("signup.html", page = p, user = thisUser)


#feedback page
@app.route('/feedback')
def feedback():
	if current_user.is_authenticated():
		p = page.Page("Feedback!", False)
		userID = current_user.get_id()
		u = User.query.filter_by(id = userID).one()
		thisUser = userPageUser.userPageUser(u.firstName, u.lastName, u.id)
	else:
		p = page.Page("Feedback!", True)
		thisUser = None
	return render_template("feedback.html", page = p, user = thisUser)

@app.route("/logout")
@login_required
def logout():
	logout_user()
	return redirect('/')

def models_committed(sender,changes):
	session = db.create_scoped_session()
	query = session.query(User)
	for change in changes:
		if isinstance(change[0],Star):
			s = change[0]

			users = query.filter(User.id.in_([s.owner_id,s.issuer_id]))
			owner_name = ''
			issuer_email =''
			issuer_name = ''
			for user in users:
				if user.id == s.owner_id:
					owner_name = str(makeName(user.firstName,user.lastName,user.email))	
				else:
					issuer_email = user.email
					issuer_name = str(makeName(user.firstName,user.lastName,user.email))
					if user.oauth_token is not None:
						tweet(s.id)						
			startThread(issuer_name,issuer_email,"interacted",owner_name)

def makeName(userFirstName, userLastName, userEmail):
	fullName = "{0} {1}({2})".format(str(userFirstName), str(userLastName), str(userEmail))
	return fullName

@app.route('/getLeaderboard')
def getLeaderboard():
	leaderList = []
	Leaderboards = User.query.order_by(User.stars).limit(25)
	for i in Leaderboards:
		leaderList.append(dict(firstName=i.firstName,lastName=i.lastName,starCount=len(i.stars), id=i.id))
	return jsonify(dict(leaders = leaderList))

@app.route('/getHashtags')
def getHashtags():
	hashtagList = []
	hashtagQuery = Star.query.order_by(Star.hashtag).all()
	for tag in hashtagQuery:
		if tag.hashtag != None or tag.hashtag != "":
			if tag.hashtag not in hashtagList:
				hashtagList.append(tag.hashtag)
	return jsonify(dict(hashtags = hashtagList))

@app.route('/leaderboard/filter/<string:hashtag>/<string:verb>')
def specificLeaderboard(hashtag, verb):
	hashtag = hashtag.lower()
	if verb != 'all':
		verb = verb.upper()
	star_counts = {}
	leaderList = []
	try:
		if hashtag != 'all' and verb == 'all':
			leaderboardfilter = Star.query.filter_by(hashtag = hashtag).order_by(Star.owner_id).all()
		elif hashtag == 'all' and verb != 'all':
			leaderboardfilter = Star.query.filter_by(category = verb).order_by(Star.owner_id).all()
		elif hashtag == 'all' and verb == 'all':
			leaderboardfilter = Star.query.all()
		else:
			leaderboardfilter = Star.query.filter_by(hashtag = hashtag, category = verb).order_by(Star.owner_id).all()
		for star in leaderboardfilter:
				if star.owner_id in star_counts:
					star_counts[star.owner_id] += 1
				else:
					star_counts[star.owner_id] = 1
					leaderList.append(dict(id = star.owner_id, firstName = star.owner.firstName, lastName = star.owner.lastName, starCount = 1))
		for star in leaderList:
			star['starCount'] = star_counts[star['id']]
		return jsonify(dict(leaders = leaderList))
	except Exception as ex:
		print ex.message
		return redirect('/error')

@app.route('/error')
def errorPage():
	if current_user.is_authenticated():
		p = page.Page("Oops!", False)
		userID = current_user.get_id()
		u = User.query.filter_by(id = userID).one()
		thisUser = userPageUser.userPageUser(u.firstName, u.lastName,u.id )
	else:
		thisUser = None
		p = page.Page("Oops!", True)
	return render_template("error.html", page = p,user = thisUser)


auth_func = lambda: current_user.is_authenticated()
#Creates the API
#manager.create_api(User, methods=['GET', 'POST'], validation_exceptions=[userValidation], authentication_required_for=['GET'], authentication_function=auth_func)
manager.create_api(User, methods=['GET', 'POST'], validation_exceptions=[userValidation], authentication_required_for=['GET'], authentication_function=auth_func, 
	include_columns=['id','firstName', 'lastName', 'twitterUser', 'stars', 'issued','email'])
manager.create_api(Star, methods=['GET', 'POST'], validation_exceptions=[starValidation])
flask.ext.sqlalchemy.models_committed.connect(models_committed,sender=app)

if __name__ == '__main__':
	app.run(host='0.0.0.0')

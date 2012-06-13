class userPageUser:
	firstName = "none"
	lastName = "none"
	ID = 0
	starsGiven = 0
	starsReceived = 0
	twitterUser = True

	def __init__(self, fn, ln, i):
		self.firstName = fn
		self.lastName = ln
		self.ID = i
	def addStarsCount(self, sg, sr):
		self.starsGiven = sg
		self.starsReceived = sr
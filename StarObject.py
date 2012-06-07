class starObject:
	issuer = None
	owner = None
	reason = None
	hashtag = None
	timestamp = None
	def __init__(self, issuerName, ownerName, starReason,starHashtag,starTime):
		self.issuer = issuerName
		self.owner = ownerName
		self.reason = starReason
		self.hashtag = starHashtag
		self.timestamp = starTime
		

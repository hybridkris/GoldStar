class starObject:
	issuer = None
	owner = None
	reason = None
	hashtag = None
	timestamp = None
	owner_id = None
	issuer_id = None
	def __init__(self, issuerName, ownerName, starReason,starHashtag,starTime, issuer_id, owner_id):
		self.issuer = issuerName
		self.owner = ownerName
		self.reason = starReason
		self.hashtag = starHashtag
		self.timestamp = starTime
		self.owner_id = owner_id
		self.issuer_id = issuer_id
				

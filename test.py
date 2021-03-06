import unittest
from app import *

class testdb(unittest.TestCase):
	def test_add(self):
		db.create_all()
		user1 = User(firstName = u"UserA", lastName = u"UserT", email = u"UserA@gmail.com")
		user2 = User(firstName = u"UserB", lastName = u"UserS", email = u"UserB@gmail.com")
		user3 = User(firstName = u"UserC", lastName = u"UserR", email = u"UserC@gmail.com")
		user4 = User(firstName = u"UserD", lastName = u"UserQ", email = u"UserD@gmail.com")
		user5 = User(firstName = u"UserE", lastName = u"UserP", email = u"UserE@gmail.com")
		user6 = User(firstName = u"UserF", lastName = u"UserO", email = u"UserF@gmail.com")
		user7 = User(firstName = u"UserG", lastName = u"UserN", email = u"UserG@gmail.com")
		user8 = User(firstName = u"UserH", lastName = u"UserM", email = u"UserH@gmail.com")
		user9 = User(firstName = u"UserI", lastName = u"UserL", email = u"UserI@gmail.com")
		user10 = User(firstName = u"UserJ", lastName = u"UserK", email = u"UserJ@gmail.com")
		user11 = User(firstName = u"UserK", lastName = u"UserJ", email = u"UserK@gmail.com")
		user12 = User(firstName = u"UserL", lastName = u"UserI", email = u"UserL@gmail.com")
		user13 = User(firstName = u"UserM", lastName = u"UserH", email = u"UserM@gmail.com")
		user14 = User(firstName = u"UserN", lastName = u"UserG", email = u"UserN@gmail.com")
		user15 = User(firstName = u"UserO", lastName = u"UserF", email = u"UserO@gmail.com")
		user16 = User(firstName = u"UserP", lastName = u"UserE", email = u"UserP@gmail.com")
		user17 = User(firstName = u"UserQ", lastName = u"UserD", email = u"UserQ@gmail.com")
		user18 = User(firstName = u"UserR", lastName = u"UserC", email = u"UserR@gmail.com")
		user19 = User(firstName = u"UserS", lastName = u"UserB", email = u"UserS@gmail.com")
		user20 = User(firstName = u"UserT", lastName = u"UserA", email = u"UserT@gmail.com")
		db.session.add(user1)
		db.session.add(user2)
		db.session.add(user3)
		db.session.add(user4)
		db.session.add(user5)
		db.session.add(user6)
		db.session.add(user7)
		db.session.add(user8)
		db.session.add(user9)
		db.session.add(user10)
		db.session.add(user11)
		db.session.add(user12)
		db.session.add(user13)
		db.session.add(user14)
		db.session.add(user15)
		db.session.add(user16)
		db.session.add(user17)
		db.session.add(user18)
		db.session.add(user19)
		db.session.add(user20)
		db.session.commit()
	def test_addStars(self):
		star1 = Star(description = u"", category = u"Influenced", hashtag = u"mLearnCon", issuer_id = 2, owner_id = 1)
		star2 = Star(description = u"", category = u"Influenced", hashtag = u"mLearnCon", issuer_id = 3, owner_id = 1)
		star3 = Star(description = u"", category = u"Influenced", hashtag = u"mLearnCon", issuer_id = 4, owner_id = 1)
		star4 = Star(description = u"", category = u"Influenced", hashtag = u"mLearnCon", issuer_id = 5, owner_id = 1)
		star5 = Star(description = u"", category = u"Influenced", hashtag = u"mLearnCon", issuer_id = 6, owner_id = 1)
		star6 = Star(description = u"", category = u"Influenced", hashtag = u"mLearnCon", issuer_id = 7, owner_id = 1)
		star7 = Star(description = u"", category = u"Influenced", hashtag = u"mLearnCon", issuer_id = 8, owner_id = 1)
		star8 = Star(description = u"", category = u"Influenced", hashtag = u"mLearnCon", issuer_id = 9, owner_id = 1)
		star9 = Star(description = u"", category = u"Influenced", hashtag = u"mLearnCon", issuer_id = 10, owner_id = 1)
		star10 = Star(description = u"", category = u"Helped", hashtag = u"mLearnCon", issuer_id = 11, owner_id = 1)
		star11 = Star(description = u"", category = u"Helped", hashtag = u"mLearnCon", issuer_id = 12, owner_id = 1)
		star12 = Star(description = u"", category = u"Helped", hashtag = u"mLearnCon", issuer_id = 13, owner_id = 1)
		star13 = Star(description = u"", category = u"Helped", hashtag = u"mLearnCon", issuer_id = 14, owner_id = 1)
		star14 = Star(description = u"", category = u"Helped", hashtag = u"mLearnCon", issuer_id = 2, owner_id = 3)
		star15 = Star(description = u"", category = u"Helped", hashtag = u"mLearnCon", issuer_id = 1, owner_id = 3)
		star16 = Star(description = u"", category = u"Guided", hashtag = u"mLearnCon", issuer_id = 4, owner_id = 3)
		star17 = Star(description = u"", category = u"Guided", hashtag = u"mLearnCon", issuer_id = 5, owner_id = 3)
		star18 = Star(description = u"", category = u"Guided", hashtag = u"mLearnCon", issuer_id = 12, owner_id = 15)
		star19 = Star(description = u"", category = u"Guided", hashtag = u"mLearnCon", issuer_id = 20, owner_id = 15)
		star20 = Star(description = u"", category = u"Inspired", hashtag = u"mLearnCon", issuer_id = 14, owner_id = 15)
		star21 = Star(description = u"", category = u"Inspired", hashtag = u"mLearnCon", issuer_id = 6, owner_id = 11)
		star22 = Star(description = u"", category = u"Inspired", hashtag = u"mLearnCon", issuer_id = 5, owner_id = 7)
		star23 = Star(description = u"", category = u"Inspired", hashtag = u"mLearnCon", issuer_id = 8, owner_id = 7)
		star24 = Star(description = u"", category = u"Inspired", hashtag = u"mLearnCon", issuer_id = 9, owner_id = 7)
		star25 = Star(description = u"", category = u"Inspired", hashtag = u"mLearnCon", issuer_id = 10, owner_id = 7)
		star26 = Star(description = u"", category = u"Inspired", hashtag = u"mLearnCon", issuer_id = 11, owner_id = 7)
		star27 = Star(description = u"", category = u"Inspired", hashtag = u"mLearnCon", issuer_id = 1, owner_id = 16)
		star28 = Star(description = u"", category = u"Persuaded", hashtag = u"mLearnCon", issuer_id = 12, owner_id = 16)
		star29 = Star(description = u"", category = u"Persuaded", hashtag = u"mLearnCon", issuer_id = 13, owner_id = 16)
		star30 = Star(description = u"", category = u"Persuaded", hashtag = u"mLearnCon", issuer_id = 18, owner_id = 16)
		db.session.add(star1)
		db.session.add(star2)
		db.session.add(star3)
		db.session.add(star4)
		db.session.add(star5)
		db.session.add(star6)
		db.session.add(star7)
		db.session.add(star8)
		db.session.add(star9)
		db.session.add(star10)
		db.session.add(star11)
		db.session.add(star12)
		db.session.add(star13)
		db.session.add(star14)
		db.session.add(star15)
		db.session.add(star16)
		db.session.add(star17)
		db.session.add(star18)
		db.session.add(star19)
		db.session.add(star20)
		db.session.add(star21)
		db.session.add(star22)
		db.session.add(star23)
		db.session.add(star24)
		db.session.add(star25)
		db.session.add(star26)
		db.session.add(star27)
		db.session.add(star28)
		db.session.add(star29)
		db.session.add(star30)
		db.session.commit()


if __name__ == "__main__":
	unittest.main()
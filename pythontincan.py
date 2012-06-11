import urllib2
from threading import Thread
import json
import urllib
import requests
from requests.auth import HTTPBasicAuth
import uuid
import random
import argparse
def sendToLRS(whoDid,whoDidEmail,didWhat,whoDidObject,):
	#Call functions to get account variables
	statement_id = str(_ruuid())
	objectID = str(_randomID())
	url = str(getURL())
	#Creates the TinCan statement
	tc_star =[{
				"id":statement_id,
				'actor':{'name':[whoDid],'mbox':['mailto:'+whoDidEmail]},
				'verb':didWhat,
				'object':{'id':objectID,'definition':{'name':{"en-US":'with '+ whoDidObject},'description':{"en-US":whoDid+' gave a gold star to '+whoDidObject+'.'}}}
			}]
	try:
		resp = requests.post(url,data=json.dumps(tc_star),auth=HTTPBasicAuth(getUsername(),getsecretKey()),headers={"Content-Type":"application/json"})
	except IOError as e:
		print e
			
def main():
	#Thread(None,sendToLRS,None,(Who,Did,toWho)).start()
	print "Hi"
def startThread(Who,whoEmail,Did,toWho):
	Thread(None,sendToLRS,None,(Who,whoEmail,Did,toWho)).start()
def _randomID():
	return str(random.randint(1,10000000))

def getUsername():
	#Change to your app ID
	userName ='RLC4BXEK09' 
	#'UU3N64YGT2'
	return userName

def getsecretKey():
	#Change to your secret key
	SecretKey = 'CcP5PLO8qaJUZYoDF7mFJKCxhz0TODC0rrznipcS'
	#'9VU0MxwcogqhZYKc9Vn734oohTSOFoZohFJBJf5m'
	return SecretKey

def getURL():
	#Change to your Tin Can endpoint
	URL = 'https://cloud.scorm.com/ScormEngineInterface/TCAPI/RLC4BXEK09/statements/'
	#'https://cloud.scorm.com/ScormEngineInterface/TCAPI/UU3N64YGT2/statements/'
	return URL

def _ruuid(): 
	return uuid.uuid1()

if __name__ =="__main__":	
	main()
	#thread.start_new_thread(sendToLRS,('Roger','Awesomed','Rick'))

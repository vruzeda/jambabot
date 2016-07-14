#!/usr/bin/python2

import datetime
import os
import urllib2

DEBUG = os.getenv("JAMBABOT_DEBUG", "False") == "True"
ZUA = os.getenv("JAMBABOT_ZUA", "False") == "True"

def post_to_slack(text):
        if DEBUG:
                url = os.environ["JAMBABOT_DEBUG_URL"]
        else:
                url = os.environ["JAMBABOT_PROD_URL"]

        if DEBUG:
                print url
                print text

        urllib2.urlopen(url, 'payload={"text" : "' + text + '"}', 1)
        return

now = datetime.datetime.now()
delta = datetime.timedelta(0, 0, 0, 0, 15, 11) - datetime.timedelta(0, 0, 0, 0, now.minute, now.hour)

remainingMinutes = (delta.seconds / 60) % 60

text = "*%d*" % remainingMinutes
if ZUA and remainingMinutes == 0:
	text += "\nhttps://i.imgur.com/jpMZZnC.gif"

post_to_slack(text)


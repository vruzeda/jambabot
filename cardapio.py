#!/usr/bin/python2
# -*- coding: utf-8 -*-

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

output = ""

def post_jamba_to_slack(date):
	dateString = "Dia: " + str(date.day)

	if DEBUG:
		print dateString

	# Get monthly Jamba!
	try:
		jamba_site = urllib2.urlopen("http://www.refeicoesjambalaya.com.br/cardapio.asp", None, 1)
	except:
		post_to_slack("O site do Jamba está fora do ar :cry:\nDá uma checada no <https://www.ifood.com.br/delivery/campinas-sp/jambalaya-refeicoes-jardim-flamboyant|iFood>...\nOu liga lá: <tel:1932513928|(19) 3251-3928> | <tel:1932537573|(19) 3253-7573>\n\n(Ou <#C0HNHSCP9>, fazer o quê :stuck_out_tongue_winking_eye:)")
		raise

	response = jamba_site.read().decode('iso-8859-1').encode('utf8')

	# Parse and find today's Jamba
	all_jamba = response.split("<p>")
	for jamba in all_jamba:
        	if DEBUG:
                	print jamba + "\n"

	        if dateString in jamba:
			today = datetime.datetime.now()

        	        if date.day > today.day:
                	        jamba = "*SPOILER* :junim:\n\n" + jamba
			else:
				if date.hour >= 10:
					jamba = "*AINDA NÃO PEDIU?*\n\n" + jamba

	                	jamba = jamba + "\n\n<https://www.ifood.com.br/delivery/campinas-sp/jambalaya-refeicoes-jardim-flamboyant|Pedir>"
        	        
			jamba = jamba.replace("<b>", "")
                	jamba = jamba.replace("</b>", "")
	                jamba = jamba.replace("<br>", "\n")

        	        if ZUA:
                        	jamba = jamba.replace("Frango supremo", ":sparkles:FRANGO SUPREMO:sparkles: :heart:")
	                        jamba = jamba.replace("Penne", "Pênis")
                        	jamba = jamba.replace("à milanesa", "ali na mesa")
	                        jamba = jamba.replace("Fígado", "Fícado")
				jamba = jamba.replace("à dorê", "adorei")
				jamba = jamba.replace("Feijoada", "Feijuca :heartmucholoko:")

        	        post_to_slack(jamba)
                	break

# Get today date (with one digit if it's less than 10)
today = datetime.datetime.now()

if today.hour < 11:
	post_jamba_to_slack(today)
else:
	tomorrow = today + datetime.timedelta(1)
	if tomorrow.month == today.month:
		post_jamba_to_slack(tomorrow)

#!/usr/bin/python
# -*- coding: cp1252 -*-
import socket
import signal
import sys
import time
import MySQLdb  #mysql connection library
import re   #regular expression library
from contextlib import closing
   
#   V A R I A B L E S   #

# Acknowledge (OPEN message OK)
ACK="*#*1##"
# Not-Acknowledge (OPEN message wrong)
NACK="*#*0##"
# Monitor session
MONITOR="*99*1##"

def Connect(gateway_IP,gateway_Port):
    # Connect to gateway
    try:
        s=socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.connect((gateway_IP,gateway_Port))
    except Exception as e:
        s=None
    finally:
        return s

def RecData(sock):
    # Read data from MyHome(R)
    rec=""
    try:
        rec=sock.recv(150)
    except sock.error as msg:
        rec="Err"
    finally:
        return rec
	
def SendData(scmd, cmdopen):
    # Send data to MyHome(R)
    try:
        bOK=True
        scmd.send(cmdopen)
    except scmd.error as msg:
        bOK=False
    finally:
        scmd.close
        return bOK

def ListenBUS(smon):
    try:
        while 1:
            # Read data from MyHome BUS
            frame=RecData(smon)
            # if more than one message, cut it
            s = 0
            while 1:
                end = frame.find("##",s)
                if end<0:
                    break
                msgOpen = frame[s:end+2]
                # Check if message is ACK or NACK or blank
                if msgOpen:
                    who = ExtractWho(msgOpen)
                    if who=="1" or "25":
                        if not (msgOpen==ACK or msgOpen==NACK):
                            # Check events
                            CheckEvents(msgOpen)
                    s=end+2	# IL +2 SERVE A SPOSTARE IL PUNTATORE ALLA FINE DEL PACCHETTO, DOPO I DUE ##
    except KeyboardInterrupt:
        # Exit program with CTRL-C
        ExitApp()

def ExtractWho(frame):
    # Extract WHO from "frame"
        # PUO' ESSERE:
        # *WHO*WHAT*WHERE## -> NORMAL FRAME
        # *#WHO*WHERE## -> STATUS REQEUST

    fps=0           # Start
    frmend = frame.find("##")					# restituisce la posizione della fine del pacchetto
    frmast1=frame.find("*",fps,frmend)			# restituisce la posizione del primo asterisco, quello di inizio pacchetto
    frmast2=frame.find("*",(frmast1+1),frmend)		# restituisce la posizione del secondo asterisco, quello di separazione tra WHO e WHERE
    # Extract WHO and check the tipology of message
    if frame[1]=="#":
        # se il carattere successivo a * è un # allora è uno STATUS REQUEST (tipo di messaggio: R)
        typeMsg="R"
        # Extract WHO and skip the '#' at position 1
        who=frame[(frmast1+2):frmast2]
    else:
        # Normal
        typeMsg="N"
        # Extract WHO normally
        who=frame[(frmast1+1):frmast2]
    return who
      
def ExitApp():
    # Close socket.
    #smon.close
    # Exit
    print("Connection closed. Bye bye!")
    #sys.exit()		

#instaurare un socket di monitoring
   
def CheckEvents(line):    
    ##Light Command intercepted
    #leggo sul socket, se ricevo qualcosa allora lo salvo in line e procedo da dopo line =...
    frameList = re.findall(r'\*1\*[0-1]\*(?:\d{2}|\d{4})##', line) #crea una lista che contiene tutte le corrispondenze della regular expression *<WHO=1>*<WHAT=1|0>*<WHERE>##
    if frameList:  #se ho risultati scorro la lista e aggiorno il db
                
        db = MySQLdb.connect(host="127.0.0.1", # your host, usually localhost
                             user="ste.cape", # your username
                             passwd="p4ssw0rd", # your password
                             db="home") # name of the data base

        #if db:
            #print "connected to database"

        # you must create a Cursor object. It will let
        #  you execute all the queries you need
        with closing( db.cursor() ) as cursor:      #sto coso chiude il cursor con la chiusura della connessione al database
            # Use all the SQL you like
            for item in frameList:                  #per ogni frame arrivata estraggo i token e faccio una query per ognuno
                x=item  #es. *1*1*0110##
                x=x[1:] #es. 1*1*0110##
                x=x[:-2]    #es. 1*1*0110
                tok=x.split("*")    #es. ['1', '1', '0110']
                #print tok
                ##query = "SELECT * FROM `light` WHERE `Where`='" + tok[2] +"'"  #monitor query
                query = "UPDATE `light` SET `Status`='" + tok[1] +"' WHERE `Where`='" + tok[2] +"'" #update query
                #print query
                cursor.execute(query)
                db.commit()                 #obbligatorio, sennoì non esegue l'update
                ##for row in cursor.fetchall() :
                ##    print row
        db.close()
    #else:   #senno amen
    #   print "Nothing found!!"

    #line="" #svuoto la linea per il prossimo loop
    
if __name__=="__main__":

    # Welcome
    print ("<< DBUpdater v1.1 - stecape")
    # Setting parameters
    gateway_IP="192.168.0.35"
    gateway_Port=20000
    
    # Connect to gateway in MONITOR mode.
    smon=Connect(gateway_IP,gateway_Port)
    if smon!=None:
        # Check the gateway answer
        if RecData(smon)==ACK:
            # It's OK, open MONITOR mode
            SendData(smon, MONITOR)
            # Listen BUS...
            ListenBUS(smon)
        else:
            # Not ACK receive, print message and write log.
            ExitApp()
    else:
        # Not connect to gateway, print message and write log.
        ExitApp()
		



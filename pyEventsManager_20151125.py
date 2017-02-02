#! /usr/bin/python
# -*- coding: utf-8 -*-
#   M O D U L E S  #

import socket
import signal
import sys
import time

#   V A R I A B L E S   #

# Acknowledge (OPEN message OK)
ACK="*#*1##"
# Not-Acknowledge (OPEN message wrong)
NACK="*#*0##"
# Monitor session
MONITOR="*99*1##"
# Commands session
COMMANDS="*99*0##"

##luce bagno
luceBagnoOn = "*1*1000#1*0110##"
luceBagnoOff = "*1*1000#0*0110##"
ventilatoreBagnoOn = "*1*1*11##"
ventilatoreBagnoOff = "*1*0*11##"
ventilatoreBagnoOffDelayed = "*1*11*11##"
ventilatoreBagnoStatusReq = "*#1*11##"

luceBagnoOn1 = "*1*1*0110##"
luceBagnoOff1 = "*1*0*0110##"

##Luce sala
luceSalaChiesaOn = "*1*1*27##"
luceSalaCortileOn = "*1*1*26##"
luceSalaChiesaOff = "*1*0*27##"
luceSalaCortileOff = "*1*0*26##"
luciSalaOn = "*25*21#1*21##"
luciSalaOff = "*25*21#2*21##"
luciSalaOn1 = "*25*24#1*21##"
luciSalaOff1 = "*25*24#2*21##"
luceSalaChiesaStatusReq = "*#1*27##"
luceSalaCortileStatusReq = "*#1*26##"

##Comando cancello da Citofono
cancello = "*6*10*4010##"
openCancello = "*1*18*39##"

##Comando cancelletto da Citofono
cancelletto = "*6*10*4011##"
openCancelletto = "*1*18*38##"

#   F U N C T I O N S   #

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

def Clock():
    # Clock
    timenow = time.localtime(time.time())
    now = time.strftime("%H:%M:%S", timenow)
    return now

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
                    # Extract WHO and write log
                    whoToFilter = "1"						#QUI DEFINISCI IL WHO CHE VUOI FILTRARE WHO 1 WHERE AMB 1 Z 10
                    who = ExtractWho(msgOpen)
                    if who==whoToFilter or "25" or "6":
                        if not (msgOpen==ACK or msgOpen==NACK):
                            WriteLog(msgOpen)
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

def SendCommand(cmd,stringToLog):
    # Connect to gateway and send a command
    scmd=Connect(gateway_IP,gateway_Port)
    if scmd!=None:
        if SendData(scmd,COMMANDS):
            # Wait for ACK
            while 1:
                rec = RecData(scmd)
                if rec==ACK:
                    if SendData(scmd,cmd):
                        print(stringToLog)
                        # Wait for ACK
                        while 1:
                            rec = RecData(scmd)
                            if rec==ACK:
                                break
                    break

def readStatus(cmd):
                scmd=Connect(gateway_IP,gateway_Port)
                if scmd!=None:
                    if SendData(scmd,COMMANDS):
                        # Wait for ACK
                        while 1:
                            rec = RecData(scmd)
                            if rec==ACK:
                                rec=""
                                if SendData(scmd,cmd):
                                    # Wait for ACK
                                    while rec=="" or rec=="*#*1##":
                                        rec = RecData(scmd)
                                    print("command sent: " + cmd + " richiesta stato. rec -> " + rec)
                                    return rec
                                break

##Qui  dove devi fare tutta la logica.
                            
def CheckEvents(msgOpen):
    

    
    global attemptVentilatoreBagno
    global timestampVentilatoreBagno
        
    global attemptLuciSala
    global timestampLuciSala
    
##############GESTIONE VENTILATORE BAGNO
    
    ##Light Off Command intercepted
    # Find event in frame
    if msgOpen.find(luceBagnoOff)>=0 or msgOpen.find(luceBagnoOff1)>=0:
        
        if attemptVentilatoreBagno == 2 and int(time.time()) - timestampVentilatoreBagno <= 3:
            ##ventola off
            SendCommand(ventilatoreBagnoOff,"attempt 3, ventilatore off command sent")
            attemptVentilatoreBagno = 0
            print("attempt: "+str(attemptVentilatoreBagno))
        elif attemptVentilatoreBagno == 1 and int(time.time()) - timestampVentilatoreBagno <= 3:
            attemptVentilatoreBagno = 2
            print("attempt: "+str(attemptVentilatoreBagno))
        elif attemptVentilatoreBagno == 0 or int(time.time()) - timestampVentilatoreBagno > 3:
            if attemptVentilatoreBagno == 0:
                rec = readStatus(ventilatoreBagnoStatusReq)                        ##richiesta stato ventola
                print("rec: "+rec)
                if rec.find(ventilatoreBagnoOn)>=0:                ##ventola accesa:
                    SendCommand(ventilatoreBagnoOffDelayed,"command sent: *1*1*11## ventilatore on per un minuto da adesso")
            attemptVentilatoreBagno = 1
            timestampVentilatoreBagno = int(time.time())
            print("attempt: "+str(attemptVentilatoreBagno))
        
    
    ##Light On Command intercepted       
    # Find event in frame
    elif msgOpen.find(luceBagnoOn)>=0 or msgOpen.find(luceBagnoOn1)>=0:
        attemptVentilatoreBagno=0
        print("attempt: "+str(attemptVentilatoreBagno))
        SendCommand(ventilatoreBagnoOn,"command sent: *1*1*11## ventilatore on")

##############GESTIONE VENTILATORE BAGNO##############

##############GESTIONE LUCI SALA
        
    ##Light On Command intercepted       
    # Find event in frame
    elif msgOpen.find(luciSalaOn)>=0 or msgOpen.find(luciSalaOn1)>=0:
        luceSalaChiesa = readStatus(luceSalaChiesaStatusReq)
        luceSalaCortile = readStatus(luceSalaCortileStatusReq)
        if luceSalaChiesa.find(luceSalaChiesaOn)>=0:
            luceSalaChiesa = 1
        else:
            luceSalaChiesa = 0

        if luceSalaCortile.find(luceSalaCortileOn)>=0:
            luceSalaCortile = 1
        else:
            luceSalaCortile = 0

        x = luceSalaChiesa*1 + luceSalaCortile*2

        if x == 0:
            SendCommand(luceSalaChiesaOn,"")
        elif x == 1:
            SendCommand(luceSalaCortileOn,"")
        elif x == 3:
            SendCommand(luceSalaChiesaOff,"")
        elif x == 2:
            SendCommand(luceSalaCortileOff,"")

    ##Light On Command intercepted       
    # Find event in frame
    elif msgOpen.find(luciSalaOff)>=0 or msgOpen.find(luciSalaOff1)>=0:
        luceSalaChiesa = readStatus(luceSalaChiesaStatusReq)
        luceSalaCortile = readStatus(luceSalaCortileStatusReq)
        if luceSalaChiesa.find(luceSalaChiesaOn)>=0:
            luceSalaChiesa = 1
        else:
            luceSalaChiesa = 0

        if luceSalaCortile.find(luceSalaCortileOn)>=0:
            luceSalaCortile = 1
        else:
            luceSalaCortile = 0

        x = luceSalaChiesa*1 + luceSalaCortile*2


        if x == 0:
            SendCommand(luceSalaCortileOn,"")
        elif x == 1:
            SendCommand(luceSalaChiesaOff,"")
        elif x == 3:
            SendCommand(luceSalaCortileOff,"")
        elif x == 2:
            SendCommand(luceSalaChiesaOn,"")

##############GESTIONE LUCI SALA##############

##############GESTIONE CANCELLO
            
    ##Cancello Command intercepted       
    # Find event in frame
    elif msgOpen.find(cancello)>=0:
        SendCommand(openCancello,"")
        
##############GESTIONE CANCELLO##############

##############GESTIONE CANCELLETTO
            
    ##Cancelletto Command intercepted       
    # Find event in frame
    elif msgOpen.find(cancelletto)>=0:
        SendCommand(openCancelletto,"")
        
##############GESTIONE CANCELLETTO##############
        
def WriteLog(msg):
    # Write the OPEN message to log.
    try:
        flog = open(logfilename,"a")
        logTime = time.localtime(time.time())
        frtlogTime = time.strftime("%d/%m/%Y %H:%M:%S", logTime)
        flog.write(frtlogTime+':'+msg+'\n')
        flog.close()
    except IOError as error:
        print ("pyEventsManager: Log file error! Details:["+str(error)+"]")

def ExitApp():
    # Close socket.
    #smon.close
    # Exit
    print("Connection closed. Bye bye!")
    #sys.exit()

def signal_handler(signal, frame):
    # Close socket.
    #smon.close
    # Exit
    print("Connection closed. Bye bye!")
    #sys.exit()
    
if __name__=="__main__":
    # Welcome
    print ("<< pyEventsManager v1.1 - stecape")
    # Setting parameters
    gateway_IP="192.168.0.35"
    gateway_Port=20000
    
    global logfilename
    logfilename = "/home/pi/Documents/monitorLog.txt"

    ##GlobVars Ventilatore Bagno
    # timestampVentilatoreBagno
    global timestampVentilatoreBagno
    # attemptVentilatoreBagno
    global attemptVentilatoreBagno
    attemptVentilatoreBagno = 0
    
    ##GlobVars LuciSala
    # timestampLuciSala
    global timestampLuciSala
    # attemptLuciSala
    global attemptLuciSala
    attemptLuciSala = 0

    signal.signal(signal.SIGINT, signal_handler)
    # Connect to gateway in MONITOR mode.
    smon=Connect(gateway_IP,gateway_Port)
    if smon!=None:
        # Check the gateway answer
        if RecData(smon)==ACK:
            # It's OK, open MONITOR mode
            WriteLog("It's OK, open MONITOR mode")
            SendData(smon, MONITOR)
            # Listen BUS...
            ListenBUS(smon)
        else:
            # Not ACK receive, print message and write log.
            WriteLog("pyEventsManager: I don't receive the ACK from gateway. Bye!")
            ExitApp()
    else:
        # Not connect to gateway, print message and write log.
        WriteLog("pyEventsManager: Not connect to gateway! Bye!")

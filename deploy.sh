#!/bin/bash

# Text colors.
RED_COLOR='\033[0;31m';
GREEN_COLOR='\033[0;32m';
NO_COLOR='\033[0m';
user="root"
host="174.138.10.209";


logToTerminal () {
  message=$1;
  delay=$2;
  newLineBefore=$3;

  logNewlineAndResetColor $newLineBefore
  echo $message;
  logNewlineAndResetColor $newLineBefore

  if [ ! -z "$delay" ]
  then
    sleep $delay;
  fi
}

logNewlineAndResetColor () {
  if [ ! -z "$1" ]
  then
    echo "${NO_COLOR}";
  fi
}

buildApplication () {
  logToTerminal "${GREEN_COLOR}E sad build-am aplikaciju" 1 "yes";

  npm run build --prod
}

copyFiles () {
  sshUser=$1;
  sshHost=$2;

  logToTerminal "${GREEN_COLOR}Kopiram fajlove" 1 "yes";

  scp -r ./dist/* "${sshUser}@${sshHost}:/var/www/scs-employee-log.ml/html";
}

logHello () {
  logToTerminal "${GREEN_COLOR}Pozdra" 1;
  logToTerminal "${RED_COLOR}v" 2;
}

logFinish () {
  logToTerminal "${GREEN_COLOR}SVE SAM URADIO" 1 "yes"
  logHello
}

logHello

buildApplication

copyFiles $user $host

logFinish $1

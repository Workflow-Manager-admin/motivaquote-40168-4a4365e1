#!/bin/bash
cd /home/kavia/workspace/code-generation/motivaquote-40168-4a4365e1/motivational_quote_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi


#!/usr/bin/env bash
set -e

if [ -z "$1" ]; then
  echo "❌ Usage: ./run-demo.sh <file_name>.aml"
  exit 1
fi

FILE_NAME=$1
BASE_NAME=$(basename "$FILE_NAME" .aml)

echo "📄 Generating HTML from $FILE_NAME..."
cd ../demo
node ../bin/cli generate ./$FILE_NAME.aml

echo "🚀 Starting Reveal.js server..."
cd presentationexecutor

npm install --silent
npm start ./generated/$BASE_NAME.html

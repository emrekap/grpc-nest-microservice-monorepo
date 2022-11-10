#!/bin/bash
echo "Service name: $1"

echo $(pwd)

if [[ $(pwd) =~ "dev-sh" ]];
then
    git clone git@github.com:emrekap/grpc-nestjs-microservice-template.git ../services/$1
    rm -rf ../services/$1/.git
else 
    git clone git@github.com:emrekap/grpc-nestjs-microservice-template.git ./services/$1
    rm -rf ./services/$1/.git
fi

npm run lerna

echo "!!!!!! IMPORTANT !!!!!!"
echo "Don't forget change package name for new service. Check package.json for $1"
echo "Don't forget update envconfig.ts file and generate new local env variables. (npm run envgen)"
echo "Auto replace for package.json file in progress"
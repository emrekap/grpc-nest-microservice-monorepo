#!/bin/bash
echo "Service name: $1"

if [[ $(pwd) =~ "dev-sh" ]];
then
    git clone --depth=1 --branch=main git@github.com:emrekap/grpc-nestjs-microservice-template.git ../services/$1
    rm -rf ../services/$1/.git
    cd ..
    npm run lerna
else 
    git clone --depth=1 --branch=main git@github.com:emrekap/grpc-nestjs-microservice-template.git ./services/$1
    rm -rf ./services/$1/.git
    npm run lerna
fi


echo "!!!!!! IMPORTANT !!!!!!"
echo "Don't forget change package name for new service. Check package.json for $1"
echo "Don't forget update envconfig.ts file and generate new local env variables. (npm run envgen)"
echo "Auto replace for package.json file in progress"
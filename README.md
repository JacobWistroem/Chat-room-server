# SocketIO Chatting Server
This is a Node.js TypeScript backend project that provides SocketIO functionality with MongoDB integration.

Using this project, you can setup an application to browse, create and interact with the chat rooms, as a registered user. 

## Getting started
To run this project, you need to follow the installation guide below.


# Setup typescript for node project
The guide is based on the following source: https://khalilstemmler.com/blogs/typescript/node-starter-project/

## Goals

- Install typescript with types
- Create config files: package.json, tsconfig.json & nodemon.json.
- Configure these files to create a development, build and start mode.

## Install dependencies

Add TypeScript as a dev dependency
```
npm install typescript --save-dev
```
Install ambient Node.js types for TypeScript
```
npm install @types/node --save-dev
```
Install cold reloading
```
npm install --save-dev ts-node nodemon
```

Install reset build folder
```
npm install --save-dev rimraf
```

## Create config files
Create nodejs package.json
```
npm init -y
```
Create typescript json file
```
npx tsc --init --rootDir src --outDir build \
--esModuleInterop --resolveJsonModule --lib es6 \
--module commonjs --allowJs true --noImplicitAny true
```
Create nodejs package.json
```
mkdir src
touch src/index.ts
```
Create nodejs package.json
```
touch nodemon.json
```
```
{
  "watch": ["src"],
  "ext": ".ts,.js",
  "ignore": [],
  "exec": "npx ts-node ./src/index.ts"
}
```


## Configure our files

### Create nodejs package.json
Add these scripts to our package.json
```
"start:dev": "npx nodemon",
"start": "npm run build && node build/index.js",
"build": "rimraf ./build && tsc"
```


## Additional commands
Compile our code to a .js file.
```
npx tsc
```



# Add linting
source: https://khalilstemmler.com/blogs/typescript/eslint-for-typescript/
This will give us feedback from our code, when we run the linting script


# Add Prettier
source: https://khalilstemmler.com/blogs/tooling/prettier/
This will give us live feedback when we code. Telling us what i disallowed.
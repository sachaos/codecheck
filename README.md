# codecheck
- Run several kind of test framework by one command.
- Launch web server before run end to end test.
- CLI client of codecheck service.

## Getting started
Install from npm.

```
npm install codecheck -g
```

You can run any test framework like this

```
codecheck mocha
codecheck mocha specs/test --recursive
codecheck sbt
```

## How to run with web server
Define web server information in codecheck.yml.
Like this

```
web:
  command: sbt run
  port: 9000
  console: true
  dir: app
```

## codecheck.yml
codecheck.yml is a setting file of codecheck CLI.  
If this file is exist in current directory, its settings are used to run.

It can have following keys

### build
Array.  
If this section has some commands, run these commands sequencially before run test.

### environment
Hash.  
You can pass some environment variable to test.

### web
Web application information. 

If defined, launch web app and wait to be ready by polling testUrl.

It has following sub keys.

- command: required. starting command of web app.
- port: required. port of web app
- console: option. if true, console output of web app is displayed.
- dir: option. base directory of web app.
- testUrl: option. the url which is used in start check.(Default `/`)

### test
Test command.  
If defined, it is used as default test command.  
So, you can run codecheck without any parameters.

```
codecheck
```

### config
Other configurations.  
It has following sub keys.

- timeout: Timeout to wait finishing all tests.

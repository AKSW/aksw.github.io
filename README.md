# aksw.org Homepage

## Preparation

- Install [Ruby](https://www.ruby-lang.org/) >= 2.1
- Install [Bundler](https://bundler.io/)
- Install [NPM](https://www.npmjs.com/)
- Install [Task](https://taskfile.dev/)


## Prepare Model

```
$ task model-init
```

## Compile

```
$ task model-serve
$ task install serve
```

open ```http://127.0.0.1:4000/aksw.org.jekyllrdf/``` ([link](http://127.0.0.1:4000/aksw.org.jekyllrdf/)) in your browser

## Stop

Don't forget to terminate the fuseki container

```
$ task model-serve-stop
```

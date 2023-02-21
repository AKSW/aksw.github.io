# aksw.org Homepage

The model repo is at: https://github.com/AKSW/aksw.org-model

## Preparation

- Git
- [Task](https://taskfile.dev/)
- Docker or Podman
- For the styles:
  - [Node.js](https://nodejs.org/)
  - [NPM](https://www.npmjs.com/)
- Optionally:
  - Python (for `serve` resp. `watch`)
  - [entr](http://eradman.com/entrproject/) (for `watch` resp. `build:watch`)


## See the Site

```
$ task watch
```

## Step by Step
### Prepare Model

```
$ task data:model-init
$ task data:model-serve
```

The model container will continue running. Don't forget to terminate the model's fuseki container when you are done with everything.

```
$ task model-serve-stop
```

### Compile Site and Styles

```
$ task style:build
$ task build
```

### Serve

```
$ task serve
```

Now open ```http://localhost:8000/``` ([link](http://localhost:8000/)) in your browser.

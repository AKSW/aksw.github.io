# aksw.org Homepage

## Preparation

- Install [Ruby](https://www.ruby-lang.org/) >= 2.1
- Install [Bundler](https://bundler.io/)
- Install [NPM](https://www.npmjs.com/)

## 1. Compile

    $ npm install
    $ npm run build
    $ bundle install --path .vendor/bundle

## 2. Run

1. check out https://github.com/AKSW/aksw.org-model.git
2. go to the checked out directory
3. ```docker run -p 3030:3030 -v $PWD:/graph -d stain/jena-fuseki /jena-fuseki/fuseki-server --file=/graph/aksw.org.nt /aksw```
4. go back to this jekyll directory
5. ```bundle exec jekyll serve```
6. open ```http://127.0.0.1:4000/aksw.org.jekyllrdf/``` ([link](http://127.0.0.1:4000/aksw.org.jekyllrdf/)) in your browser

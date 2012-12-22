rm -Rf gen-js
find ./thrift/ -type f | xargs -I repme /Users/jgauci/apache/thrift-dev/compiler/cpp/thrift -gen js:jquery repme

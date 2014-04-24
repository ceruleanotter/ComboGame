gulp = require 'gulp'
gutil = require 'gulp-util'
path = require 'path'
source = require 'vinyl-source-stream'
streamify = require 'gulp-streamify'
exorcist = require 'exorcist'
uglify = require 'gulp-uglify'
gulpif = require 'gulp-if'
connect = require 'gulp-connect'
open = require 'gulp-open'
notify = require 'gulp-notify'

browserify = require 'browserify'
coffeeify = require 'coffeeify'
watchify = require 'watchify'

handleErrors = ->
  # Send error to notification center with gulp-notify
  notify.onError(
    title: 'Compile Error'
    message: "\n<%= error.toString().replace('#{__dirname}/','') %>"
  ).apply @, arguments

  # Keep gulp from hanging on this task
  @emit 'end'

bundle = (b, debug=false) ->
  b.bundle({debug: true})
  .on 'error', handleErrors
  .pipe exorcist path.join __dirname, 'src/main-built.js.map'
  .pipe source 'main-built.js'
  .pipe gulpif !debug, streamify uglify
    inSourceMap: path.join __dirname, 'src/main-built.js.map'
    outSourceMap: path.join __dirname, 'src/main-built.js.map'
  .pipe gulp.dest './src/'

createBundler = (_browserify) ->
  b = _browserify
    extensions: ['.coffee']
    paths: [
      path.join __dirname, 'node_modules/combo/src/combo'
      path.join __dirname, 'src'
    ]

  b.add path.join __dirname, 'src/main'
  b.transform coffeeify

gulp.task 'build', ->
  bundle createBundler browserify

gulp.task 'watch', ->
  b = createBundler watchify
  b.on 'update', ->
    bundle b, true
    for a in arguments
      console.log a
  bundle b, true

PORT = gutil.env.PORT || 9042

gulp.task 'connect', ->
  connect.server
    root: __dirname + '/src'
    port: PORT

gulp.task 'open', ['watch'], ->
  gulp.src 'src/index.html'
  .pipe open '',
    url: "http://localhost:#{PORT}/index.html"

gulp.task 'default', ['build']
gulp.task 'dev', ['connect', 'watch', 'open']

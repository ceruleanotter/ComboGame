cg = require 'cg'
Physical = require 'plugins/physics/Physical'
Interactive = require 'plugins/ui/Interactive'
Fire = require 'Fire'
TROGDOR_SPEED = 10


class Trogdor extends cg.SpriteActor
  @plugin Interactive



  constructor: ->
    super
    @texture = 'trogdor'
    @controls = cg.input.controls.trogdorControls
    @velocity = new cg.math.Vector2
    @fire = @addChild new Fire
      x: cg.width/2
      y: cg.height/2
      id: 'fire'
      trogdor: this

    @on 'leftright', (val) ->
      @velocity.x = (val)*TROGDOR_SPEED  
      if val < 0 
        @flipX = true
      else if val > 0
        @flipX = false

    @on 'updown', (val) ->
      @velocity.y = (val)*TROGDOR_SPEED

    

  update: ->
    super

    @x += @velocity.x
    @y += @velocity.y

    if @x > cg.width
      @x = @x%cg.width
    if @right < 0
      @x = @right+cg.width

    if @y > cg.height
      @y = @y%cg.height
    if @bottom < 0
      @bottom = @bottom+cg.height

  @initalizeControls: ->
      cg.input.map 'trogdorControls',
        leftright: ['left/right']
        updown: ['up/down']
module.exports = Trogdor

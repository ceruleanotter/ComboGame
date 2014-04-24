cg = require 'cg'
Physical = require 'plugins/physics/Physical'
Interactive = require 'plugins/ui/Interactive'

class Fire extends cg.SpriteActor
  @plugin Interactive
  constructor:(@trogdor) ->
    super
    @anims =
      burn: cg.assets.sheets.fireright.anim([0,1,2,3,2,1], 100)
    @anim = @anims.burn
    @scale = 0.5
    console.log("Trogdor is " + @trogdor.x)

  update: ->
    super
    @x += 1
    console.log(@x)
    ###console.log("Trogdor is " + @trogdor.x)

    if @trogdor.flipX
      @x = (@trogdor.x)-40
      @flipX = true
    else
      @x = (@trogdor.x)+40
      @flipX = false

    @y = (@trogdor.y)-10
    console.log("Flame is " + @x)
###
module.exports = Fire

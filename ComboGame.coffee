cg = require 'cg'
Villager = require 'Villager'
Trogdor = require 'Trogdor'

class ComboGame extends cg.Scene
  constructor: ->
    super
    Trogdor.initalizeControls()

    @trogdor = @addChild new Trogdor
      x: cg.width/3
      y: cg.height/3
      id: 'trogdor'

    for i in [1..100]
      @addChild new Villager
        x: cg.rand(cg.width)
        y: cg.rand(cg.height)

    @trogdor.bringToFront()

  update: ->
    super


    # @logo.rotation += 0.02


module.exports = ComboGame

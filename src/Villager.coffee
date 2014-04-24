cg = require 'cg'
Physical = require 'plugins/physics/Physical'
Interactive = require 'plugins/ui/Interactive'

POPUP_TIMERANGE_MAX = 3000
POPUP_TIMERANGE_MIN = 500

class Villager extends cg.SpriteActor
  @plugin Interactive
  


  constructor: ->
    super
    @anims =
      idle: cg.assets.sheets.villager.anim([0]),
      walk: cg.assets.sheets.villager.anim([1,2],200),
      hide: cg.assets.sheets.villager.anim([0]),
      show: cg.assets.sheets.villager.anim([0])
    @popUp()      
    @anim = @anims.walk

  popUp: ->
    @anim = @anims.show
    @show 100, =>

      @anim = @anims.walk
    @delay(cg.rand(POPUP_TIMERANGE_MIN,POPUP_TIMERANGE_MAX),
           @popDown)

  popDown: ->
    @anim = @anims.hide
    @hide 100
    @delay(cg.rand(POPUP_TIMERANGE_MIN,POPUP_TIMERANGE_MAX),
           @popUp)
  update: ->
    super




module.exports = Villager

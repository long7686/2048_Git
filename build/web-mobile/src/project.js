window.__require=function t(o,c,e){function n(r,a){if(!c[r]){if(!o[r]){var s=r.split("/");if(s=s[s.length-1],!o[s]){var l="function"==typeof __require&&__require;if(!a&&l)return l(s,!0);if(i)return i(s,!0);throw new Error("Cannot find module '"+r+"'")}}var h=c[r]={exports:{}};o[r][0].call(h.exports,function(t){return n(o[r][1][t]||t)},h,h.exports,t,o,c,e)}return c[r].exports}for(var i="function"==typeof __require&&__require,r=0;r<e.length;r++)n(e[r]);return n}({BlockController:[function(t,o,c){"use strict";cc._RF.push(o,"e74a8E4HD5K97D/9d6IOq3s","BlockController");var e=t("Colors");cc.Class({extends:cc.Component,properties:{titleBlock:{default:null,type:cc.Label,_canCombine:!1}},onLoad:function(){this._canCombine=!1},setNumber:function(t){0===t?(this.titleBlock.node.active=!1,this.node.color=e[0]):(this.titleBlock.string=t,this.titleBlock.node.active=!0,this.titleBlock.node.color=cc.Color.WHITE,t in e&&(this.node.color=e[t]),2==t&&(this.titleBlock.node.color=cc.color("#635B52")),4==t&&(this.titleBlock.node.color=cc.color("#635B52")))}}),cc._RF.pop()},{Colors:"Colors"}],Colors:[function(t,o,c){"use strict";cc._RF.push(o,"a3fa04DXahBaY8EntaJq1aA","Colors");var e=[];e[0]=cc.color("C0B4A4"),e[2]=cc.color("E9DDD1"),e[4]=cc.color("EAD9BE"),e[8]=cc.color("EAD9BE"),e[16]=cc.color("F28151"),e[32]=cc.color("F26A4F"),e[64]=cc.color("F2472E"),e[128]=cc.color("E8C860"),e[256]=cc.color("E9C34F"),e[512]=cc.color("E8BE41"),e[1024]=cc.color("E9B931"),e[2048]=cc.color("E8B724"),o.exports=e,cc._RF.pop()},{}],GameManager:[function(t,o,c){"use strict";cc._RF.push(o,"016acPX4gdMY7UAGkEsBhhU","GameManager");var e=cc.Enum({RIGHT:-1,LEFT:-1,UP:-1,DOWN:-1});cc.Class({extends:cc.Component,properties:{scoreLabel:cc.Label,bestScoreLabel:cc.Label,blockPrefab:cc.Prefab,bgBox:cc.Node,cellPrefab:cc.Prefab,loseLayOut:cc.Node,winLayOut:cc.Node,hoverScorePrefab:cc.Prefab,_gap:{default:10,serializable:!1},_blockSize:null,_data:[],_arrBlock:[],_posisions:[],_score:null,_canMove:!0,_startPoint:null,_endPoint:null,_firstX:null,_firstY:null,_endX:null,_endY:null,_vector:null,_first2048:!0,_isCLick:!0,_tempScore:0},onLoad:function(){this.winLayOut.active=!1,this.loseLayOut.active=!1,this._canMove=!0,this.loseLayOut.active=!1,this._isCLick=!0,this._first2048=!0,this._tempScore=0},start:function(){this._blockSize=(this.bgBox.width-5*this._gap)/4,this.eventHandler(),this.getScoreStorge(),this.blockInit(),this.init()},arrInit:function(t,o){for(var c=new Array,e=0;e<t;e++){c[e]=new Array;for(var n=0;n<o;n++)c[e][n]=0}return c},init:function(){this.updateScore(0),this._data=this.arrInit(4,4);for(var t=0;t<4;t++)for(var o=0;o<4;o++)this._arrBlock[t][o].getComponent("BlockController").setNumber(0),this._data[t][o]=0;this.addBlock(),this.addBlock()},blockInit:function(){this._arrBlock=this.arrInit(4,4);for(var t=0;t<4;t++){this._posisions.push([0,0,0,0]);for(var o=0;o<4;o++){var c=-this.bgBox.width/2+(this._gap*(o+1)+this._blockSize/2*(2*o+1)),e=this.bgBox.height/2-(this._gap*(t+1)+this._blockSize/2*(2*t+1)),n=cc.instantiate(this.blockPrefab);n.parent=this.bgBox,n.width=this._blockSize,n.height=this._blockSize,n.setPosition(cc.v2(c,e)),this._posisions[t][o]=cc.v2(c,e),n.getComponent("BlockController").setNumber(0),this._arrBlock[t][o]=n}}},getEmptyLocations:function(){for(var t=[],o=0;o<4;o++)for(var c=0;c<4;c++)0===this._data[o][c]&&t.push({x:o,y:c});return t},addBlock:function(){var t=this.getEmptyLocations();if(0===t.length)return!1;var o=t[Math.floor(Math.random()*t.length)],c=o.x,e=o.y,n=this._posisions[c][e],i=cc.instantiate(this.blockPrefab);i.width=this._blockSize,i.height=this._blockSize,i.parent=this.bgBox,i.setPosition(n);var r=Math.random()<=.9?2:4;return i.getComponent("BlockController").setNumber(r),this._arrBlock[c][e]=i,this._data[c][e]=r,this.checkGameOver()&&this.gameOver(),!0},updateScore:function(t){this._score=t,this.scoreLabel.string=t},hoverScore:function(t){if(0!==t){var o=cc.instantiate(this.hoverScorePrefab);o.parent=this.scoreLabel.node,o.getComponent(cc.Label).string="+ "+t,cc.tween(o).to(1,{position:cc.v2(50,50)}).call(function(){o.destroy()}).start()}},eventHandler:function(){var t=this;cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,this.onKeyDown,this),cc.sys.isMobile&&(cc.Canvas.instance.node.on("touchstart",function(o){t._startPoint=o.getLocation()}),cc.Canvas.instance.node.on("touchend",function(o){t._endPoint=o.getLocation(),t.reflectTouch()}),cc.Canvas.instance.node.on("touchcancel",function(o){t._endPoint=o.getLocation(),t.reflectTouch()})),(cc.sys.IPAD||cc.sys.DESKTOP_BROWSER)&&(cc.Canvas.instance.node.on("mousedown",function(o){t._isCLick=!1,t._startPoint=o.getLocation(),t._firstX=t._startPoint.x,t._firstY=t._startPoint.y}),cc.Canvas.instance.node.on("mouseup",function(o){t._isCLick=!0,t._endPoint=o.getLocation(),t._endX=t._startPoint.x-t._endPoint.x,t._endY=t._startPoint.y-t._endPoint.y,t._vector=cc.v2(t._endX,t._endY),t.mouseEvent()}))},reflectTouch:function(){var t=this._startPoint,o=this._endPoint.sub(t);o.mag()>10&&(Math.abs(o.x)>Math.abs(o.y)?o.x>0?this.touchEvent(e.RIGHT):this.touchEvent(e.LEFT):o.y>0?this.touchEvent(e.UP):this.touchEvent(e.DOWN))},onKeyDown:function(t){if(this._isCLick&&this._canMove)switch(this._canMove=!1,t.keyCode){case cc.macro.KEY.right:this.blockMoveRight();break;case cc.macro.KEY.left:this.blockMoveLeft();break;case cc.macro.KEY.up:this.blockMoveUp();break;case cc.macro.KEY.down:this.blockMoveDown()}},touchEvent:function(t){if(this._canMove)switch(this._canMove=!1,t){case e.RIGHT:this.blockMoveRight();break;case e.LEFT:this.blockMoveLeft();break;case e.UP:this.blockMoveUp();break;case e.DOWN:this.blockMoveDown()}},mouseEvent:function(){this._vector.mag()>10&&this._canMove&&(this._canMove=!1,this._vector.x<0&&this._vector.y<50&&this._vector.y>-50?this.blockMoveRight():this._vector.x>0&&this._vector.y<50&&this._vector.y>-50?this.blockMoveLeft():this._vector.y<0&&this._vector.x<50&&this._vector.x>-50?this.blockMoveUp():this._vector.y>0&&this._vector.x<50&&this._vector.x>-50&&this.blockMoveDown())},afterMove:function(t){this._canMove=!0,(this.winLayOut.active||this.loseLayOut.active)&&(this._canMove=!1),t&&(this.addBlock(),this.checkScore())},moveBlock:function(t,o,c){var e=cc.moveTo(.05,o),n=cc.callFunc(function(){c&&c()});t.runAction(cc.sequence(e,n))},combineBlock:function(t,o,c,e){this._tempScore+=c,this.updateScore(this._score+c),this.hoverScore(this._tempScore),this._tempScore=0,t.destroy();var n=cc.scaleTo(.1,1.1),i=cc.scaleTo(.1,1),r=cc.callFunc(function(){o.getComponent("BlockController").setNumber(c)}),a=cc.callFunc(function(){e&&e()});null!==o&&o.runAction(cc.sequence(n,r,i,a)),this._first2048&&2048===c&&(this.gameWin(),this._first2048=!1)},activeCombine:function(){for(var t=0;t<4;t++)for(var o=0;o<4;o++)0!==this._data[t][o]&&(this._arrBlock[t][o].getComponent("BlockController")._canCombine=!0)},checkGameOver:function(){for(var t=0;t<4;t++)for(var o=0;o<4;o++){var c=this._data[t][o];if(0===c)return!1;if(o>0&&this._data[t][o-1]==c)return!1;if(o<3&&this._data[t][o+1]==c)return!1;if(t>0&&this._data[t-1][o]==c)return!1;if(t<3&&this._data[t+1][o]==c)return!1}return!0},blockMoveRight:function(){var t=this,o=!1;this.activeCombine();for(var c=function c(e,n,i){if(5!=n&&0!=t._data[e][n])if(0==t._data[e][n+1]){var r=t._arrBlock[e][n],a=t._posisions[e][n+1];t._arrBlock[e][n+1]=r,t._data[e][n+1]=t._data[e][n],t._data[e][n]=0,t._arrBlock[e][n]=null,t.moveBlock(r,a,function(){c(e,n+1,i)}),o=!0}else{if(t._data[e][n+1]!=t._data[e][n])return void(i&&i());if(i&&i(),t._arrBlock[e][n+1].getComponent("BlockController")._canCombine){t._arrBlock[e][n+1].getComponent("BlockController")._canCombine=!1;var s=t._arrBlock[e][n],l=t._posisions[e][n+1];t._data[e][n+1]*=2,t._data[e][n]=0,t._arrBlock[e][n]=null,t.moveBlock(s,l,function(){t.combineBlock(s,t._arrBlock[e][n+1],t._data[e][n+1],function(){i&&i()})}),o=!0}}else i&&i()},e=[],n=0;n<4;n++)for(var i=3;i>=0;i--)0!=this._data[n][i]&&e.push({x:n,y:i});for(var r=0,a=0;a<e.length;a++)c(e[a].x,e[a].y,function(){++r===e.length&&t.afterMove(o)})},blockMoveLeft:function(){var t=this,o=!1;this.activeCombine();for(var c=function c(e,n,i){if(0!=n&&0!=t._data[e][n])if(0==t._data[e][n-1]){var r=t._arrBlock[e][n],a=t._posisions[e][n-1];t._arrBlock[e][n-1]=r,t._data[e][n-1]=t._data[e][n],t._data[e][n]=0,t._arrBlock[e][n]=null,t.moveBlock(r,a,function(){c(e,n-1,i)}),o=!0}else{if(t._data[e][n-1]!=t._data[e][n])return void(i&&i());if(i&&i(),t._arrBlock[e][n-1].getComponent("BlockController")._canCombine){t._arrBlock[e][n-1].getComponent("BlockController")._canCombine=!1;var s=t._arrBlock[e][n],l=t._posisions[e][n-1];t._data[e][n-1]*=2,t._data[e][n]=0,t._arrBlock[e][n]=null,t.moveBlock(s,l,function(){t.combineBlock(s,t._arrBlock[e][n-1],t._data[e][n-1],function(){i&&i()})}),o=!0}}else i&&i()},e=[],n=0;n<4;n++)for(var i=0;i<4;i++)0!=this._data[n][i]&&e.push({x:n,y:i});for(var r=0,a=0;a<e.length;a++)c(e[a].x,e[a].y,function(){++r===e.length&&t.afterMove(o)})},blockMoveDown:function(){var t=this,o=!1;this.activeCombine();for(var c=function c(e,n,i){if(3!=e&&0!=t._data[e][n])if(0==t._data[e+1][n]){var r=t._arrBlock[e][n],a=t._posisions[e+1][n];t._arrBlock[e+1][n]=r,t._data[e+1][n]=t._data[e][n],t._data[e][n]=0,t._arrBlock[e][n]=null,t.moveBlock(r,a,function(){c(e+1,n,i)}),o=!0}else{if(t._data[e+1][n]!=t._data[e][n])return void(i&&i());if(i&&i(),t._arrBlock[e+1][n].getComponent("BlockController")._canCombine){t._arrBlock[e+1][n].getComponent("BlockController")._canCombine=!1;var s=t._arrBlock[e][n],l=t._posisions[e+1][n];t._data[e+1][n]*=2,t._data[e][n]=0,t._arrBlock[e][n]=null,t.moveBlock(s,l,function(){t.combineBlock(s,t._arrBlock[e+1][n],t._data[e+1][n],function(){i&&i()})}),o=!0}}else i&&i()},e=[],n=3;n>=0;n--)for(var i=0;i<4;i++)0!=this._data[n][i]&&e.push({x:n,y:i});for(var r=0,a=0;a<e.length;a++)c(e[a].x,e[a].y,function(){++r===e.length&&t.afterMove(o)})},blockMoveUp:function(){var t=this,o=!1;this.activeCombine();for(var c=function c(e,n,i){if(0!=e&&0!=t._data[e][n])if(0==t._data[e-1][n]){var r=t._arrBlock[e][n],a=t._posisions[e-1][n];t._arrBlock[e-1][n]=r,t._data[e-1][n]=t._data[e][n],t._data[e][n]=0,t._arrBlock[e][n]=null,t.moveBlock(r,a,function(){c(e-1,n,i)}),o=!0}else{if(t._data[e-1][n]!=t._data[e][n])return void(i&&i());if(i&&i(),t._arrBlock[e-1][n].getComponent("BlockController")._canCombine){t._arrBlock[e-1][n].getComponent("BlockController")._canCombine=!1;var s=t._arrBlock[e][n],l=t._posisions[e-1][n];t._data[e-1][n]*=2,t._data[e][n]=0,t._arrBlock[e][n]=null,t.moveBlock(s,l,function(){t.combineBlock(s,t._arrBlock[e-1][n],t._data[e-1][n],function(){i&&i()})}),o=!0}}else i&&i()},e=[],n=0;n<4;n++)for(var i=0;i<4;i++)0!=this._data[n][i]&&e.push({x:n,y:i});for(var r=0,a=0;a<e.length;a++)c(e[a].x,e[a].y,function(){++r===e.length&&t.afterMove(o)})},gameOver:function(){cc.tween(this.node).to(.5,{opacity:150}).start(),this.loseLayOut.active=!0},gameWin:function(){cc.tween(this.node).to(1,{opacity:150}).start(),this.winLayOut.active=!0},onRestartClick:function(){this._canMove=!0,this.blockInit(),this.init(),this.node.opacity=255,this.loseLayOut.active=!1,this.winLayOut.active=!1},onContinueClick:function(){this._canMove=!0,this.node.opacity=255,this.winLayOut.active=!1},getScoreStorge:function(){var t=cc.sys.localStorage.getItem("bestScore");this.bestScoreLabel.string=null!==t?JSON.parse(t):0},checkScore:function(){var t=parseInt(this.scoreLabel.string);t>this.bestScoreLabel.string&&(cc.sys.localStorage.setItem("bestScore",JSON.stringify(t)),this.bestScoreLabel.string=t)}}),cc._RF.pop()},{}]},{},["BlockController","Colors","GameManager"]);
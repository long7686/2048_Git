window.__require=function t(o,e,c){function i(a,r){if(!e[a]){if(!o[a]){var s=a.split("/");if(s=s[s.length-1],!o[s]){var l="function"==typeof __require&&__require;if(!r&&l)return l(s,!0);if(n)return n(s,!0);throw new Error("Cannot find module '"+a+"'")}}var h=e[a]={exports:{}};o[a][0].call(h.exports,function(t){return i(o[a][1][t]||t)},h,h.exports,t,o,e,c)}return e[a].exports}for(var n="function"==typeof __require&&__require,a=0;a<c.length;a++)i(c[a]);return i}({BlockController:[function(t,o,e){"use strict";cc._RF.push(o,"e74a8E4HD5K97D/9d6IOq3s","BlockController");var c=t("Colors");cc.Class({extends:cc.Component,properties:{titleBlock:{default:null,type:cc.Label,_canCombine:!0}},onLoad:function(){this._canCombine=!0},setNumber:function(t){0===t?(this.titleBlock.node.active=!1,this.node.color=c[0]):(this.titleBlock.string=t,this.titleBlock.node.active=!0,this.titleBlock.node.color=cc.Color.WHITE,t in c&&(this.node.color=c[t]),2==t&&(this.titleBlock.node.color=cc.color("#635B52")),4==t&&(this.titleBlock.node.color=cc.color("#635B52")))}}),cc._RF.pop()},{Colors:"Colors"}],Colors:[function(t,o,e){"use strict";cc._RF.push(o,"a3fa04DXahBaY8EntaJq1aA","Colors");var c=[];c[0]=cc.color("C0B4A4"),c[2]=cc.color("E9DDD1"),c[4]=cc.color("EAD9BE"),c[8]=cc.color("EAD9BE"),c[16]=cc.color("F28151"),c[32]=cc.color("F26A4F"),c[64]=cc.color("F2472E"),c[128]=cc.color("E8C860"),c[256]=cc.color("E9C34F"),c[512]=cc.color("E8BE41"),c[1024]=cc.color("E9B931"),c[2048]=cc.color("E8B724"),o.exports=c,cc._RF.pop()},{}],GameManager:[function(t,o,e){"use strict";cc._RF.push(o,"016acPX4gdMY7UAGkEsBhhU","GameManager");var c=cc.Enum({RIGHT:-1,LEFT:-1,UP:-1,DOWN:-1});cc.Class({extends:cc.Component,properties:{scoreLabel:cc.Label,bestScoreLabel:cc.Label,blockPrefab:cc.Prefab,bgBox:cc.Node,cellPrefab:cc.Prefab,loseLayOut:cc.Node,winLayOut:cc.Node,hoverScorePrefab:cc.Prefab,newGameBtn:cc.Button,_gap:{default:10,serializable:!1},_blockSize:null,_data:[],_arrBlock:[],_posisions:[],_score:null,_canMove:!0,_startPoint:null,_endPoint:null,_firstX:null,_firstY:null,_endX:null,_endY:null,_vector:null,_isCLick:!0,_tempScore:0,_canWin:!0},onLoad:function(){this._canWin=!0,this._canMove=!0,this.loseLayOut.active=!1,this._isCLick=!0,this._tempScore=0},start:function(){this._blockSize=(this.bgBox.width-5*this._gap)/4,this.eventHandler(),this.getScoreStorge(),this.blockInit(),this.init()},arrInit:function(t,o){for(var e=new Array,c=0;c<t;c++){e[c]=new Array;for(var i=0;i<o;i++)e[c][i]=0}return e},init:function(){this.updateScore(0),this._data=this.arrInit(4,4);for(var t=0;t<4;t++)for(var o=0;o<4;o++)this._arrBlock[t][o].getComponent("BlockController").setNumber(0),this._data[t][o]=0;this.addBlock(),this.addBlock()},blockInit:function(){this._arrBlock=this.arrInit(4,4);for(var t=0;t<4;t++){this._posisions.push([0,0,0,0]);for(var o=0;o<4;o++){var e=-this.bgBox.width/2+(this._gap*(o+1)+this._blockSize/2*(2*o+1)),c=this.bgBox.height/2-(this._gap*(t+1)+this._blockSize/2*(2*t+1)),i=cc.instantiate(this.blockPrefab);i.parent=this.bgBox,i.width=this._blockSize,i.height=this._blockSize,i.setPosition(cc.v2(e,c)),this._posisions[t][o]=cc.v2(e,c),i.getComponent("BlockController").setNumber(0),this._arrBlock[t][o]=i}}},getEmptyLocations:function(){for(var t=[],o=0;o<4;o++)for(var e=0;e<4;e++)0===this._data[o][e]&&t.push({x:o,y:e});return t},addBlock:function(){var t=this.getEmptyLocations();if(0===t.length)return!1;var o=t[Math.floor(Math.random()*t.length)],e=o.x,c=o.y,i=this._posisions[e][c],n=cc.instantiate(this.blockPrefab);n.width=this._blockSize,n.height=this._blockSize,n.parent=this.bgBox,n.setPosition(i);var a=Math.random()<=.95?2:4;return n.getComponent("BlockController").setNumber(a),this._arrBlock[e][c]=n,this._data[e][c]=a,this.checkGameOver()&&this.gameOver(),!0},updateScore:function(t){this._score=t,this.scoreLabel.string=t},hoverScore:function(t){if(0!==t){var o=cc.instantiate(this.hoverScorePrefab);o.parent=this.scoreLabel.node,o.getComponent(cc.Label).string="+ "+t,cc.tween(o).to(1,{position:cc.v2(50,50)}).call(function(){o.destroy()}).start()}},eventHandler:function(){var t=this;cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP,this.onKeyDown,this),cc.sys.isMobile&&(this.bgBox.on("touchstart",function(o){t._startPoint=o.getLocation()}),this.bgBox.on("touchend",function(o){t._endPoint=o.getLocation(),t.reflectTouch()}),this.bgBox.on("touchcancel",function(o){t._endPoint=o.getLocation(),t.reflectTouch()})),(cc.sys.IPAD||cc.sys.DESKTOP_BROWSER)&&(this.bgBox.on("mousedown",function(o){t._isCLick=!1,t._startPoint=o.getLocation(),t._firstX=t._startPoint.x,t._firstY=t._startPoint.y}),this.bgBox.on("mouseup",function(o){t._isCLick=!0,t._endPoint=o.getLocation(),t._endX=t._startPoint.x-t._endPoint.x,t._endY=t._startPoint.y-t._endPoint.y,t._vector=cc.v2(t._endX,t._endY),t.mouseEvent()}))},reflectTouch:function(){var t=this._startPoint,o=this._endPoint.sub(t);o.mag()>10&&(Math.abs(o.x)>Math.abs(o.y)?o.x>0?this.touchEvent(c.RIGHT):this.touchEvent(c.LEFT):o.y>0?this.touchEvent(c.UP):this.touchEvent(c.DOWN))},onKeyDown:function(t){if(this._isCLick&&this._canMove&&!this.winLayOut.active)switch(t.keyCode){case cc.macro.KEY.right:this._canMove=!1,this.blockMoveRight();break;case cc.macro.KEY.left:this._canMove=!1,this.blockMoveLeft();break;case cc.macro.KEY.up:this._canMove=!1,this.blockMoveUp();break;case cc.macro.KEY.down:this._canMove=!1,this.blockMoveDown()}},touchEvent:function(t){if(this._canMove&&!this.winLayOut.active)switch(t){case c.RIGHT:this._canMove=!1,this.blockMoveRight();break;case c.LEFT:this._canMove=!1,this.blockMoveLeft();break;case c.UP:this._canMove=!1,this.blockMoveUp();break;case c.DOWN:this._canMove=!1,this.blockMoveDown()}},mouseEvent:function(){this._vector.mag()>10&&this._canMove&&!this.winLayOut.active&&(this._vector.x<0&&this._vector.y<50&&this._vector.y>-50?(this._canMove=!1,this.blockMoveRight()):this._vector.x>0&&this._vector.y<50&&this._vector.y>-50&&(this._canMove=!1,this.blockMoveLeft()),this._vector.y<0&&this._vector.x<50&&this._vector.x>-50?(this._canMove=!1,this.blockMoveUp()):this._vector.y>0&&this._vector.x<50&&this._vector.x>-50&&(this._canMove=!1,this.blockMoveDown()))},afterMove:function(t){this._canMove=!0,t&&(this.addBlock(),this.checkScore()),this.hoverScore(this._tempScore),this._tempScore=0},moveBlock:function(t,o,e){var c=cc.moveTo(.05,o),i=cc.callFunc(function(){e&&e()});t.runAction(cc.sequence(c,i))},combineBlock:function(t,o,e,c){t.destroy(),o.getComponent("BlockController")._canCombine=!1;var i=cc.scaleTo(.1,1.1),n=cc.scaleTo(.1,1),a=cc.callFunc(function(){o.getComponent("BlockController").setNumber(e)}),r=cc.callFunc(function(){c&&c()});o.runAction(cc.sequence(i,a,n,r)),this.updateScore(this._score+e),this._tempScore+=e,2048===e&&this._canWin&&(this._canWin=!1,this.gameWin())},activeCombine:function(){for(var t=0;t<4;t++)for(var o=0;o<4;o++)0!==this._data[t][o]&&(this._arrBlock[t][o].getComponent("BlockController")._canCombine=!0)},checkGameOver:function(){for(var t=0;t<4;t++)for(var o=0;o<4;o++){var e=this._data[t][o];if(0===e)return!1;if(o>0&&this._data[t][o-1]==e)return!1;if(o<3&&this._data[t][o+1]==e)return!1;if(t>0&&this._data[t-1][o]==e)return!1;if(t<3&&this._data[t+1][o]==e)return!1}return!0},blockMoveRight:function(){var t=this,o=!1;this.activeCombine();for(var e=function e(c,i,n){if(3!=i&&0!=t._data[c][i])if(0==t._data[c][i+1]){var a=t._arrBlock[c][i],r=t._posisions[c][i+1];t._arrBlock[c][i+1]=a,t._data[c][i+1]=t._data[c][i],t._data[c][i]=0,t._arrBlock[c][i]=null,t.moveBlock(a,r,function(){e(c,i+1,n)}),o=!0}else{if(t._data[c][i+1]!=t._data[c][i])return void(n&&n());if(t._arrBlock[c][i+1].getComponent("BlockController")._canCombine){var s=t._arrBlock[c][i],l=t._posisions[c][i+1];t._data[c][i+1]*=2,t._data[c][i]=0,t._arrBlock[c][i]=null,t.moveBlock(s,l,function(){t.combineBlock(s,t._arrBlock[c][i+1],t._data[c][i+1],function(){n&&n()})}),o=!0}else n&&n()}else n&&n()},c=[],i=0;i<4;i++)for(var n=3;n>=0;n--)0!=this._data[i][n]&&c.push({x:i,y:n});for(var a=0,r=0;r<c.length;r++)e(c[r].x,c[r].y,function(){++a==c.length&&t.afterMove(o)})},blockMoveLeft:function(){var t=this,o=!1;this.activeCombine();for(var e=function e(c,i,n){if(0!=i&&0!=t._data[c][i])if(0==t._data[c][i-1]){var a=t._arrBlock[c][i],r=t._posisions[c][i-1];t._arrBlock[c][i-1]=a,t._data[c][i-1]=t._data[c][i],t._data[c][i]=0,t._arrBlock[c][i]=null,t.moveBlock(a,r,function(){e(c,i-1,n)}),o=!0}else{if(t._data[c][i-1]!=t._data[c][i])return void(n&&n());if(t._arrBlock[c][i-1].getComponent("BlockController")._canCombine){var s=t._arrBlock[c][i],l=t._posisions[c][i-1];t._data[c][i-1]*=2,t._data[c][i]=0,t._arrBlock[c][i]=null,t.moveBlock(s,l,function(){t.combineBlock(s,t._arrBlock[c][i-1],t._data[c][i-1],function(){n&&n()})}),o=!0}else n&&n()}else n&&n()},c=[],i=0;i<4;i++)for(var n=0;n<4;n++)0!=this._data[i][n]&&c.push({x:i,y:n});for(var a=0,r=0;r<c.length;r++)e(c[r].x,c[r].y,function(){++a==c.length&&t.afterMove(o)})},blockMoveDown:function(){var t=this,o=!1;this.activeCombine();for(var e=function e(c,i,n){if(3!=c&&0!=t._data[c][i])if(0==t._data[c+1][i]){var a=t._arrBlock[c][i],r=t._posisions[c+1][i];t._arrBlock[c+1][i]=a,t._data[c+1][i]=t._data[c][i],t._data[c][i]=0,t._arrBlock[c][i]=null,t.moveBlock(a,r,function(){e(c+1,i,n)}),o=!0}else{if(t._data[c+1][i]!=t._data[c][i])return void(n&&n());if(t._arrBlock[c+1][i].getComponent("BlockController")._canCombine){var s=t._arrBlock[c][i],l=t._posisions[c+1][i];t._data[c+1][i]*=2,t._data[c][i]=0,t._arrBlock[c][i]=null,t.moveBlock(s,l,function(){t.combineBlock(s,t._arrBlock[c+1][i],t._data[c+1][i],function(){n&&n()})}),o=!0}else n&&n()}else n&&n()},c=[],i=3;i>=0;i--)for(var n=0;n<4;n++)0!=this._data[i][n]&&c.push({x:i,y:n});for(var a=0,r=0;r<c.length;r++)e(c[r].x,c[r].y,function(){++a==c.length&&t.afterMove(o)})},blockMoveUp:function(){var t=this,o=!1;this.activeCombine();for(var e=function e(c,i,n){if(0!=c&&0!=t._data[c][i])if(0==t._data[c-1][i]){var a=t._arrBlock[c][i],r=t._posisions[c-1][i];t._arrBlock[c-1][i]=a,t._data[c-1][i]=t._data[c][i],t._data[c][i]=0,t._arrBlock[c][i]=null,t.moveBlock(a,r,function(){e(c-1,i,n)}),o=!0}else{if(t._data[c-1][i]!=t._data[c][i])return void(n&&n());if(t._arrBlock[c-1][i].getComponent("BlockController")._canCombine){var s=t._arrBlock[c][i],l=t._posisions[c-1][i];t._data[c-1][i]*=2,t._data[c][i]=0,t._arrBlock[c][i]=null,t.moveBlock(s,l,function(){t.combineBlock(s,t._arrBlock[c-1][i],t._data[c-1][i],function(){n&&n()})}),o=!0}else n&&n()}else n&&n()},c=[],i=0;i<4;i++)for(var n=0;n<4;n++)0!=this._data[i][n]&&c.push({x:i,y:n});for(var a=0,r=0;r<c.length;r++)e(c[r].x,c[r].y,function(){++a==c.length&&t.afterMove(o)})},gameOver:function(){cc.tween(this.node).to(.5,{opacity:150}).start(),this.loseLayOut.active=!0,this.newGameBtn.getComponent(cc.Button).interactable=!1},gameWin:function(){this._canMove=!1,cc.tween(this.node).to(.5,{opacity:150}).start(),this.winLayOut.active=!0,this.newGameBtn.getComponent(cc.Button).interactable=!1},onRestartClick:function(){for(var t=0;t<this.bgBox.children.length;t++)null!==this.bgBox.children[t]&&this.bgBox.children[t].destroy();this._canMove=!0,this._canWin=!0,this.blockInit(),this.init(),this.node.opacity=255,this.loseLayOut.active=!1,this.winLayOut.active=!1,this.newGameBtn.getComponent(cc.Button).interactable=!0},onContinueClick:function(){this._canMove=!0,this.node.opacity=255,this.winLayOut.active=!1,this.newGameBtn.getComponent(cc.Button).interactable=!0},getScoreStorge:function(){var t=cc.sys.localStorage.getItem("bestScore");this.bestScoreLabel.string=null!==t?JSON.parse(t):0},checkScore:function(){var t=parseInt(this.scoreLabel.string);t>this.bestScoreLabel.string&&(cc.sys.localStorage.setItem("bestScore",JSON.stringify(t)),this.bestScoreLabel.string=t)}}),cc._RF.pop()},{}]},{},["BlockController","Colors","GameManager"]);
//Dong
const ROWS = 4;
const DIRECTION = cc.Enum({
    RIGHT: -1,
    LEFT: -1,
    UP: -1,
    DOWN: -1
});
const MIN_LENGTH = 10;

cc.Class({
    extends: cc.Component,

    properties: {
        scoreLabel: cc.Label,
        bestScoreLabel: cc.Label,
        blockPrefab: cc.Prefab,
        bgBox: cc.Node,
        cellPrefab: cc.Prefab,
        loseLayOut: cc.Node,
        winLayOut: cc.Node,
        hoverScorePrefab: cc.Prefab,
        newGameBtn : cc.Button,

        _gap: {
            default: 10,
            serializable: false,
        },
        _blockSize: null,
        _data: [],
        _arrBlock: [],
        _posisions: [],
        _score: null,
        _canMove: true,
        _startPoint: null,
        _endPoint: null,
        _firstX: null,
        _firstY: null,
        _endX: null,
        _endY: null,
        _vector: null,
        _isCLick: true,
        _tempScore: 0,
        _canWin: true,
    },

    onLoad() {
        this._canWin = true;
        this._canMove = true;
        this.loseLayOut.active = false;
        this._isCLick = true;
        this._tempScore = 0;
    },

    start() {
        this._blockSize = (this.bgBox.width - this._gap * 5) / 4;
        this.eventHandler();
        this.getScoreStorge();
        this.blockInit();
        this.init();
    },

    arrInit(x, y) {
        let blockArr = new Array();
        for (let i = 0; i < x; i++) {
            blockArr[i] = new Array();
            for (let j = 0; j < y; j++) {
                blockArr[i][j] = 0;
            }
        }
        return blockArr;
    },

    init() {
        this.updateScore(0);
        this._data = this.arrInit(ROWS, ROWS);

        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < ROWS; col++) {
                this._arrBlock[row][col].getComponent("BlockController").setNumber(0);
                this._data[row][col] = 0;
            }
        };
        this.addBlock();
        this.addBlock();

    },

    blockInit() {
        this._arrBlock = this.arrInit(ROWS, ROWS);
        for (let i = 0; i < ROWS; i++) {
            this._posisions.push([0, 0, 0, 0]);
            for (let j = 0; j < ROWS; j++) {
                let x = -(this.bgBox.width / 2) + (this._gap * (j + 1) + this._blockSize / 2 * (2 * j + 1));
                let y = (this.bgBox.height / 2) - (this._gap * (i + 1) + this._blockSize / 2 * (2 * i + 1));
                let block = cc.instantiate(this.blockPrefab);
                block.parent = this.bgBox;
                block.width = this._blockSize;
                block.height = this._blockSize;
                block.setPosition(cc.v2(x, y));
                this._posisions[i][j] = (cc.v2(x, y));
                block.getComponent("BlockController").setNumber(0);
                this._arrBlock[i][j] = block;
            }
        }
    },

    getEmptyLocations() {
        let locations = [];
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < ROWS; col++) {
                if (this._data[row][col] === 0) {
                    locations.push({
                        x: row,
                        y: col,
                    })
                }
            }
        }
        return locations;
    },

    addBlock() {
        let locations = this.getEmptyLocations();
        if (locations.length === 0) return false;

        let location = locations[Math.floor(Math.random() * locations.length)];
        let x = location.x;
        let y = location.y;
        let position = this._posisions[x][y];
        let block = cc.instantiate(this.blockPrefab);
        block.width = this._blockSize;
        block.height = this._blockSize;
        block.parent = this.bgBox;
        block.setPosition(position);

        let number = Math.random() <= 0.95 ? 2 : 4;
        block.getComponent("BlockController").setNumber(number);
        this._arrBlock[x][y] = block;
        this._data[x][y] = number;

        if (this.checkGameOver()) {
            this.gameOver()
        }

        return true;
    },

    updateScore(num) {
        this._score = num;
        this.scoreLabel.string = num;
    },

    hoverScore(num) {
        if (num !== 0) {
            let hoverScore = cc.instantiate(this.hoverScorePrefab);
            hoverScore.parent = this.scoreLabel.node;
            hoverScore.getComponent(cc.Label).string = "+ " + num;
            cc.tween(hoverScore)
                .to(1, { position: cc.v2(50, 50) })
                .call(() => {
                    hoverScore.destroy()
                })
                .start()
        }
    },

    eventHandler() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyDown, this);

        if (cc.sys.isMobile) {
            this.bgBox.on("touchstart", (event) => {
                this._startPoint = event.getLocation();
            })
            this.bgBox.on("touchend", (event) => {
                this._endPoint = event.getLocation();
                this.reflectTouch();
            })
            this.bgBox.on("touchcancel", (event) => {
                this._endPoint = event.getLocation();
                this.reflectTouch();
            })
        }
        if (cc.sys.IPAD || cc.sys.DESKTOP_BROWSER) {
            this.bgBox.on("mousedown", (event) => {
                this._isCLick = false;
                this._startPoint = event.getLocation();
                this._firstX = this._startPoint.x;
                this._firstY = this._startPoint.y;
            })
            this.bgBox.on("mouseup", (event) => {
                this._isCLick = true;
                this._endPoint = event.getLocation();
                this._endX = this._startPoint.x - this._endPoint.x;
                this._endY = this._startPoint.y - this._endPoint.y;
                this._vector = cc.v2(this._endX, this._endY);
                this.mouseEvent();
            })
        }
    },

    reflectTouch() {
        let startVec = this._startPoint;
        let endVec = this._endPoint;
        let pointsVec = endVec.sub(startVec);
        let vecLength = pointsVec.mag();
        if (vecLength > MIN_LENGTH) {
            if (Math.abs(pointsVec.x) > Math.abs(pointsVec.y)) {
                if (pointsVec.x > 0) this.touchEvent(DIRECTION.RIGHT);
                else this.touchEvent(DIRECTION.LEFT);
            } else {
                if (pointsVec.y > 0) this.touchEvent(DIRECTION.UP);
                else this.touchEvent(DIRECTION.DOWN);
            }
        }
    },

    onKeyDown(event) {
        if (this._isCLick) {
            if (this._canMove && !this.winLayOut.active) {
                switch (event.keyCode) {
                    case cc.macro.KEY.right:
                        this._canMove = false
                        this.blockMoveRight();
                        break;
                    case cc.macro.KEY.left:
                        this._canMove = false
                        this.blockMoveLeft();
                        break;
                    case cc.macro.KEY.up:
                        this._canMove = false
                        this.blockMoveUp();
                        break;
                    case cc.macro.KEY.down:
                        this._canMove = false
                        this.blockMoveDown();
                        break;
                };
            }
        };

    },

    touchEvent(direction) {
        if (this._canMove && !this.winLayOut.active) {
            switch (direction) {
                case DIRECTION.RIGHT: {
                    this._canMove = false
                    this.blockMoveRight();
                    break;
                }
                case DIRECTION.LEFT: {
                    this._canMove = false
                    this.blockMoveLeft();
                    break;
                }
                case DIRECTION.UP: {
                    this._canMove = false
                    this.blockMoveUp();
                    break;
                }
                case DIRECTION.DOWN: {
                    this._canMove = false
                    this.blockMoveDown();

                    break;
                }
            }
        }
    },

    mouseEvent() {
        if (this._vector.mag() > MIN_LENGTH) {
            if (this._canMove && !this.winLayOut.active) {
                if (this._vector.x < 0 && this._vector.y < 50 && this._vector.y > -50) {
                    this._canMove = false
                    this.blockMoveRight();
                } else if (this._vector.x > 0 && this._vector.y < 50 && this._vector.y > -50) {
                    this._canMove = false
                    this.blockMoveLeft();
                }
                if (this._vector.y < 0 && this._vector.x < 50 && this._vector.x > -50) {
                    this._canMove = false
                    this.blockMoveUp();
                } else if (this._vector.y > 0 && this._vector.x < 50 && this._vector.x > -50) {
                    this._canMove = false
                    this.blockMoveDown();
                }
            }
        }
    },

    afterMove(hasMoved) {
        this._canMove = true
        if (hasMoved) {
            this.addBlock();
            this.checkScore();
        }

        this.hoverScore(this._tempScore);
        this._tempScore = 0;
    },

    moveBlock(block, position, callback) {
        let action = cc.moveTo(.05, position);
        let finish = cc.callFunc(() => {
            callback && callback();
        })
        block.runAction(cc.sequence(action, finish,));
    },

    combineBlock(b1, b2, num, callback) {
        b1.destroy();
        b2.getComponent("BlockController")._canCombine = false
        let scale1 = cc.scaleTo(0.1, 1.1);
        let scale2 = cc.scaleTo(0.1, 1);
        let mid = cc.callFunc(() => {
            b2.getComponent("BlockController").setNumber(num);
        });
        let finish = cc.callFunc(() => {
            callback && callback();
        })
        b2.runAction(cc.sequence(scale1, mid, scale2, finish));
        this.updateScore(this._score + num);
        this._tempScore += num;
        if (num === 2048 && this._canWin) {
            this._canWin = false;
            this.gameWin()
        }
    },

    activeCombine() {
        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < ROWS; j++) {
                if (this._data[i][j] !== 0) {
                    this._arrBlock[i][j].getComponent("BlockController")._canCombine = true
                }
            }
        }
    },

    checkGameOver() {
        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < ROWS; j++) {
                let n = this._data[i][j];
                if (n === 0) return false;
                if (j > 0 && this._data[i][j - 1] == n) return false;
                if (j < ROWS - 1 && this._data[i][j + 1] == n) return false;
                if (i > 0 && this._data[i - 1][j] == n) return false;
                if (i < ROWS - 1 && this._data[i + 1][j] == n) return false;
            }
        }
        return true;
    },

    blockMoveRight() {
        let hasMoved = false;
        this.activeCombine()
        let move = (x, y, callback) => {
            if (y == ROWS - 1 || this._data[x][y] == 0) {
                callback && callback();
                return;
            } else if (this._data[x][y + 1] == 0) {
                let block = this._arrBlock[x][y];
                let position = this._posisions[x][y + 1];
                this._arrBlock[x][y + 1] = block;
                this._data[x][y + 1] = this._data[x][y];
                this._data[x][y] = 0;
                this._arrBlock[x][y] = null;
                this.moveBlock(block, position, () => {
                    move(x, y + 1, callback);
                });
                hasMoved = true;
            } else if (this._data[x][y + 1] == this._data[x][y]) {
                if (this._arrBlock[x][y + 1].getComponent("BlockController")._canCombine) {
                    let block = this._arrBlock[x][y];
                    let position = this._posisions[x][y + 1];
                    this._data[x][y + 1] *= 2;
                    this._data[x][y] = 0;
                    this._arrBlock[x][y] = null
                    this.moveBlock(block, position, () => {
                        this.combineBlock(block, this._arrBlock[x][y + 1], this._data[x][y + 1], () => {
                            callback && callback();
                        })
                    });
                    hasMoved = true;
                }
                else callback && callback()
            } else {
                callback && callback();
                return;
            }
        }

        let toMove = [];
        for (let i = 0; i < ROWS; i++) {
            for (let j = ROWS - 1; j >= 0; j--) {
                if (this._data[i][j] != 0) {
                    toMove.push({
                        x: i,
                        y: j,
                    });
                }
            }
        }

        let count = 0;
        for (let i = 0; i < toMove.length; i++) {
            move(toMove[i].x, toMove[i].y, () => {
                count++;
                if (count == toMove.length) {
                    this.afterMove(hasMoved);
                }
            })
        }
    },

    blockMoveLeft() {
        let hasMoved = false;
        this.activeCombine()
        let move = (x, y, callback) => {
            if (y == 0 || this._data[x][y] == 0) {
                callback && callback();
                return;
            } else if (this._data[x][y - 1] == 0) {
                let block = this._arrBlock[x][y];
                let position = this._posisions[x][y - 1];
                this._arrBlock[x][y - 1] = block;
                this._data[x][y - 1] = this._data[x][y];
                this._data[x][y] = 0;
                this._arrBlock[x][y] = null;
                this.moveBlock(block, position, () => {
                    move(x, y - 1, callback);
                });
                hasMoved = true;
            } else if (this._data[x][y - 1] == this._data[x][y]) {
                if (this._arrBlock[x][y - 1].getComponent("BlockController")._canCombine) {
                    let block = this._arrBlock[x][y];
                    let position = this._posisions[x][y - 1];
                    this._data[x][y - 1] *= 2;
                    this._data[x][y] = 0;
                    this._arrBlock[x][y] = null
                    this.moveBlock(block, position, () => {
                        this.combineBlock(block, this._arrBlock[x][y - 1], this._data[x][y - 1], () => {
                            callback && callback();
                        })
                    });
                    hasMoved = true;
                }
                else callback && callback()
            } else {
                callback && callback();
                return;
            }
        }
        let toMove = [];
        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < ROWS; j++) {
                if (this._data[i][j] != 0) {
                    toMove.push({
                        x: i,
                        y: j,
                    });
                }
            }
        }

        let count = 0;
        for (let i = 0; i < toMove.length; i++) {
            move(toMove[i].x, toMove[i].y, () => {
                count++;
                if (count == toMove.length) {
                    this.afterMove(hasMoved);
                }
            })
        }
    },

    blockMoveDown() {
        let hasMoved = false;
        this.activeCombine()
        let move = (x, y, callback) => {
            if (x == ROWS - 1 || this._data[x][y] == 0) {
                callback && callback();
                return;
            } else if (this._data[x + 1][y] == 0) {
                let block = this._arrBlock[x][y];
                let position = this._posisions[x + 1][y];
                this._arrBlock[x + 1][y] = block;
                this._data[x + 1][y] = this._data[x][y];
                this._data[x][y] = 0;
                this._arrBlock[x][y] = null;
                this.moveBlock(block, position, () => {
                    move(x + 1, y, callback);
                });
                hasMoved = true;
            } else if (this._data[x + 1][y] == this._data[x][y]) {
                if (this._arrBlock[x + 1][y].getComponent("BlockController")._canCombine) {
                    let block = this._arrBlock[x][y];
                    let position = this._posisions[x + 1][y];
                    this._data[x + 1][y] *= 2;
                    this._data[x][y] = 0;
                    this._arrBlock[x][y] = null
                    this.moveBlock(block, position, () => {
                        this.combineBlock(block, this._arrBlock[x + 1][y], this._data[x + 1][y], () => {
                            callback && callback();
                        })
                    });
                    hasMoved = true;
                }
                else callback && callback()
            } else {
                callback && callback();
                return;
            }
        }
        let toMove = [];
        for (let i = ROWS - 1; i >= 0; i--) {
            for (let j = 0; j < ROWS; j++) {
                if (this._data[i][j] != 0) {
                    toMove.push({
                        x: i,
                        y: j,
                    });
                }
            }
        }
        let count = 0;
        for (let i = 0; i < toMove.length; i++) {
            move(toMove[i].x, toMove[i].y, () => {
                count++;
                if (count == toMove.length) {
                    this.afterMove(hasMoved);
                }
            })
        }
    },

    blockMoveUp() {
        let hasMoved = false;
        this.activeCombine()
        let move = (x, y, callback) => {
            if (x == 0 || this._data[x][y] == 0) {
                callback && callback();
                return;
            } else if (this._data[x - 1][y] == 0) {
                let block = this._arrBlock[x][y];
                let position = this._posisions[x - 1][y];
                this._arrBlock[x - 1][y] = block;
                this._data[x - 1][y] = this._data[x][y];
                this._data[x][y] = 0;
                this._arrBlock[x][y] = null;
                this.moveBlock(block, position, () => {
                    move(x - 1, y, callback);
                });
                hasMoved = true;
            } else if (this._data[x - 1][y] == this._data[x][y]) {
                if (this._arrBlock[x - 1][y].getComponent("BlockController")._canCombine) {
                    let block = this._arrBlock[x][y];
                    let position = this._posisions[x - 1][y];
                    this._data[x - 1][y] *= 2;
                    this._data[x][y] = 0;
                    this._arrBlock[x][y] = null
                    this.moveBlock(block, position, () => {
                        this.combineBlock(block, this._arrBlock[x - 1][y], this._data[x - 1][y], () => {
                            callback && callback();
                        })
                    });
                    hasMoved = true;
                }
                else callback && callback()
            } else {
                callback && callback();
                return;
            }
        }
        let toMove = [];
        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < ROWS; j++) {
                if (this._data[i][j] != 0) {
                    toMove.push({
                        x: i,
                        y: j,
                    });
                }
            }
        }
        let count = 0;
        for (let i = 0; i < toMove.length; i++) {
            move(toMove[i].x, toMove[i].y, () => {
                count++;
                if (count == toMove.length) {
                    this.afterMove(hasMoved);
                }
            })
        }
    },

    gameOver() {
        cc.tween(this.node)
            .to(.5, { opacity: 150 })
            .start()
        this.loseLayOut.active = true;
        this.newGameBtn.getComponent(cc.Button).interactable = false;
    },

    gameWin() {
        this._canMove = false;
        cc.tween(this.node)
            .to(.5, { opacity: 150 })
            .start()
        this.winLayOut.active = true;
        this.newGameBtn.getComponent(cc.Button).interactable = false;
    },

    onRestartClick() {
        for (let i = 0; i < this.bgBox.children.length; i++) {
            if (this.bgBox.children[i] !== null) {
                this.bgBox.children[i].destroy()
            }
        }
        this._canMove = true;
        this._canWin = true;
        this.blockInit();
        this.init();
        this.node.opacity = 255;
        this.loseLayOut.active = false
        this.winLayOut.active = false
        this.newGameBtn.getComponent(cc.Button).interactable = true;
    },

    onContinueClick() {
        this._canMove = true;
        this.node.opacity = 255;
        this.winLayOut.active = false
        this.newGameBtn.getComponent(cc.Button).interactable = true;
    },

    getScoreStorge() {
        let scoreStorge = cc.sys.localStorage.getItem('bestScore');
        if (scoreStorge !== null) {
            this.bestScoreLabel.string = JSON.parse(scoreStorge);
        } else {
            this.bestScoreLabel.string = 0;
        }
    },

    checkScore() {
        let newScore = parseInt(this.scoreLabel.string);
        if (newScore > this.bestScoreLabel.string) {
            cc.sys.localStorage.setItem('bestScore', JSON.stringify(newScore));
            this.bestScoreLabel.string = newScore;
        }
    },
});
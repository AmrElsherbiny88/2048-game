var gameObj = {
    points: {
        score: 0,
        history: [],
        status: 1
    },
    stage: [],
    initStage: function () {
        for (var cell = 0; cell < 4; cell++) {
            this.stage[cell] = [];
            for (var row = 0; row < 4; row++) {
                this.stage[cell][row] = {
                    boxObj: null,
                    position: [cell, row]
                };
            }
        }
    },

    empty: function () {
        var emptyList = [];
        for (var row = 0; row < 4; row++) {
            for (var cell = 0; cell < 4; cell++) {
                if (this.stage[cell][row].boxObj == null) {
                    emptyList.push(this.stage[cell][row]);
                }
            }
        }
        return emptyList;
    },

    newBox: function () {
        var _this = this;

        var box = function (obj) {
            var num = Math.random() > 0.9 ? 4 : 2;
            this.value = num;
            this.parent = obj;
            this.domObj = (function () {
                var domBox = document.createElement('span');
                domBox.innerText = num;
                domBox.textContent = num;
                domBox.className = 'row' + obj.position[0] + ' ' + 'cell' + obj.position[1] + ' ' + 'num' + num;
                var root = document.getElementById('stage');
                root.appendChild(domBox);
                return domBox;
            })();
            obj.boxObj = this;
        };

        var emptyList = this.empty();
        if (emptyList.length) {
            var randomIndex = Math.floor(Math.random() * emptyList.length);
            new box(emptyList[randomIndex]);
            return true;
        }
    },

    isEnd: function () {
        var emptyList = this.empty();
        if (!emptyList.length) {
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 4; j++) {
                    var obj = this.stage[i][j];
                    var objLeft = (j == 0) ? { boxObj: { value: 0 } } : this.stage[i][j - 1];
                    var objRight = (j == 3) ? { boxObj: { value: 0 } } : this.stage[i][j + 1];
                    var objUp = (i == 0) ? { boxObj: { value: 0 } } : this.stage[i - 1][j];
                    var objDown = (i == 3) ? { boxObj: { value: 0 } } : this.stage[i + 1][j];
                    if (obj.boxObj.value == objLeft.boxObj.value ||
                        obj.boxObj.value == objDown.boxObj.value ||
                        obj.boxObj.value == objRight.boxObj.value ||
                        obj.boxObj.value == objUp.boxObj.value) {
                        return false;
                    }
                }
            }
            return true;
        }
        return false;
    },

    gameOver: function () {
        alert('GAME OVER!');
    },

    moveTo: function (obj1, obj2) {
        obj2.boxObj = obj1.boxObj;
        obj2.boxObj.domObj.className = 'row' + obj2.position[0] + ' ' + 'cell' + obj2.position[1] + ' ' + 'num' + obj2.boxObj.value;
        obj1.boxObj = null;
    },

    addTo: function (obj1, obj2) {
        obj2.boxObj.domObj.parentNode.removeChild(obj2.boxObj.domObj);
        obj2.boxObj = obj1.boxObj;
        obj1.boxObj = null;
        obj2.boxObj.value = obj2.boxObj.value * 2;
        obj2.boxObj.domObj.className = 'row' + obj2.position[0] + ' ' + 'cell' + obj2.position[1] + ' ' + 'num' + obj2.boxObj.value;
        obj2.boxObj.domObj.innerText = obj2.boxObj.value;
        obj2.boxObj.domObj.textContent = obj2.boxObj.value;
        this.points.score += obj2.boxObj.value;

        var scoreBar = document.getElementById('score');
        scoreBar.innerText = this.points.score;
        scoreBar.textContent = this.points.score;
        return obj2.boxObj.value;
    },

    clear: function (x, y) {
        var can = 0;
        for (var i = 0; i < 4; i++) {
            var fst = null;
            var fstEmpty = null;
            for (var j = 0; j < 4; j++) {
                var objInThisWay = null;
                switch ("" + x + y) {
                    case '00':
                        objInThisWay = this.stage[i][j];
                        break;
                    case '10':
                        objInThisWay = this.stage[j][i];
                        break;
                    case '11':
                        objInThisWay = this.stage[3 - j][i];
                        break;
                    case '01':
                        objInThisWay = this.stage[i][3 - j];
                        break;
                }
                if (objInThisWay.boxObj != null) {
                    if (fstEmpty) {
                        this.moveTo(objInThisWay, fstEmpty);
                        fstEmpty = null;
                        j = 0;
                        can = 1;
                    }
                } else if (!fstEmpty) {
                    fstEmpty = objInThisWay;
                }
            }
        }
        return can;
    },

    move: function (x, y) {
        var can = 0;
        can = this.clear(x, y) ? 1 : 0;
        var add = 0;
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 3; j++) {
                var objInThisWay = null;
                var objInThisWay2 = null;
                switch ("" + x + y) {
                    case '00':
                        {
                            objInThisWay = this.stage[i][j];
                            objInThisWay2 = this.stage[i][j + 1];
                            break;
                        }
                    case '10':
                        {
                            objInThisWay = this.stage[j][i];
                            objInThisWay2 = this.stage[j + 1][i];
                            break;
                        }

                    case '11':
                        {
                            objInThisWay = this.stage[3 - j][i];
                            objInThisWay2 = this.stage[2 - j][i];
                            break;
                        }
                    case '01':
                        {
                            objInThisWay = this.stage[i][3 - j];
                            objInThisWay2 = this.stage[i][2 - j];
                            break;
                        }
                }
                if (objInThisWay2.boxObj && objInThisWay.boxObj.value == objInThisWay2.boxObj.value) {
                    add += this.addTo(objInThisWay2, objInThisWay);
                    this.clear(x, y);
                    can = 1;
                }
            }
        }
        if (add) {
            var addscore = document.getElementById('addScore');
            addscore.innerText = "+" + add;
            addscore.textContent = "+" + add;
            addscore.className = "show";
            setTimeout(function () {
                addscore.className = "hide";
            }, 500);
        }
        if (can) {
            this.newBox();
        }
        if (this.isEnd()) {
            this.gameOver();
        }
    }
};

var controller = function () {
    var touchStartX = 0;
    var touchStartY = 0;
    var touchMoveThreshold = 50;
    var ready = false;

    function start(x, y) {
        ready = true;
        touchStartX = x;
        touchStartY = y;
    }

    function move(x, y) {
        if (ready) {
            var deltaX = x - touchStartX;
            var deltaY = y - touchStartY;

            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // Horizontal swipe
                if (deltaX > touchMoveThreshold) {
                    gameObj.move(0, 1);
                    ready = false;
                } else if (deltaX < -touchMoveThreshold) {
                    gameObj.move(0, 0);
                    ready = false;
                }
            } else {
                // Vertical swipe
                if (deltaY > touchMoveThreshold) {
                    gameObj.move(1, 1);
                    ready = false;
                } else if (deltaY < -touchMoveThreshold) {
                    gameObj.move(1, 0);
                    ready = false;
                }
            }
        }
    }

    function end() {
        ready = false;
    }

    return {
        start: start,
        move: move,
        end: end
    };
}();

function handleTouchStart(event) {
    var touch = event.touches[0];
    controller.start(touch.clientX, touch.clientY);
}

function handleTouchMove(event) {
    var touch = event.touches[0];
    controller.move(touch.clientX, touch.clientY);
}

function handleTouchEnd() {
    controller.end();
}

window.onload = function () {
    gameObj.initStage();
    gameObj.newBox();

    var stage = document.getElementById('stage');

    // Touch event handlers
    stage.addEventListener('touchstart', handleTouchStart);
    stage.addEventListener('touchmove', handleTouchMove);
    stage.addEventListener('touchend', handleTouchEnd);

    // Disable text selection
    stage.style.userSelect = 'none';
    stage.style.webkitUserSelect = 'none';
    stage.style.MozUserSelect = 'none';
};

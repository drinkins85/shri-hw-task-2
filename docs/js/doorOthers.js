// ===================== Пример кода первой двери =======================
/**
 * @class Door0
 * @augments DoorBase
 * @param {Number} number
 * @param {Function} onUnlock
 */
function Door0(number, onUnlock) {
    DoorBase.apply(this, arguments);

    var buttons = [
        this.popup.querySelector('.door-riddle__button_0'),
        this.popup.querySelector('.door-riddle__button_1'),
        this.popup.querySelector('.door-riddle__button_2')
    ];

    buttons.forEach(function(b) {
        b.addEventListener('pointerdown', _onButtonPointerDown.bind(this));
        b.addEventListener('pointerup', _onButtonPointerUp.bind(this));
        b.addEventListener('pointercancel', _onButtonPointerUp.bind(this));
        b.addEventListener('pointerleave', _onButtonPointerUp.bind(this));
    }.bind(this));

    function _onButtonPointerDown(e) {
        e.target.classList.add('door-riddle__button_pressed');
        checkCondition.apply(this);
    }

    function _onButtonPointerUp(e) {
        e.target.classList.remove('door-riddle__button_pressed');
    }

    /**
     * Проверяем, можно ли теперь открыть дверь
     */
    function checkCondition() {
        var isOpened = true;
        buttons.forEach(function(b) {
            if (!b.classList.contains('door-riddle__button_pressed')) {
                isOpened = false;
            }
        });

        // Если все три кнопки зажаты одновременно, то откроем эту дверь
        if (isOpened) {
            this.unlock();
        }
    }
}

// Наследуемся от класса DoorBase
Door0.prototype = Object.create(DoorBase.prototype);
Door0.prototype.constructor = DoorBase;
// END ===================== Пример кода первой двери =======================

/**
 * @class Door1
 * @augments DoorBase
 * @param {Number} number
 * @param {Function} onUnlock
 */
function Door1(number, onUnlock) {
    DoorBase.apply(this, arguments);

    // ==== Напишите свой код для открытия второй двери здесь ====

    var locker = this.popup.querySelector('.door-riddle__bolt-locker'),
        lockerStartPosition = 0,
        lockerCurrentPosition = 0,
        lockerIsGestureStarted = false,
        bolt = this.popup.querySelector('.door-riddle__bolt'),
        boltStartPosition = 0,
        boltCurrentPosition = 0,
        boltIsGestureStarted = false;


    locker.addEventListener('pointerdown', _onLockerPointerDown);
    locker.addEventListener('pointermove', _onLockerPointerMove);
    locker.addEventListener('pointerup', _onLockerPointerUp);
    locker.addEventListener('pointercancel', _onLockerPointerUp);
    locker.addEventListener('pointerleave', _onLockerPointerUp);

    bolt.addEventListener('pointerdown', _onBoltPointerDown);
    bolt.addEventListener('pointermove', _onBoltPointerMove.bind(this));
    bolt.addEventListener('pointerup', _onBoltPointerUp);
    bolt.addEventListener('pointercancel', _onBoltPointerUp);
    bolt.addEventListener('pointerleave', _onBoltPointerUp);


    function _onLockerPointerDown(e) {
        e.target.classList.add('door-riddle__bolt-locker_pressed');
        e.target.classList.remove('door-riddle__bolt-locker_falled');
        lockerStartPosition = lockerCurrentPosition = e.pageY;
        lockerIsGestureStarted = true;
    }

    function _onLockerPointerMove(e) {
        if (!lockerIsGestureStarted) {
            return;
        }
        lockerCurrentPosition = e.pageY;
        updatePosition(e.target, {
            prevY: lockerStartPosition,
            currentY: lockerCurrentPosition
        });
        if (Math.abs(lockerStartPosition - lockerCurrentPosition) > 100){
            e.target.classList.add('door-riddle__bolt-locker_resolved');
            bolt.classList.remove('door-riddle__bolt_locked');
        }
    }

    function _onLockerPointerUp(e) {
        e.target.classList.remove('door-riddle__bolt-locker_pressed');
        e.target.classList.add('door-riddle__bolt-locker_falled');
        e.target.classList.remove('door-riddle__bolt-locker_resolved');
        bolt.classList.add('door-riddle__bolt_locked');
        requestAnimationFrame(function() {
            e.target.style.transform = '';
        });
    }

    function _onBoltPointerDown(e) {
        e.target.classList.add('door-riddle__bolt-locker_pressed');
        e.target.classList.remove('door-riddle__bolt-locker_falled');
        boltCurrentPosition = boltStartPosition = e.pageX;
        boltIsGestureStarted = true;
    }

    function _onBoltPointerMove(e) {
        if (!boltIsGestureStarted) {
            return;
        }
        boltCurrentPosition = e.pageX;
        updatePosition(e.target, {
            prevX: boltStartPosition,
            currentX: boltCurrentPosition
        });
        if (Math.abs(boltStartPosition - boltCurrentPosition) > 100){
            this.unlock();
        }
    }

    function _onBoltPointerUp(e) {
        e.target.classList.add('door-riddle__bolt_locked');
    }

    // ==== END Напишите свой код для открытия второй двери здесь ====
}
Door1.prototype = Object.create(DoorBase.prototype);
Door1.prototype.constructor = DoorBase;

/**
 * @class Door2
 * @augments DoorBase
 * @param {Number} number
 * @param {Function} onUnlock
 */
function Door2(number, onUnlock) {
    DoorBase.apply(this, arguments);

    // ==== Напишите свой код для открытия третей двери здесь ====

    var pinch = document.querySelector('.door-riddle__pinch'),
        unlockButton = this.popup.querySelector('.door-riddle__pinch-unlocker'),
        sideLeft = pinch.querySelector('.side-left'),
        sideRight = pinch.querySelector('.side-right'),
        evStack = [],
        prevDiff = -1;

    pinch.addEventListener('pointerdown', _onPinchPointerDown);
    pinch.addEventListener('pointermove', _onPinchPointerMove.bind(this));
    pinch.addEventListener('pointerup', _onPinchPointerUp);
    pinch.addEventListener('pointercancel', _onPinchPointerUp);
    pinch.addEventListener('pointerleave', _onPinchPointerUp);

    unlockButton.addEventListener('pointerdown', _onUnlockButtonPointerDown);
    unlockButton.addEventListener('pointerup', _onUnlockButtonPointerUp);
    unlockButton.addEventListener('pointercancel', _onUnlockButtonPointerUp);
    unlockButton.addEventListener('pointerleave', _onUnlockButtonPointerUp);


    function _onPinchPointerDown(e) {
        evStack.push(e);
    }

    function _onPinchPointerMove(e) {
        for (var i = 0; i < evStack.length; i++) {
            if (e.pointerId === evStack[i].pointerId) {
                evStack[i] = e;
                break;
            }
        }

        if (evStack.length === 2) {
            var curDiff = Math.abs(evStack[0].clientX - evStack[1].clientX);
            sideLeft.style.transform = 'translateX(' + curDiff/2*-1 + 'px)';
            sideRight.style.transform = 'translateX(' + curDiff/2 + 'px)';

            if (prevDiff > 0) {
                if (curDiff > prevDiff && curDiff > 200) {
                    this.unlock();
                }
            }
            prevDiff = curDiff;
        }

    }

    function _onPinchPointerUp(e) {
        removeEvent(e);
        e.target.style.background = "black";
        sideLeft.style.transform = '';
        sideRight.style.transform = '';

        if (evStack.length < 2) {
            prevDiff = -1;
        }
    }

    function removeEvent(e) {
        for (var i = 0; i < evStack.length; i++) {
            if (evStack[i].pointerId === e.pointerId) {
                evStack.splice(i, 1);
                break;
            }
        }
    }

    function  _onUnlockButtonPointerDown(e) {
        e.preventDefault();
        e.target.classList.add('door-riddle__button_pressed');
        pinch.classList.remove('door-riddle__pinch_locked');
    }

    function _onUnlockButtonPointerUp(e) {
        e.target.classList.remove('door-riddle__button_pressed');
        pinch.classList.add('door-riddle__pinch_locked');
    }


    // ==== END Напишите свой код для открытия третей двери здесь ====
}
Door2.prototype = Object.create(DoorBase.prototype);
Door2.prototype.constructor = DoorBase;

/**
 * Сундук
 * @class Box
 * @augments DoorBase
 * @param {Number} number
 * @param {Function} onUnlock
 */
function Box(number, onUnlock) {
    DoorBase.apply(this, arguments);

    // ==== Напишите свой код для открытия сундука здесь ====

    var unlockButton = this.popup.querySelector('.door-riddle__button_gear-unlocker'),
        gear = this.popup.querySelector('.gear'),
        isGearUnlocked = false,
        isRotationStarted = false,
        gearStartX = 0,
        gearStartY = 0,
        angle  = 0;


    unlockButton.addEventListener('pointerdown', _onUnlockButtonPointerDown);
    unlockButton.addEventListener('pointerup', _onUnlockButtonPointerUp);
    unlockButton.addEventListener('pointercancel', _onUnlockButtonPointerUp);
    unlockButton.addEventListener('pointerleave', _onUnlockButtonPointerUp);

    gear.addEventListener('pointerdown', _onGearPointerDown);
    gear.addEventListener('pointermove', _onGearPointerMove.bind(this));
    gear.addEventListener('pointerup', _onGearPointerUp);
    gear.addEventListener('pointercancel', _onGearPointerUp);
    gear.addEventListener('pointerleave', _onGearPointerUp);


    function _onUnlockButtonPointerDown(e) {
        e.preventDefault();
        e.target.classList.add('door-riddle__button_pressed');
        isGearUnlocked = true;
    }

    function _onUnlockButtonPointerUp(e) {
        e.target.classList.remove('door-riddle__button_pressed');
        isGearUnlocked = false;
    }

    
    function _onGearPointerDown(e) {
        if (!isGearUnlocked){
            return
        }
        isRotationStarted = true;
        gearStartX = e.clientX;
        gearStartY = e.clientY;

    }
    
    function _onGearPointerMove(e) {
        if (!isRotationStarted) {
            return;
        }

        if (e.clientY < document.documentElement.clientHeight/2){

            if (e.clientX > gearStartX){
                angle += 2;
            } else {
                angle -= 2;
            }

        } else {
            if (e.clientX < gearStartX){
                angle += 2;
            } else {
                angle -= 2;
            }
        }

        if (e.clientX > document.documentElement.clientWidth/2){

            if (e.clientY > gearStartY){
                angle += 2;
            } else {
                angle -= 2;
            }

        } else {
            if (e.clientY < gearStartY){
                angle += 2;
            } else {
                angle -= 2;
            }
        }

        requestAnimationFrame(function() {
            e.target.style.transform = 'rotate(' + angle + 'deg)';
        });
        if (Math.abs(angle) > 300){
            this.unlock();
        }

        gearStartX = e.clientX;
        gearStartY = e.clientY;

    }
    
    function _onGearPointerUp() {
        isRotationStarted = false;
    }

    // ==== END Напишите свой код для открытия сундука здесь ====

    this.showCongratulations = function() {
        alert('Поздравляю! Игра пройдена!');
    };
}

function updatePosition(elem, params) {
    requestAnimationFrame(function() {
        if (params.prevX !== undefined && params.currentX !== undefined){
            var diffX = params.currentX - params.prevX;
            elem.style.transform = 'translateX(' + diffX + 'px)';
        }
        if (params.prevY !== undefined && params.currentY !== undefined){
            var diffY = params.currentY - params.prevY;
            elem.style.transform = 'translateY(' + diffY + 'px)';
        }
    });
}

Box.prototype = Object.create(DoorBase.prototype);
Box.prototype.constructor = DoorBase;

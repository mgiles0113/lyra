class Timer {
    constructor(seconds) {
        this.timeUp = 0;
        this.startingTime = seconds;
        this.timeRemaining = seconds;
        this.barPercentage = 100;
        this.color = {
            r : 0,
            g : 255,
            b : 0
        }
        this.minutesCard = $("#timer-minutes");
        this.secondsCard = $("#timer-seconds");
        this.timerBar = $("#timer-bar");
        this.calculateMetrics();
    }
    
    initialize() {
        this.minutesCard.html(this.twoDigit(this.minutes));
        this.secondsCard.html(this.twoDigit(this.seconds));
        this.run();
    }
    
    run() {
        var self = this;
        this.loopInterval = setInterval(function() {
            self.update();
        }, 1000);
    }
    
    update() {
        this.timeRemaining--;
        this.calculateMetrics();
        this.minutesCard.html(this.twoDigit(this.minutes));
        this.secondsCard.html(this.seconds >= 0 ? this.twoDigit(this.seconds) : '00');
        this.updateBar();
        if (this.timeRemaining === -1) {
            this.terminate();
        }
    }

    getColor() {
        this.color.g = Math.floor((255 * this.barPercentage) / 100);
        this.color.r = Math.floor(255 - (255 * this.barPercentage / 100));
        var color = 'rgb(' + this.color.r + ',' + this.color.g + ',0)';
        return color;
    }
    
    updateBar() {
        this.barPercentage = this.timeRemaining / this.startingTime * 100 * .9;
        this.timerBar.css('backgroundColor', this.getColor());
        this.timerBar.css('width', this.barPercentage.toFixed(2) + '%');
    }
    
    calculateMetrics() {
        this.seconds = this.timeRemaining % 60;
        this.minutes = (this.timeRemaining - this.seconds) / 60;
    }

    pause() {
        clearInterval(this.loopInterval);
    }

    terminate() {
        this.timeUp = 1;
        clearInterval(this.loopInterval);
    }
    
    twoDigit(number) {
        if (number < 10) {
            return '0' + number;
        } else {
            return number;
        }
    }
}
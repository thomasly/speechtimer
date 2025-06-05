class SpeechTimer {
    constructor() {
        this.totalSeconds = 0;
        this.remainingSeconds = 0;
        this.isRunning = false;
        this.timerId = null;
        this.warningTime = 0;
        this.dangerTime = 0;
        this.isFullscreen = false;
        this.soundEnabled = false;

        // DOM 元素
        this.timerDisplay = document.getElementById('timerDisplay');
        this.fullscreenTimerDisplay = document.getElementById('fullscreenTimerDisplay');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.maximizeBtn = document.getElementById('maximizeBtn');
        this.exitFullscreenBtn = document.getElementById('exitFullscreenBtn');
        this.fullscreenTimer = document.getElementById('fullscreenTimer');
        this.soundEnabledInput = document.getElementById('soundEnabled');

        // 时间输入元素
        this.totalHoursInput = document.getElementById('totalHours');
        this.totalMinutesInput = document.getElementById('totalMinutes');
        this.totalSecondsInput = document.getElementById('totalSeconds');
        this.warningHoursInput = document.getElementById('warningHours');
        this.warningMinutesInput = document.getElementById('warningMinutes');
        this.warningSecondsInput = document.getElementById('warningSeconds');
        this.dangerHoursInput = document.getElementById('dangerHours');
        this.dangerMinutesInput = document.getElementById('dangerMinutes');
        this.dangerSecondsInput = document.getElementById('dangerSeconds');

        // 绑定事件处理器
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.maximizeBtn.addEventListener('click', () => this.toggleFullscreen());
        this.exitFullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        this.soundEnabledInput.addEventListener('change', () => this.toggleSound());

        // 绑定时间输入事件
        [this.totalHoursInput, this.totalMinutesInput, this.totalSecondsInput].forEach(input => {
            input.addEventListener('change', () => this.updateTotalTime());
        });
        [this.warningHoursInput, this.warningMinutesInput, this.warningSecondsInput].forEach(input => {
            input.addEventListener('change', () => this.updateWarningTime());
        });
        [this.dangerHoursInput, this.dangerMinutesInput, this.dangerSecondsInput].forEach(input => {
            input.addEventListener('change', () => this.updateDangerTime());
        });

        // 初始化
        this.updateTotalTime();
        this.updateWarningTime();
        this.updateDangerTime();
        this.updateDisplay();
    }

    toggleSound() {
        this.soundEnabled = this.soundEnabledInput.checked;
    }

    updateTotalTime() {
        const hours = parseInt(this.totalHoursInput.value) || 0;
        const minutes = parseInt(this.totalMinutesInput.value) || 0;
        const seconds = parseInt(this.totalSecondsInput.value) || 0;
        
        this.totalSeconds = hours * 3600 + minutes * 60 + seconds;
        this.remainingSeconds = this.totalSeconds;
        this.updateDisplay();
    }

    updateWarningTime() {
        const hours = parseInt(this.warningHoursInput.value) || 0;
        const minutes = parseInt(this.warningMinutesInput.value) || 0;
        const seconds = parseInt(this.warningSecondsInput.value) || 0;
        
        this.warningTime = hours * 3600 + minutes * 60 + seconds;
        this.checkTimeStatus();
    }

    updateDangerTime() {
        const hours = parseInt(this.dangerHoursInput.value) || 0;
        const minutes = parseInt(this.dangerMinutesInput.value) || 0;
        const seconds = parseInt(this.dangerSecondsInput.value) || 0;
        
        this.dangerTime = hours * 3600 + minutes * 60 + seconds;
        this.checkTimeStatus();
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.startBtn.disabled = true;
            this.pauseBtn.disabled = false;
            this.timerId = setInterval(() => {
                this.remainingSeconds--;
                this.updateDisplay();
                this.checkTimeStatus();
                
                if (this.remainingSeconds <= 0) {
                    this.pause();
                    if (this.soundEnabled) {
                        this.playEndSound();
                    }
                }
            }, 1000);
        }
    }

    pause() {
        if (this.isRunning) {
            this.isRunning = false;
            this.startBtn.disabled = false;
            this.pauseBtn.disabled = true;
            clearInterval(this.timerId);
        }
    }

    reset() {
        this.pause();
        this.remainingSeconds = this.totalSeconds;
        this.updateDisplay();
        this.checkTimeStatus();
    }

    updateDisplay() {
        const hours = Math.floor(this.remainingSeconds / 3600);
        const minutes = Math.floor((this.remainingSeconds % 3600) / 60);
        const seconds = this.remainingSeconds % 60;
        
        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        this.timerDisplay.textContent = timeString;
        this.fullscreenTimerDisplay.textContent = timeString;
    }

    checkTimeStatus() {
        const displays = [this.timerDisplay, this.fullscreenTimerDisplay];
        displays.forEach(display => {
            display.classList.remove('normal', 'warning', 'danger');
        });
        
        this.fullscreenTimer.classList.remove('normal', 'warning', 'danger');
        
        let status;
        if (this.remainingSeconds <= this.dangerTime) {
            status = 'danger';
        } else if (this.remainingSeconds <= this.warningTime) {
            status = 'warning';
        } else {
            status = 'normal';
        }
        
        displays.forEach(display => {
            display.classList.add(status);
        });
        this.fullscreenTimer.classList.add(status);
    }

    toggleFullscreen() {
        this.isFullscreen = !this.isFullscreen;
        if (this.isFullscreen) {
            this.fullscreenTimer.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        } else {
            this.fullscreenTimer.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }

    playEndSound() {
        // 创建音频上下文
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
    }
}

// 初始化计时器
document.addEventListener('DOMContentLoaded', () => {
    new SpeechTimer();
}); 
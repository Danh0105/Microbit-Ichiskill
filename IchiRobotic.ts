//% color="#0345fc" weight=10 icon="\uf19d"
namespace IchiRobotic {
    //% color="#fc0303"
    //% blockId=1 block="Động cơ |%index|di chuyển với tốc độ %speed"
    //% speed.min=-255 speed.max=255
    export function MotorRun(index: IchiLib.Motors, speed: number): void {
        if (!IchiLib.initialized) {
            IchiLib.initPCA9685()
        }
        speed = speed * 16; // map 255 to 4096
        if (speed >= 4096) {
            speed = 4095
        }
        if (speed <= -4096) {
            speed = -4095
        }
        if (index > 4 || index <= 0)
            return
        let pp = (index - 1) * 2
        let pn = (index - 1) * 2 + 1
        if (speed >= 0) {
            IchiLib.setPwm(pp, 0, speed)
            IchiLib.setPwm(pn, 0, 0)
        } else {
            IchiLib.setPwm(pp, 0, 0)
            IchiLib.setPwm(pn, 0, -speed)
        }
    }
    //% color="#fc0303"
    //% blockId=2 block="Động cơ|%index|di chuyển với tốc độ %speed|trong %delay|s"
    //% speed.min=-255 speed.max=255
    export function MotorRunDelay(index: IchiLib.Motors, speed: number, delay: number): void {
        MotorRun(index, speed);
        basic.pause(delay * 1000);
    }
   
    //% color="#fc0303"
    //% blockId=robot_run block="Di chuyển về |%index| với tốc độ %speed|trong %delay|s"
    //% speed.min=-255 speed.max=255
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=4
    export function RobotRun(index: IchiLib.Move, speed: number, delay: number): void {
        if (index == 1) {
            IchiLib.MotorRunDual(
                IchiLib.Motors.Trái,
                speed,
                IchiLib.Motors.Phải,
                speed
            );
        } else if (index == 2) {
            IchiLib.MotorRunDual(
                IchiLib.Motors.Trái,
                -speed,
                IchiLib.Motors.Phải,
                speed
            );
        } else if (index == 3) {
            IchiLib.MotorRunDual(
                IchiLib.Motors.Trái,
                speed,
                IchiLib.Motors.Phải,
                0
            );
        } else {
            IchiLib.MotorRunDual(
                IchiLib.Motors.Trái,
                0,
                IchiLib.Motors.Phải,
                speed
            );
        }
        basic.pause(delay * 1000);
        IchiLib.MotorRunDual(
            IchiLib.Motors.Trái,
            0,
            IchiLib.Motors.Phải,
            0
        );
    }
    export class Servo {
        private _minAngle: number;
        private _maxAngle: number;
        private _stopOnNeutral: boolean;
        private _angle: number;

        constructor() {
            this._angle = undefined;
            this._minAngle = 0;
            this._maxAngle = 180;
            this._stopOnNeutral = false;
        }

        private clampDegrees(degrees: number): number {
            degrees = degrees | 0;
            degrees = Math.clamp(this._minAngle, this._maxAngle, degrees);
            return degrees;
        }


        setAngle(degrees: number) {
            degrees = this.clampDegrees(degrees);
            this.internalSetContinuous(false);
            this._angle = this.internalSetAngle(degrees);
        }

        get angle() {
            return this._angle || 90;
        }

        protected internalSetContinuous(continuous: boolean): void {

        }

        protected internalSetAngle(angle: number): number {
            return 0;
        }


        run(speed: number): void {
            const degrees = this.clampDegrees(Math.map(speed, -100, 100, this._minAngle, this._maxAngle));
            const neutral = (this.maxAngle - this.minAngle) >> 1;
            this.internalSetContinuous(true);
            if (this._stopOnNeutral && degrees == neutral)
                this.stop();
            else
                this._angle = this.internalSetAngle(degrees);
        }




        setPulse(micros: number) {
            micros = micros | 0;
            micros = Math.clamp(500, 2500, micros);
            this.internalSetPulse(micros);
        }

        protected internalSetPulse(micros: number): void {

        }


        stop() {
            if (this._angle !== undefined)
                this.internalStop();
        }

        /**
         * Gets the minimum angle for the servo
         */
        public get minAngle() {
            return this._minAngle;
        }

        /**
         * Gets the maximum angle for the servo
         */
        public get maxAngle() {
            return this._maxAngle;
        }


        public setRange(minAngle: number, maxAngle: number) {
            this._minAngle = Math.max(0, Math.min(90, minAngle | 0));
            this._maxAngle = Math.max(90, Math.min(180, maxAngle | 0));
        }


        public setStopOnNeutral(enabled: boolean) {
            this._stopOnNeutral = enabled;
        }

        protected internalStop() { }
    }

    export class PinServo extends Servo {
        private _pin: PwmOnlyPin;

        constructor(pin: PwmOnlyPin) {
            super();
            this._pin = pin;
        }

        protected internalSetAngle(angle: number): number {
            this._pin.servoWrite(angle);
            return angle;
        }

        protected internalSetContinuous(continuous: boolean): void {
            this._pin.servoSetContinuous(continuous);
        }

        protected internalSetPulse(micros: number): void {
            this._pin.servoSetPulse(micros);
        }

        protected internalStop() {
            this._pin.digitalRead();
            this._pin.setPull(PinPullMode.PullNone);
        }
    }
}
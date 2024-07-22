//% color="#0345fc" weight=10 icon="\uf19d"
//% groups="['Move', 'Servo']"
namespace IchiRobotic {
    // Điều chỉnh mã cho các hàm điều khiển động cơ
    //% block
    //% group="Move"
    //% color="#fc0303"
    //% blockId=1 block="Động cơ |%index| di chuyển với tốc độ %speed"
    //% speed.min=-255 speed.max=255
    export function MotorRun(index: IchiLib.Motors, speed: number): void {
        if (!IchiLib.initialized) {
            IchiLib.initPCA9685();
        }
        speed = speed * 16; // map 255 to 4096
        if (speed >= 4096) {
            speed = 4095;
        }
        if (speed <= -4096) {
            speed = -4095;
        }
        if (index > 4 || index <= 0) return;

        let pp = (index - 1) * 2;
        let pn = (index - 1) * 2 + 1;

        if (speed >= 0) {
            IchiLib.setPwm(pp, 0, speed);
            IchiLib.setPwm(pn, 0, 0);
        } else {
            IchiLib.setPwm(pp, 0, 0);
            IchiLib.setPwm(pn, 0, -speed);
        }
    }

    // Điều chỉnh mã cho hàm điều khiển động cơ với độ trễ
        //% block
    //% group="Move"
    //% color="#fc0303"
    //% blockId=2 block="Động cơ |%index| di chuyển với tốc độ %speed trong %delay|s"
    //% speed.min=-255 speed.max=255
    export function MotorRunDelay(index: IchiLib.Motors, speed: number, delay: number): void {
        MotorRun(index, speed);
        basic.pause(delay * 1000);
    }

    // Điều chỉnh mã cho hàm điều khiển robot di chuyển
        //% block
    //% group="Move"
    //% color="#fc0303"
    //% blockId=robot_run block="Di chuyển về |%index| với tốc độ %speed trong %delay|s"
    //% speed.min=-255 speed.max=255
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=4
    export function RobotRun(index: IchiLib.Move, speed: number, delay: number): void {
        switch (index) {
            case 1:
                IchiLib.MotorRunDual(IchiLib.Motors.Trái, speed, IchiLib.Motors.Phải, speed);
                break;
            case 2:
                IchiLib.MotorRunDual(IchiLib.Motors.Trái, -speed, IchiLib.Motors.Phải, speed);
                break;
            case 3:
                IchiLib.MotorRunDual(IchiLib.Motors.Trái, speed, IchiLib.Motors.Phải, 0);
                break;
            default:
                IchiLib.MotorRunDual(IchiLib.Motors.Trái, 0, IchiLib.Motors.Phải, speed);
                break;
        }
        basic.pause(delay * 1000);
        IchiLib.MotorRunDual(IchiLib.Motors.Trái, 0, IchiLib.Motors.Phải, 0);
    }

    // Điều chỉnh mã cho hàm thiết lập góc servo
     //% block
    //% group="Servo"
    //% color="#fc0303"
    //% weight=100 help=servos/set-angle
    //% blockId=servoservosetangle block="set %servo angle to %degrees=protractorPicker °"
    //% degrees.defl=90
    //% servo.fieldEditor="gridpicker"
    //% fixedInstances
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

        /**
         * Set the servo angle
         */
         //% block
    //% group="Servo"
        //% color="#fc0303"
        //% weight=100 help=servos/set-angle
        //% blockId=servoservosetangle block="Thiết lập góc động cơ servo %servo thành %degrees=protractorPicker °"
        //% degrees.defl=90
        //% servo.fieldEditor="gridpicker"
        //% servo.fieldOptions.width=220
        //% servo.fieldOptions.columns=2
        //% parts=microservo trackArgs=0
        setAngle(degrees: number) {
            degrees = this.clampDegrees(degrees);
            this.internalSetContinuous(false);
            this._angle = this.internalSetAngle(degrees);
        }

        get angle() {
            return this._angle || 90;
        }

        protected internalSetContinuous(continuous: boolean): void {
            // Implement continuous setting if needed
        }

        protected internalSetAngle(angle: number): number {
            // Default implementation - override in derived classes
            return angle;
        }

        /**
         * Set the throttle on a continuous servo
         * @param speed the throttle of the motor from -100% to 100%
         */
         //% block
    //% group="Servo"
        //% color="#fc0303"
        //% weight=99 help=servos/run
        //% blockId=servoservorun block="continuous %servo run at %speed=speedPicker \\%"
        //% servo.fieldEditor="gridpicker"
        //% servo.fieldOptions.width=220
        //% servo.fieldOptions.columns=2
        //% parts=microservo trackArgs=0
        run(speed: number): void {
            const degrees = this.clampDegrees(Math.map(speed, -100, 100, this._minAngle, this._maxAngle));
            const neutral = (this._maxAngle - this._minAngle) >> 1;
            this.internalSetContinuous(true);
            if (this._stopOnNeutral && degrees == neutral) {
                this.stop();
            } else {
                this._angle = this.internalSetAngle(degrees);
            }
        }

        /**
         * Set the pulse width to the servo in microseconds
         * @param micros the width of the pulse in microseconds
         */
         //% block
    //% group="Servo"
        //% color="#fc0303"
        //% weight=10 help=servos/set-pulse
        //% blockId=servoservosetpulse block="set %servo pulse to %micros μs"
        //% micros.min=500 micros.max=2500
        //% micros.defl=1500
        //% servo.fieldEditor="gridpicker"
        //% servo.fieldOptions.width=220
        //% servo.fieldOptions.columns=2
        //% parts=microservo trackArgs=0
        setPulse(micros: number) {
            micros = micros | 0;
            micros = Math.clamp(500, 2500, micros);
            this.internalSetPulse(micros);
        }

        protected internalSetPulse(micros: number): void {
            // Implement pulse width setting if needed
        }

        /**
         * Stop sending commands to the servo so that its rotation will stop at the current position.
         */
        // On a normal servo this will stop the servo where it is, rather than return it to neutral position.
        // It will also not provide any holding force.
         //% block
    //% group="Servo"
        //% color="#fc0303"
        //% weight=10 help=servos/stop
        //% blockId=servoservostop block="stop %servo"
        //% servo.fieldEditor="gridpicker"
        //% servo.fieldOptions.width=220
        //% servo.fieldOptions.columns=2
        //% parts=microservo trackArgs=0
        stop() {
            if (this._angle !== undefined) {
                this.internalStop();
            }
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

        /**
         * Set the possible rotation range angles for the servo between 0 and 180
         * @param minAngle the minimum angle from 0 to 90
         * @param maxAngle the maximum angle from 90 to 180
         */
         //% block
    //% group="Servo"
        //% color="#fc0303"
        //% help=servos/set-range
        //% blockId=servosetrange block="set %servo range from %minAngle to %maxAngle"
        //% minAngle.min=0 minAngle.max=90
        //% maxAngle.min=90 maxAngle.max=180 maxAngle.defl=180
        //% servo.fieldEditor="gridpicker"
        //% servo.fieldOptions.width=220
        //% servo.fieldOptions.columns=2
        //% parts=microservo trackArgs=0
        public setRange(minAngle: number, maxAngle: number) {
            this._minAngle = Math.max(0, Math.min(90, minAngle | 0));
            this._maxAngle = Math.max(90, Math.min(180, maxAngle | 0));
        }

        /**
         * Set a servo stop mode so it will stop when the rotation angle is in the neutral position, 90 degrees.
         * @param on true to enable this mode
         */
         //% block
    //% group="Servo"
        //% color="#fc0303"
        //% help=servos/set-stop-on-neutral
        //% blockId=servostoponneutral block="set %servo stop on neutral %enabled"
        //% enabled.shadow=toggleOnOff
        //% servo.fieldEditor="gridpicker"
        //% servo.fieldOptions.width=220
        //% servo.fieldOptions.columns=2
        public setStopOnNeutral(enabled: boolean) {
            this._stopOnNeutral = enabled;
        }

        protected internalStop() {
            // Implement stop if needed
        }
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

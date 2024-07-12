//% color="#0345fc" weight=10 icon="\uf19d"
namespace IchiRobotic {
    //% weight=100 help=servos/set-angle
    //% blockId=servoservosetangle block="set %servo angle to %degrees=protractorPicker °"
    //% degrees.defl=90
    //% servo.fieldEditor="gridpicker"
    //% servo.fieldOptions.width=220
    //% servo.fieldOptions.columns=2
    //% blockGap=8
    //% parts=microservo trackArgs=0
    //% group="Positional"
    function Servo(degree: number): void {
        let angle = new IchiLib.Servo();
        angle.setAngle(degree);
    }
    //% color="#fc0303"
    //% blockId=robotbit_motor_run block="Motor|%index|speed %speed"
    //% group="Motor" weight=59
    //% speed.min=-255 speed.max=255
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
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
}
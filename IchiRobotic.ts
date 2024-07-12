//% color="#0345fc" weight=10 icon="\uf19d"
namespace IchiRobotic {
    //% color="#fc0303"
    //% blockId=robotbit_motor_run block="Động cơ |%index|di chuyển với tốc độ %speed"
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
    //% color="#fc0303"
    //% blockId=robotbit_motor_rundelay block="Động cơ|%index|di chuyển với tốc độ %speed|trong %delay|s"
    //% group="Motor" weight=57
    //% speed.min=-255 speed.max=255
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function MotorRunDelay(index: IchiLib.Motors, speed: number, delay: number): void {
        MotorRun(index, speed);
        basic.pause(delay * 1000);
        MotorRun(index, 0);
    }
    //% color="#fc0303"
    //% blockId=robotbit_robotrun block="Di chuyển về |%index| với tốc độ %speed|trong %delay|s"
    //% group="Motor" weight=57
    //% speed.min=-255 speed.max=255
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=5
    export function RobotRun(index: IchiLib.Move, speed: number, delay: number): void {
        if(index = 1){
            IchiLib.MotorRunDual(
                IchiLib.Motors.Trái,
                speed,
                IchiLib.Motors.Phải, speed
            )
            basic.pause(delay * 1000);
        }
        if (index = 2) {
            IchiLib.MotorRunDual(
                IchiLib.Motors.Trái,
                -speed,
                IchiLib.Motors.Phải, speed
            )
            basic.pause(delay * 1000);
        }
        if (index = 3) {
            IchiLib.MotorRunDual(
                IchiLib.Motors.Trái,
                speed,
                IchiLib.Motors.Phải, 0
            )
            basic.pause(delay * 1000);
        }
        if (index = 3) {
            IchiLib.MotorRunDual(
                IchiLib.Motors.Trái,
                0,
                IchiLib.Motors.Phải, speed
            )
            basic.pause(delay * 1000);
        }
    }
}
//% color="#0345fc" weight=10 icon="\uf19d"
namespace IchiRobotic {
    // Điều chỉnh mã cho các hàm điều khiển động cơ
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
    //% color="#fc0303"
    //% blockId=2 block="Động cơ |%index| di chuyển với tốc độ %speed trong %delay|s"
    //% speed.min=-255 speed.max=255
    export function MotorRunDelay(index: IchiLib.Motors, speed: number, delay: number): void {
        MotorRun(index, speed);
        basic.pause(delay * 1000);
    }

    // Điều chỉnh mã cho hàm điều khiển robot di chuyển
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
    //% color="#fc0303"
    //% weight=100 help=servos/set-angle
    //% blockId=servoservosetangle block="set %servo angle to %degrees=protractorPicker °"
    //% degrees.defl=90
    //% servo.fieldEditor="gridpicker"
    //% fixedInstances

}

/**
 * Control micro servos
 */
//% color="#03AA74" weight=88 icon="\uf021" blockGap=8
//% groups='["Positional", "Continuous", "Configuration"]'
namespace servos {
    //% fixedInstances
    export class Servo {
        private _minAngle: number;
        private _maxAngle: number;
        private _stopOnNeutral: boolean;
        private _angle: number;

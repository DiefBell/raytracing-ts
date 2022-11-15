import { glm_utils, matrix, quaternion, vector } from 'glm-ts';
import { Quaternion } from 'glm-ts/lib/quaternion';

import { Keyboard, Mouse } from '@minecraftts/seraph';

import { ICamera } from './ICamera';

enum EKeycode
{
    W = 87,
    S = 83,
    A = 65,
    D = 68,
    SPACEBAR = 32,
    ENTER = 13,
    ESC = 27
}

enum EMouseButton
{
    LEFT_CLICK = 0
}

export class Camera implements ICamera
{
    private _forward: vector.Vector3;
    public get direction() { return this._forward; }

    private _position: vector.Vector3;
    public get position() { return this._position; }

    private _keyboard: Keyboard;
    private _mouse: Mouse;
    private _lastMousePosition: vector.Vector2;

    private _strafeSpeed = 5;
    public get strafeSpeed() { return this._strafeSpeed; }

    private _rotationSpeed = 0.3;
    public get rotationSpeed() { return this._rotationSpeed; }
    private readonly _mouseDeltaScalar = 0.002;

    private _projection = matrix.identity(4);
    private _inverseProjection = matrix.identity(4);
    private _view = matrix.identity(4);
    private _inverseView = matrix.identity(4);

    private _viewportWidth = 0;
    private _viewportHeight = 0;

    private _fov: matrix.IFov;
    private _nearClip: number;
    private _farClip: number;

    private _rayDirections: vector.Vector3[] = [];
    public get rayDirections() { return this._rayDirections; }

    constructor(
        viewportWidth: number,
        viewportHeight: number,
        keyboard: Keyboard,
        mouse: Mouse,
        fov: matrix.IFov = {
            upRads: 30 * Math.PI / 180,
            downRads: 30 * Math.PI / 180,
            leftRads: 50 * Math.PI / 180,
            rightRads: 50 * Math.PI / 180
        },
        nearClip = 0.1,
        farClip = 100
    )
    {
        this._viewportWidth = viewportWidth;
        this._viewportHeight = viewportHeight;

        this._keyboard = keyboard;
        this._mouse = mouse;

        this._forward = [ 0, 0, -1 ];
        this._position = [ 0, 0, 3 ];

        this._lastMousePosition = [
            mouse.getMouseX(),
            mouse.getMouseY()
        ];

        this._fov = fov;
        this._nearClip = nearClip;
        this._farClip = farClip;

        this._recalculateProjection();
        this._recalculateRayDirections();
    }

    public update(ts: number)
    {
        const keyboardMoved = this._updateKeyboard(ts);
        const mouseMoved = this._updateMouse();

        if(keyboardMoved || mouseMoved)
        {
            this._recalculateProjection();
            this._recalculateRayDirections();
        }
    }

    public onResize(width: number, height: number)
    {
        if(width === this._viewportWidth && height === this._viewportHeight)
            return;
        
        this._viewportWidth = width;
        this._viewportHeight = height;

        this._recalculateProjection();
        this._recalculateRayDirections();
    }

    private _updateKeyboard(ts: number): boolean
    {
        const { _keyboard: keyboard } = this;

        let moved = false;
        if(keyboard.getKeyDown(EKeycode.W))
        {
            this._position = vector.add(
                this._position,
                vector.scale(
                    this._forward,
                    ts * this._strafeSpeed
                )
            );
            moved = true;
        }
        else if(keyboard.getKeyDown(EKeycode.S))
        {
            this._position = vector.subtract(
                this._position,
                vector.scale(
                    this._forward,
                    ts * this._strafeSpeed
                )
            );
            moved = true;
        }

        const rightDirection = vector.cross3D(this._forward, vector.up());
        if(keyboard.getKeyDown(EKeycode.D))
        {
            this._position = vector.add(
                this._position,
                vector.scale(
                    rightDirection,
                    ts * this._strafeSpeed
                )
            );
            moved = true;
        }
        else if(keyboard.getKeyDown(EKeycode.A))
        {
            this._position = vector.subtract(
                this._position,
                vector.scale(
                    rightDirection,
                    ts * this._strafeSpeed
                )
            );
            moved = true;
        }

        return moved;
    }

    private _updateMouse()
    {
        const { _mouse: mouse } = this;

        const mousePos: vector.Vector2 = [
            mouse.getMouseX(),
            mouse.getMouseY()
        ];

        if(!mouse.getButtonDown(EMouseButton.LEFT_CLICK))
        {
            this._lastMousePosition = mousePos;
            return false;
        }

        const delta = vector.scale(
            vector.subtract(
                mousePos,
                this._lastMousePosition
            ),
            this._mouseDeltaScalar
        );

        if(delta[0] !== 0 || delta[1] !== 0)
        {
            const pitchDelta = delta[1] * this._rotationSpeed;
            const yawDelta = delta[0] * this._rotationSpeed;
            console.log(`Pitch: ${pitchDelta}`);
            console.log(`Yaw: ${yawDelta}`);

            const rightDirection = vector.cross3D(this._forward, vector.up());
            const qRot: quaternion.Quaternion = vector.normalize(
                vector.cross4D(
                    quaternion.fromAxisAngle(rightDirection, -1 * pitchDelta),
                    quaternion.fromAxisAngle(vector.up(), -1 * yawDelta)
                )
            );

            this._forward = this._forward = quaternion.rotate(
                this._forward,
                qRot
            );

            return true;
        }

        return false;
    }

    private _recalculateProjection(): void
    {
        this._projection = matrix.perspectiveFromFov(
            this._fov,
            this._nearClip,
            this._farClip
        );

        const inverseProjection = matrix.inverse(this._projection);

        if(inverseProjection === null)
            throw new Error("Idk something went wrong I guess");

        this._inverseProjection = inverseProjection;
    }

    private _recalculateRayDirections(): void
    {
        this._rayDirections = new Array<vector.Vector3>(this._viewportWidth * this._viewportHeight);

        for(let y = 0; y < this._viewportHeight; y++)
        {
            for(let x = 0; x < this._viewportWidth; x++)
            {
                let coord: vector.Vector2 = [ x / this._viewportWidth, y / this._viewportHeight ];
                // map coord to -1 -> 1 range
                coord = vector.scale(coord, 2);
                coord = vector.subtract(coord, [ 1, 1 ]);

                const homogeneousCoord: matrix.Matrix<4, 1> = [
                    [ coord[0] ],
                    [ coord[1] ],
                    [ 1 ],
                    [ 1 ]
                ];

                const target: quaternion.Quaternion = glm_utils.Mat4x1ToQuaternion(
                    matrix.multiply(this._inverseProjection, homogeneousCoord)
                );
                const [ i, j, k, w ] = target;

                const normalisedTargetVec: vector.Vec3 = vector.normalise(
                    vector.scale(
                        [ i, j, k ],
                        1 / w
                    )
                );

                const normalisedTarget: Quaternion = [ normalisedTargetVec[0], normalisedTargetVec[1], normalisedTargetVec[2], 0 ];


                const rayDirection = glm_utils.Mat4x1ToVector(
                    matrix.multiply(this._inverseView, glm_utils.QuatToVertMatrix(normalisedTarget))
                )
                .splice(3, 1) as vector.Vector3;

                this._rayDirections[ x + y * this._viewportWidth] = rayDirection;
            }
        }
    }
}
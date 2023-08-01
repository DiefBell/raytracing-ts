import { Scene } from "../scene/Scene";
import { Sphere } from "../scene/Sphere";

export const mainScene = new Scene(
    [
        // pink "floor" sphere
        new Sphere(
            [
                0,
                -7,
                0
            ],
            7,
            0
        ),
        // blue floating sphere
        new Sphere(
            [
                0, // positive x
                1, // positive y
                0.4 // positive is towards camera
            ],
            1,
            1
        ),
    ],
    [ 32, 32, 32 ]
);

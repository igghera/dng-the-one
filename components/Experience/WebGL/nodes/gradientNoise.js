import { Fn, fract, dot, vec2, mul } from 'three/tsl'

/*
 * Gradient noise from Jorge Jimenez's presentation:
 * Source: https://blog.frost.kiwi/GLSL-noise-and-radial-gradient/
 */
export const gradientNoise = /*@__PURE__*/ Fn( ( [ uv ] ) => {
	return fract(mul(52.9829189, fract( dot(uv, vec2(0.06711056, 0.00583715)))));
}, { uv: 'vec2', return: 'float' } );

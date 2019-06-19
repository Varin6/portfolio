import * as Three from 'three';

export function makeScalarField(index,width, height) {
    let nofPixels = width*height;
    let size = width * height;
    let data = new Uint8Array( 3 * size );

    for (let i = 0; i < nofPixels; i++) {
        let x = i%width;
        let y = Math.floor(i/width);
        let sphericalCoord = getSphericalCoord(index, x, y, width);

        let color = scalarField(sphericalCoord.x, sphericalCoord.y, sphericalCoord.z);

        data[i*3] = color.r*255;
        data[i*3+1] = color.g*255;
        data[i*3+2] = color.b*255;
    }

    return data;
}



export function getSphericalCoord(index, x, y, width) {
    width /= 2;
    x -= width;
    y -= width;
    let coord = new Three.Vector3();

    if (index == 0) {coord.x=width; coord.y=-y, coord.z=-x}
    else if (index == 1) {coord.x=-width; coord.y=-y, coord.z=x}
    else if (index == 2) {coord.x=x; coord.y=width, coord.z=y}
    else if (index == 3) {coord.x=x; coord.y=-width, coord.z=-y}
    else if (index == 4) {coord.x=x; coord.y=-y, coord.z=width}
    else if (index == 5) {coord.x=-x; coord.y=-y, coord.z=-width}

    coord.normalize();
    return coord;
}





export function scalarField(x, y, z) {
    let resolution1 = 4;
    let resolution2 = 16;
    let resolution3 = 64;
    let resolutionMax = 512;

    let coordFloat = new Three.Vector3();

    let randomScalarField = function(x, y, z) {
        return random4(x, y, z);
    }

    let helper = function(x, y, z, scalarField, resolution, interpolationMethod) {
        // Because the sphere sample function gives normalized coordinates:
        x = (x+1)/2*resolution;
        y = (y+1)/2*resolution;
        z = (z+1)/2*resolution;

        coordFloat.set(x, y, z);
        let interpolated = interpolationMethod(coordFloat, scalarField);
        return interpolated*2 - 1; // Gives values (-1, 1)
    }

    let level1 = helper(x, y, z, randomScalarField, resolution1, tricosineInterpolation);
    let level2 = helper(x, y, z, randomScalarField, resolution2, tricosineInterpolation);
    let level3 = helper(x, y, z, randomScalarField, resolution3, tricosineInterpolation);
    let levelMax = helper(x, y, z, randomScalarField, resolutionMax, nearestNeighbour);

    let c = 0.5;
    c *= 1 + level1*0.75;
    c *= 1 + level2*0.25;
    c *= 1 + level3*0.075;
    c *= 1 + levelMax*(1/50);

    if (c < 0.5) c *= 0.9;

    c = clamp(c, 0, 1);

    return new Three.Color().setRGB(c, c + 0.1, c + 0.6);
}

export function clamp(number, from, to) {
    return Math.max(Math.min(number, to), from);
}


export function makeSpecifiedArray1D(size, value, array) {
    let valueFloat = value;
    for (let x = 0; x < size; x++) {
        if (typeof(value) == "function") valueFloat = value(x);
        array[x] = valueFloat;
    }
    return array;
}

window.N = 256*256;
window.G = makeSpecifiedArray1D(N, Math.random, new Float32Array(N));
window.P = makeSpecifiedArray1D(N, function() {return randomInt(0, N-1)}, new Uint32Array(N));


export function random4(i, j, k) {
    return G[(i + P[(j + P[k % N]) % N]) % N];
}


export function randomInt(from, to, seed) {
    return Math.floor(randomFloat(from, to+1, seed));
}

export function randomFloat(from, to, seed) {
    return random(seed)*(to-from)+from;
}


export function random(seed) {
    let scope = random;

    scope.MAX = scope.MAX || Math.pow(2, 32);
    scope.a = 1664525;
    scope.c = 1013904223;

    scope.seeds = scope.seeds || {};

    seed = seed || 0;
    let key = seed;
    if (typeof seed == "string") {
        if (scope.seeds[seed] == undefined) {
            let numeric = numberFromString(seed);
            scope.seeds[seed] = numeric; // Memoization
            seed = numeric;
        } else {
            seed = scope.seeds[seed];
        }
    }
    scope.series = scope.series || {};
    scope.series[key] = scope.series[key] || seed;

    let lastRandom = scope.series[key];
    let newRandom = (scope.a * lastRandom + scope.c) % scope.MAX;

    scope.series[key] = newRandom;

    return newRandom/scope.MAX;
}







export function trilinearInterpolation(coordFloat, scalarField, interpolation) {
    interpolation = interpolation || function(a, b, x) {
        return  a*(1-x) + b*x;
    }

    let coord0 = {x: Math.floor(coordFloat.x), y: Math.floor(coordFloat.y), z: Math.floor(coordFloat.z)};
    let coord1 = {x: coord0.x+1, y: coord0.y+1, z: coord0.z+1};
    let xd = (coordFloat.x - coord0.x)/Math.max(1, (coord1.x-coord0.x));
    let yd = (coordFloat.y - coord0.y)/Math.max(1, (coord1.y-coord0.y));
    let zd = (coordFloat.z - coord0.z)/Math.max(1, (coord1.z-coord0.z));
    let c00 = interpolation(scalarField(coord0.x, coord0.y, coord0.z), scalarField(coord1.x, coord0.y, coord0.z), xd);
    let c10 = interpolation(scalarField(coord0.x, coord1.y, coord0.z), scalarField(coord1.x, coord1.y, coord0.z), xd);
    let c01 = interpolation(scalarField(coord0.x, coord0.y, coord1.z), scalarField(coord1.x, coord0.y, coord1.z), xd);
    let c11 = interpolation(scalarField(coord0.x, coord1.y, coord1.z), scalarField(coord1.x, coord1.y, coord1.z), xd);
    let c0 = interpolation(c00, c10, yd);
    let c1 = interpolation(c01, c11, yd);
    let c = interpolation(c0, c1, zd);

    return c;

}

export function nearestNeighbour(coordFloat, scalarField) {
    return scalarField(Math.floor(coordFloat.x), Math.floor(coordFloat.y), Math.floor(coordFloat.z));
}

export function tricosineInterpolation(coordFloat, scalarField) {
    
    let interpolation = function(a, b, x) {
        let ft = x * 3.1415927;
        let f = (1 - Math.cos(ft)) * 0.5;
        return  a*(1-f) + b*f
    }

    return trilinearInterpolation(coordFloat, scalarField, interpolation);
}



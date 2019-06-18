


function trilinearInterpolation(coordFloat, scalarField, interpolation) {
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

function nearestNeighbour(coordFloat, scalarField) {
    return scalarField(Math.floor(coordFloat.x), Math.floor(coordFloat.y), Math.floor(coordFloat.z));
}

function tricosineInterpolation(coordFloat, scalarField) {
    
    let interpolation = function(a, b, x) {
        let ft = x * 3.1415927;
        let f = (1 - Math.cos(ft)) * 0.5;
        return  a*(1-f) + b*f
    }

    return SS.util.trilinearInterpolation(coordFloat, scalarField, interpolation);
}
"use strict";

var canvas;
var gl;

var points = [];
var points2 = [];
var angle = 0;


var NumTimesToSubdivide = 0;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three points.

    var vertices = [
	vec2(Math.sin(2.0 * Math.PI / 3.0 * 0), Math.cos(2.0 * Math.PI / 3.0 * 0)),
    vec2(Math.sin(2.0 * Math.PI / 3.0 * 1), Math.cos(2.0 * Math.PI / 3.0 * 1)),
    vec2(Math.sin(2.0 * Math.PI / 3.0 * 2), Math.cos(2.0 * Math.PI / 3.0 * 2))];

    divideTriangle( vertices[0], vertices[1], vertices[2],
                    NumTimesToSubdivide);
					
	twist(angle);

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width , canvas.height  );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
	
    render();		


};

function triangle( a, b, c )
{
    points.push( a, b, c );
}

function divideTriangle( a, b, c, count )
{

    // check for end of recursion

    if ( count == 0 ) {
        triangle( a, b, c );
    }
    else {

        //bisect the sides

        var ab = mix( a, b, 0.5 );
        var ac = mix( a, c, 0.5 );
        var bc = mix( b, c, 0.5 );

        count -= 1;

        // three new triangles
		
		divideTriangle(ab, bc, ac, count);	
        divideTriangle( a, ab, ac, count );
        divideTriangle( c, ac, bc, count );
        divideTriangle( b, bc, ab, count );
		
		
    }
}

function twist(angle)
{
	
	var theta = Math.PI / 180.0 * angle;
		
	for (var index = 0; index < points.length; index++){
		
		var vec = points[index];
		var dis = Math.sqrt(Math.pow(vec[0], 2) + Math.pow(vec[1], 2));		
		var new_vec =  vec2(vec[0] * Math.cos(dis * theta) - vec[1] * Math.sin(dis * theta), vec[0] * Math.sin(dis * theta) + vec[1] * Math.cos(dis * theta));
		points2.push(new_vec);		
	}
	points = points2.slice();
	points2 = [];
}

	
function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );
    for (var i=0; i<points.length; i+=3){
		gl.drawArrays( gl.LINE_LOOP, i, 3);
	
	}
}

function generateGeometry(angle) {
    points = [];	
    var vertices = [
	vec2(Math.sin(2.0 * Math.PI / 3.0 * 0), Math.cos(2.0 * Math.PI / 3.0 * 0)),
    vec2(Math.sin(2.0 * Math.PI / 3.0 * 1), Math.cos(2.0 * Math.PI / 3.0 * 1)),
    vec2(Math.sin(2.0 * Math.PI / 3.0 * 2), Math.cos(2.0 * Math.PI / 3.0 * 2))];
    divideTriangle( vertices[0], vertices[1], vertices[2], NumTimesToSubdivide);
	twist(angle);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
}


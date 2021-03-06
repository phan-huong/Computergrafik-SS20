var canvas = document.getElementById('miCanvas');
canvas.width = 578;
canvas.height = 400;
var gl = canvas.getContext('webgl');

// Define the geomertry and store it in buffer objects
var vertices = [ 
    -0.5, -0.5,
    0.0, 0.5,
    0.5, -0.5,
];

// Create Buffer for object
var vertexBuffer = gl.createBuffer();
// Bind appropriate array buffer to it
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
// Pass the vertex data to the buffer
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

// Vertex shader code
var vertexCode =
    'attribute vec4 vert_position;' +
    'void main() {' +
        'gl_Position = vert_position;' +
    '}';

// Create a vertex shader object
var vertexShader = gl.createShader(gl.VERTEX_SHADER);
// Attach shader source code
gl.shaderSource(vertexShader, vertexCode);
// Compile the vertex shader
gl.compileShader(vertexShader);

// Fragment shader code
var fragCode =
    'precision mediump float;' +
    'void main() {' +
        'gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);' +
    '}';

// Create a fragmen shader object
var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
// Attach shader cource code
gl.shaderSource(fragShader, fragCode);
// Compile the fragment shader
gl.compileShader(fragShader);

// Create a program that combines two shaders
var shaderProgram = gl.createProgram();

// Attach vertex shader
gl.attachShader(shaderProgram, vertexShader);
// Attach fragment shader
gl.attachShader(shaderProgram, fragShader);
// Link both programs
gl.linkProgram(shaderProgram);
// Use the combined shader program
gl.useProgram(shaderProgram);

function render(time){
    // Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Get the attribute location
    var attLocation = gl.getAttribLocation(shaderProgram, 'vert_position');
    // Point an attribute to the currently bound
    gl.vertexAttribPointer(attLocation, 2, gl.FLOAT, gl.FALSE, 0, 0);
    // Enable the attribute
    gl.enableVertexAttribArray(attLocation);

    // Clear canvas
    gl.clearColor(0.0, 0.0, 0.0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw triangle
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // requestAnimationFrame(render);
    }
requestAnimationFrame(render);
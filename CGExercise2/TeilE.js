var canvas = document.getElementById('miCanvas');
// var container = document.getElementById('container');
// var container_style = getComputedStyle(container);
canvas.height = window.innerHeight;
canvas.width = canvas.height;
var gl = canvas.getContext('webgl');

var moon_orbit_speed = 5;
var vertexBuffer, shaderProgram;

function setup(){
    // Define the geomertry and store it in buffer objects
    var vertices = [ 
        1.0, -1.0,
        -1.0, 1.0,
        1.0, 1.0,

        -1.0, 1.0,
        -1.0, -1.0,
        1.0, -1.0,
    ];

    // Create Buffer for object
    vertexBuffer = gl.createBuffer();
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
    var fragCode = [`
        precision mediump float;
        uniform float canvas_width;
        uniform float canvas_height;
        uniform float time_factor;
        #define PI radians(180.0)
        void main() {
            // Distance between Earth and Moon
            float distance = 0.4;
            // Earth
            float earth_radius = 0.2;
            float earth_x = 0.5;
            float earth_y = 0.5;
            float x = fract(gl_FragCoord.x / canvas_width);
            float y = fract(gl_FragCoord.y / canvas_height);
            float earth_surface = sqrt(((x-earth_x)*(x-earth_x)) + ((y-earth_y)*(y-earth_y)));

            // Moon
            float moon_radius = 0.05;
            float angle = time_factor * PI * 2.0;
            float moon_x = cos(angle) * distance + earth_x;
            float moon_y = sin(angle) * distance + earth_y;
            float moon_surface = sqrt(((x-moon_x)*(x-moon_x)) + ((y-moon_y)*(y-moon_y)));

            // Paint the planets
            if (earth_surface <= earth_radius) {
                gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
            } else if (moon_surface <= moon_radius) {
                gl_FragColor = vec4(0.5, 0.5, 0.5, 1.0);
            } else {
                gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
            }
        }
    `].join("\n");

    // Create a fragmen shader object
    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    // Attach shader cource code
    gl.shaderSource(fragShader, fragCode);
    // Compile the fragment shader
    gl.compileShader(fragShader);

    // Create a program that combines two shaders
    shaderProgram = gl.createProgram();

    // Attach vertex shader
    gl.attachShader(shaderProgram, vertexShader);
    // Attach fragment shader
    gl.attachShader(shaderProgram, fragShader);
    // Link both programs
    gl.linkProgram(shaderProgram);
    // Use the combined shader program
    gl.useProgram(shaderProgram);
}

var start = null;

function render(time){

    if (!start) start = time;
    var dauer = time - start;
    let angle = dauer > 5000 ? 1.0 : (dauer * 0.001) / moon_orbit_speed;

    var canvas_width = gl.getUniformLocation(shaderProgram, 'canvas_width');
    var canvas_height = gl.getUniformLocation(shaderProgram, 'canvas_height');
    var time_factor = gl.getUniformLocation(shaderProgram, 'time_factor');
    gl.uniform1f(canvas_width, gl.canvas.width);
    gl.uniform1f(canvas_height, gl.canvas.height);
    gl.uniform1f(time_factor, angle);

    // Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Get the attribute location
    var attLocation = gl.getAttribLocation(shaderProgram, 'vert_position');
    // Point an attribute to the currently bound
    gl.vertexAttribPointer(attLocation, 2, gl.FLOAT, gl.FALSE, 0, 0);
    // Enable the attribute
    gl.enableVertexAttribArray(attLocation);

    // Clear canvas
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw triangle
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    if (dauer > 5000) start += 5000;

    requestAnimationFrame(render);
    }

setup();
requestAnimationFrame(render);
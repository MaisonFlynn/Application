const socket = io('http://localhost:3000'); // Connect TO Server

function start() {
    // Hide Lobby
    document.getElementById('lobby').style.display = 'none';
    
    // Show Game
    document.getElementById('game').style.display = 'block';
    document.getElementById('knobs').style.display = 'none';
}

function random() {
    document.getElementById('msg').textContent = "Searching";
    
    // Temporary Simulation
    setTimeout(() => {
        startGame();
        document.getElementById('msg').textContent = "Found!";
    }, 2000);
}

function friend() {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    document.getElementById('invite').value = code;

    document.getElementById('tote').style.display = 'block';
    document.getElementById('msg').textContent = "Share Code w/ Friend!";

    socket.emit('create', code);
}

function join() {
    const code = document.getElementById('join').value.toUpperCase();
    socket.emit('join', code);
}

function copy() {
    const code = document.getElementById('invite');
    code.select();
    document.execCommand('copy');
    document.getElementById('msg').textContent = "Copied!";
}

socket.on('start', (game) => {
    start();
    initialize(game);
});

socket.on('update', (board) => {
    update(board);
});

function move(index) {
    const Player = "X"; 
    const Code = document.getElementById('invite').value || document.getElementById('join').value;
    
    socket.emit('move', {
        code: Code,
        index: index,
        player: Player
    });
    
    check(); // Check IF Game Over
}

function initialize(game) {
    // Choose X & O
    document.getElementById('one').textContent = game.players[0];
    document.getElementById('two').textContent = game.players[1];
    updateBoard(game.board);
}

function update(board) {
    board.forEach((value, index) => {
        document.getElementById(index.toString()).textContent = value;
    });
}

function check() {
    // Temporary Simulation

    const board = Array.from(document.getElementsByClassName('cell')).map(cell => cell.textContent);
    const win = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Row(s)
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Column(s)
        [0, 4, 8], [2, 4, 6]  // Diagonal(s)
    ];
    
    let end = false;
    
    win.forEach(combination => {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            end = true;
            document.getElementById('status').textContent = `${board[a]} Won!`;
        }
    });
    
    if (!end && board.every(cell => cell !== '')) {
        end = true;
        document.getElementById('status').textContent = "Draw!";
    }

    if (end) {
        document.getElementById('knobs').style.display = 'flex'; // Show Knobs
    }
}

function replay() {
    // Temporary Simulation
    document.getElementById('status').textContent = "Replay?";
}

function leave() {
    // Alert?
    document.getElementById('game').style.display = 'none';
    document.getElementById('knobs').style.display = 'none';
    document.getElementById('lobby').style.display = 'flex';
}

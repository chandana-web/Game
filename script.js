class MarbleGame {
    constructor() {
        this.board = Array.from({ length: 4 }, () => Array(4).fill(''));
        this.currentPlayer = 'A';
        this.winner = null;
        this.initializeBoard();
        this.updateStatus();
    }

    initializeBoard() {
        const boardElement = document.getElementById('game-board');
        boardElement.innerHTML = '';
        this.board.forEach((row, rIndex) => {
            row.forEach((cell, cIndex) => {
                const cellElement = document.createElement('div');
                cellElement.classList.add('cell');
                cellElement.addEventListener('click', () => this.handleClick(rIndex, cIndex));
                boardElement.appendChild(cellElement);
            });
        });
    }

    handleClick(row, col) {
        if (this.winner || this.board[row][col] !== '') return;

        this.board[row][col] = this.currentPlayer;
        this.moveMarbles();
        this.updateBoard();
        if (this.checkWinner()) {
            this.winner = this.currentPlayer;
            this.updateStatus(`Player ${this.currentPlayer} wins!`);
        } else {
            this.currentPlayer = this.currentPlayer === 'A' ? 'B' : 'A';
            this.updateStatus();
        }
    }

    moveMarbles() {
        const newBoard = Array.from({ length: 4 }, () => Array(4).fill(''));
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (this.board[r][c] !== '') {
                    const [newR, newC] = this.getNewPosition(r, c);
                    newBoard[newR][newC] = this.board[r][c];
                }
            }
        }
        this.board = newBoard;
    }

    getNewPosition(row, col) {
        if (row === 0 && col < 3) return [row, col + 1];
        if (col === 3 && row < 3) return [row + 1, col];
        if (row === 3 && col > 0) return [row, col - 1];
        if (col === 0 && row > 0) return [row - 1, col];
        return [row, col];
    }

    checkWinner() {
        const lines = [
            ...this.board,
            ...this.board[0].map((_, c) => this.board.map(row => row[c])),
            [0, 1, 2, 3].map(i => this.board[i][i]),
            [0, 1, 2, 3].map(i => this.board[i][3 - i])
        ];

        return lines.some(line => line.every(cell => cell === this.currentPlayer));
    }

    updateBoard() {
        const boardElement = document.getElementById('game-board');
        Array.from(boardElement.children).forEach((cellElement, index) => {
            const row = Math.floor(index / 4);
            const col = index % 4;
            cellElement.textContent = this.board[row][col];
            cellElement.style.color = this.board[row][col] === 'A' ? 'red' : 'blue';
        });
    }

    updateStatus(message) {
        const statusElement = document.getElementById('game-status');
        if (message) {
            statusElement.textContent = message;
        } else {
            statusElement.textContent = `Player ${this.currentPlayer}'s turn`;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => new MarbleGame());
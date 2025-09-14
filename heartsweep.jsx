import React, { useState, useEffect, useCallback } from 'react';
import { Heart, RotateCcw, Smile, Frown } from 'lucide-react';

const GRID_SIZE = 10;
const HEART_COUNT = 15;

const HeartSweeper = () => {
  const [board, setBoard] = useState([]);
  const [gameState, setGameState] = useState('playing'); // 'playing', 'won', 'lost'
  const [firstClick, setFirstClick] = useState(true);
  const [heartsFound, setHeartsFound] = useState(0);

  const createEmptyBoard = () => {
    return Array(GRID_SIZE).fill(null).map(() => 
      Array(GRID_SIZE).fill(null).map(() => ({
        isRevealed: false,
        hasHeart: false,
        isFlagged: false,
        neighborCount: 0
      }))
    );
  };

  const placeHearts = (board, firstClickRow, firstClickCol) => {
    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    let heartsPlaced = 0;
    
    while (heartsPlaced < HEART_COUNT) {
      const row = Math.floor(Math.random() * GRID_SIZE);
      const col = Math.floor(Math.random() * GRID_SIZE);
      
      // Don't place heart on first click or if already has heart
      if ((row === firstClickRow && col === firstClickCol) || newBoard[row][col].hasHeart) {
        continue;
      }
      
      newBoard[row][col].hasHeart = true;
      heartsPlaced++;
    }
    
    return newBoard;
  };

  const calculateNeighbors = (board) => {
    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (!newBoard[row][col].hasHeart) {
          let count = 0;
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              const newRow = row + i;
              const newCol = col + j;
              if (newRow >= 0 && newRow < GRID_SIZE && newCol >= 0 && newCol < GRID_SIZE) {
                if (newBoard[newRow][newCol].hasHeart) count++;
              }
            }
          }
          newBoard[row][col].neighborCount = count;
        }
      }
    }
    
    return newBoard;
  };

  const initializeGame = () => {
    const emptyBoard = createEmptyBoard();
    setBoard(emptyBoard);
    setGameState('playing');
    setFirstClick(true);
    setHeartsFound(0);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const revealCell = useCallback((row, col) => {
    if (gameState !== 'playing' || board[row][col].isRevealed || board[row][col].isFlagged) {
      return;
    }

    let newBoard = board.map(r => r.map(cell => ({ ...cell })));

    // First click setup
    if (firstClick) {
      newBoard = placeHearts(newBoard, row, col);
      newBoard = calculateNeighbors(newBoard);
      setFirstClick(false);
    }

    // Reveal the cell
    newBoard[row][col].isRevealed = true;

    // If it's a heart, game over
    if (newBoard[row][col].hasHeart) {
      // Reveal all hearts
      for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
          if (newBoard[i][j].hasHeart) {
            newBoard[i][j].isRevealed = true;
          }
        }
      }
      setGameState('lost');
      setBoard(newBoard);
      return;
    }

    // If empty cell (no neighboring hearts), reveal adjacent cells
    if (newBoard[row][col].neighborCount === 0) {
      const queue = [[row, col]];
      const visited = new Set();
      
      while (queue.length > 0) {
        const [currentRow, currentCol] = queue.shift();
        const key = `${currentRow},${currentCol}`;
        
        if (visited.has(key)) continue;
        visited.add(key);
        
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            const newRow = currentRow + i;
            const newCol = currentCol + j;
            
            if (newRow >= 0 && newRow < GRID_SIZE && newCol >= 0 && newCol < GRID_SIZE) {
              if (!newBoard[newRow][newCol].isRevealed && !newBoard[newRow][newCol].hasHeart && !newBoard[newRow][newCol].isFlagged) {
                newBoard[newRow][newCol].isRevealed = true;
                if (newBoard[newRow][newCol].neighborCount === 0) {
                  queue.push([newRow, newCol]);
                }
              }
            }
          }
        }
      }
    }

    setBoard(newBoard);

    // Check win condition
    let revealedCount = 0;
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (newBoard[i][j].isRevealed && !newBoard[i][j].hasHeart) {
          revealedCount++;
        }
      }
    }

    if (revealedCount === GRID_SIZE * GRID_SIZE - HEART_COUNT) {
      setGameState('won');
    }
  }, [board, gameState, firstClick]);

  const toggleFlag = (e, row, col) => {
    e.preventDefault();
    if (gameState !== 'playing' || board[row][col].isRevealed) return;

    setBoard(prevBoard => {
      const newBoard = prevBoard.map(r => r.map(cell => ({ ...cell })));
      newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;
      
      // Update hearts found count
      let flaggedHearts = 0;
      for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
          if (newBoard[i][j].isFlagged && newBoard[i][j].hasHeart) {
            flaggedHearts++;
          }
        }
      }
      setHeartsFound(flaggedHearts);
      
      return newBoard;
    });
  };

  const getCellDisplay = (cell, row, col) => {
    if (cell.isFlagged) {
      return <span className="text-red-500">🚩</span>;
    }
    
    if (!cell.isRevealed) {
      return '';
    }
    
    if (cell.hasHeart) {
      return <Heart className="w-4 h-4 text-red-500 fill-red-500" />;
    }
    
    if (cell.neighborCount > 0) {
      const colors = [
        '', 'text-blue-600', 'text-green-600', 'text-red-600',
        'text-purple-600', 'text-yellow-600', 'text-pink-600',
        'text-gray-600', 'text-black'
      ];
      return <span className={`font-bold ${colors[cell.neighborCount]}`}>{cell.neighborCount}</span>;
    }
    
    return '';
  };

  const getCellStyle = (cell) => {
    if (cell.isRevealed) {
      if (cell.hasHeart) {
        return 'bg-red-200 border-red-300';
      }
      return 'bg-gray-100 border-gray-300';
    }
    return 'bg-gray-300 border-gray-400 hover:bg-gray-200';
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gradient-to-br from-pink-50 to-red-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-4 text-red-600 flex items-center justify-center gap-2">
          <Heart className="w-8 h-8 fill-red-500" />
          Heart Sweeper
          <Heart className="w-8 h-8 fill-red-500" />
        </h1>
        
        <div className="flex items-center justify-between mb-4 px-4">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            <span className="font-semibold">{HEART_COUNT - heartsFound} remaining</span>
          </div>
          
          <button
            onClick={initializeGame}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            New Game
          </button>
          
          <div className="flex items-center gap-2">
            {gameState === 'won' && <Smile className="w-6 h-6 text-green-500" />}
            {gameState === 'lost' && <Frown className="w-6 h-6 text-red-500" />}
            <span className="font-semibold">
              {gameState === 'won' && 'You Won! 🎉'}
              {gameState === 'lost' && 'Game Over 💔'}
              {gameState === 'playing' && 'Playing...'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-10 gap-1 bg-gray-400 p-2 rounded-lg">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                className={`w-8 h-8 border-2 flex items-center justify-center text-sm font-bold transition-all duration-150 ${getCellStyle(cell)}`}
                onClick={() => revealCell(rowIndex, colIndex)}
                onContextMenu={(e) => toggleFlag(e, rowIndex, colIndex)}
                disabled={gameState !== 'playing'}
              >
                {getCellDisplay(cell, rowIndex, colIndex)}
              </button>
            ))
          )}
        </div>
        
        <div className="mt-4 text-sm text-gray-600 text-center">
          <p>Left click to reveal • Right click to flag</p>
          <p>Find all the safe spots without clicking on hearts!</p>
        </div>
      </div>
    </div>
  );
};

export default HeartSweeper;
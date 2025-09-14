# HeartSweeper

HeartSweeper is a custom-built React game that reimagines the classic Minesweeper experience with a heart-themed twist. Instead of avoiding mines, players must carefully reveal cells while steering clear of hidden hearts. This project showcases React state management, event handling, and modern styling techniques.

## Project Description

In HeartSweeper, you'll navigate a 10x10 grid containing 15 randomly placed hearts. The game ensures the first click is always safe, and includes features like flagging suspected hearts, recursive cell revealing for empty areas, and clear win/loss conditions. It's designed for fun and to demonstrate practical React development.

Built using:
- React for the core UI and logic
- Tailwind CSS for responsive styling
- Lucide React for icons

## Features

- Randomized heart placement on game start
- Left-click to reveal cells, right-click to flag
- Automatic revealing of adjacent safe cells
- Win by clearing all non-heart cells; lose by revealing a heart
- Restart button for new games
- Responsive design for desktop and mobile

## Installation

To run this project locally:

1. Clone the repository:
   ```
   git clone https://github.com/Harry-404/HeartSweeper.git
   ```

2. Navigate to the project directory:
   ```
   cd HeartSweeper
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm run dev
   ```

   Open your browser and visit `http://localhost:5173` to play.

## Usage

- **Reveal a cell**: Left-click on a grid cell.
- **Flag a cell**: Right-click to mark a suspected heart (right-click again to unflag).
- **Win the game**: Reveal all safe cells without hitting a heart.
- **Lose the game**: Revealing a heart ends the game and shows all hearts.
- **Restart**: Click the "New Game" button to start over.

For production builds:
```
npm run build
```

## Deployment

This project is deployed on GitHub Pages. To deploy your own version:

1. Install gh-pages:
   ```
   npm install --save-dev gh-pages
   ```

2. Add to `package.json`:
   ```
   "homepage": "https://<your-username>.github.io/HeartSweeper",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. Deploy:
   ```
   npm run deploy
   ```

Visit the deployed site at the homepage URL.

## Contributing

Contributions are welcome! If you'd like to improve the game (e.g., add features like difficulty levels or timers), follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature`.
3. Make your changes and commit: `git commit -m "Add your feature"`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Open a pull request.

Please ensure your code follows the project's style and includes tests if applicable.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Connect
<a href="https://www.linkedin.com/in/hiranmaya-biswas-505a1823a/" target="_blank"> <img src="https://img.shields.io/badge/LinkedIn-Connect-blue?logo=linkedin" alt="LinkedIn" height="30"> </a> <a href="https://github.com/Harry-404" target="_blank" style="margin-left:10px;"> <img src="https://img.shields.io/badge/GitHub-Follow-black?logo=github" alt="GitHub" height="30"> </a>

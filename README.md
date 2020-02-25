## Maze Solver

I created this project to practice backtracking and map traversal.

Have a play with it at: https://dwake5.github.io/Create-and-auto-solve-maze

![](images/Maze%20solved.png)

## What is this project?

A canvas is displayed in a 25 by 40 grid, originally coloured grey with a green and red cell for the start and exit of the maze.
A user can click to add or remove walls on the grid, they can also click and drag to create multiple walls.
On clicking solve at the bottom, a function will run to determine if the maze can or not be solved. I.e. go from start cell to end cell going in any four directions.
The path to the exit will be shown if there is one, and a message displayed if not.

## What other features are there?

A key at the top to show what each cell represents.
A reset button, another reset button which leaves walls intact.
Random fill button, with % selector. For people that don't want to draw a maze.

## How does the maze solve function work?

At the core, each cell is given state, starting at 'e' (empty). 
Starting from the start cell it looks in each direction, never diagonally, for the maze exit cell. If it finds the exit, the function terminates. Elsewise it then looks in each direction for empty/unexplored cells. 
On finding an empty cell in one direction, it will push that cells coordinates onto a list of places to check and append its state with the direction to get there, this appends will keep stacking, so each cell will have state equal to the path from the start to it, like dddddrrrrddlddrr for example. 
Each pair pushed to the list of places to check then become the starting point of the next round.
Everything is put into a while loop which stops once the exit is found.
Once it is the direction from start to finish contained in state on the last cell is evaluated and looped over, changing each cell's state to a new variable 'x' which is then colored black showing the path.

## Does it take long to run?

Using Performance.now library I tested it and it runs in 3 milliseconds, with a blank canvas or a highly filled one. The big O complexity for different grid sizes would be O(W*H). 

## Notes

It was a great refresher on vanilla JS, as I mostly use React nowadays. I also started using a vscode addon called Live Server, which hot reloads your page on code update, which was very helpful.

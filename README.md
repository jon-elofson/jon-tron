# Jon Tron

[Live](www.jon-tron.com)

## How to Play

▲ ▼ ◀ ▶ Use the arrow keys to navigate your light cycle!
Use SPACE to restart the game!

You have 3 lives. If you go out of bounds or hit a wall, you will lose a life.

## Technologies

The game is written with JavaScript and jQuery.

## Implementation Details

### AI

The AI uses multiple strategies depending on the space it is confined to and what its current options are.

Most of the time, it will try to hug a wall if it can. It identifies if any of it's three options are viable wall hugs, and if so, it will make that move. A viable wall hug was defined as a grid square adjacent to a light cycle path or any edge of the board with at least one open square.

[wall hugs]: https://github.com/jon-elofson/jon-tron/js/ai.js#147

The AI also calculates the area associated with each of it's three options and will avoid making any turns associated with smaller areas.

[area calculation]: https://github.com/jon-elofson/jon-tron/js/ai.js#178

The AI was also designed to randomly eschew these strategies and make random moves. The goal here was to make the AI more enjoyable to play against and also to sometimes sequester the other player to one part of the board.

## TODO

  * Improve AI's space calculation algorithm
  * Add boosts so the light cycles can speed up
  * Implement multiple levels with increasingly smarter AIs
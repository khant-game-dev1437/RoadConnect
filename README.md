# Documentation

## General informations
- Cocos Creator does not have Scriptable Objects, so I store the data with JSON.
- The game mechanic is to connect roads.

## EachLevelData.ts
- This script handles of each level prefab and level data. It includeds locking or unlocking of its level.

## GameManager.ts
- GameManager script handles about entering level, game, and checking the clicked level is locked or unlocked from PlayerPrefs.
- It includes saving level data if user passed the current level.

## GlobalManager.ts
- GlobalManager handles all managers which can be called by globally.

## LevelManager.ts
- LevelManager handles entering level selection. Binding all level data to UI. And loading level data from JSON.

## MessageManager.ts
- MessageManager is responsible for emitting message or listening message to determine Game State.

## PuzzleManager.ts
- PuzzleManager is responsible to bind the selected level data to UI. Game Play, Listening an event that if the user moves the piece and check for level complete or not.

## PuzzlePiece.ts
- If user clicks puzzle piece, it release a sound and emit a message.

## Root.ts
- Most of the general important functions can be written in Root.ts

## SoundManager.ts
- Responsible to handle sound management.

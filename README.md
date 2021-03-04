# The RollTheDice Chat Game

## Installation

1. [Create Discord application](https://discord.com/developers/applications)

2. Create bot for your application

3.
```bash
cp config.example.json config.json
```
and then copy your bot token to config.json

4. Use Discord OAuth2 URL generator to create bot invitation link with following
   scopes:
    - bot
    
   bot permissions:
    - Send Messages
    - View Channels

5. Create database with 
```bash
node setup-db.js
```

## Playing game

Roll the dice with 
```
!roll
```

- Player can only roll once in row
- Player can only roll once in 5min
- Dice can only be rolled once in 1min

- If player rolls smaller than last roll he lose 1p
- If player rolls larger than last roll he gains 1p
- If player rolls same as last roll he gains 3p
- Larger roll streaks increase point gain

Own points can be checked with
```
!points
```

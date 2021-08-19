# rankCard function
#### This is an example of rankCard (not rank system) | Thanks TheJoaqun#7239 for the help with canvas
<br>

```js
const simplydjs = require('simply-djs')

// messageCreate event
// rank command

simplydjs.rankCard(client, message, {
    member: user, // let user = etc.. (Optional)
    level: 'level', // get level from levelling system
    currentXP: 'current xp', // get XP from levelling system
    neededXP: 'required xp', // get required XP from levelling system
    rank: 'rank', // get rank (not level) from levelling system
    background: 'background url' // optional
  })
```

# Output
![image](https://user-images.githubusercontent.com/71836991/130052090-cde97bff-7d6d-4ca0-a4dc-71b97ed052af.png)

<br>

# Options for rankCard function [(Required)](https://github.com/Rahuletto/simply-djs/blob/main/Examples/rankCard.md)
- **level:** Current level of the user
- **currentXP:** Current XP of the user
- **neededXP:** Required XP of the user to level up
- **rank:** The Position (like 1st, 2nd, etc..) of the user based on their level

# Options for starboard function (Optional)
- **member:** Provide a member into the system (Identifies the member automatically if not provided)
- **background:** Background of the rank card

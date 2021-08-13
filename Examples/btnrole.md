# btnrole function
#### This is an example of btnrole
<br>

```js
const simplydjs = require('simply-djs')
// message event
// setup-btnrole command
simplydjs.btnrole(client, message, {
    embed: embed,
    data: [
      {
        role: 'role-id',
        label: 'name', // default: *role name*
        color: 'color', // default: SECONDARY
        emoji: 'emoji id',
      }, // etc..
    ],
  })
```

# Output
![image](https://user-images.githubusercontent.com/71836991/127870208-e790a498-99af-4fcc-a359-1f90607c59a5.png)

<br>

# Options for btnrole function [(Required)](https://github.com/Rahuletto/simply-djs/edit/main/Examples/btnrole.md)
- **embed:** The Embed you want to send with buttons
- **data:** The Data you are giving for the btnrole

## Options for data
- **role:** Role ID for the button.
- **color:** The button color which gives the role from role id
- **emoji:** The Emoji for the button which gives the role from role id (optional)

# Note
## data needs to be an array and need to follow the format that the example is shown.

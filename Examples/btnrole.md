# btnrole function
#### This is an example of btnrole
<br>

```js
const simplydjs = require('simply-djs')

// interactionCreate event
simplydjs.clickBtn(interaction)

// messageCreate event
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
![image](https://user-images.githubusercontent.com/71836991/129353127-6a0c2704-cfcd-48e1-8d1e-5aeede745a9a.png)

<br>

# Options for btnrole function [(Required)](https://github.com/Rahuletto/simply-djs/edit/main/Examples/btnrole.md)
- **embed:** The Embed you want to send with buttons
- **data:** The Data you are giving for the btnrole

## Options for data
- **role:** Role ID for the button.
- **color:** The button color which gives the role from role id
- **emoji:** The Emoji for the button which gives the role from role id (optional)

## Note
- data needs to be an array and need to follow the format that the example is shown.

# Extended Customization
- You can create your own button with its CustomId in this format `role-` and role id after it.. the button role will work like that too... 
### Example:
```js
 const btn = new MessageButton()
.setLabel('btnrole')
.setStyle('DANGER')
.setCustomId('role-123456789012345678') // role-(role id)

// send it

// in interactionCreate
simplydjs.clickBtn(interaction)
```

# menuPages/dropdownPages function
#### This is an example of menuPages/dropdownPages (Two names)
<br>

```js
const simplydjs = require('simply-djs')

// messageCreate event
  let embed = new Discord.MessageEmbed()
  .setTitle('Dropdown moment')
  .setColor('#075FFF')
  .setDescription('This is a help dropdown like thing idk what is this but this works')
 
   let emb2 = new Discord.MessageEmbed()
  .setTitle('Thanks for using my package')
  .setColor('#cc0000')
  .setDescription('Thank you for using my npm package')
  .setTimestamp()

simplydjs.dropdownPages(message, {
  type: 1, // default: 1
  embed: embed,
  placeHolder: 'Dropdown Pages',
  rows: [], // custom row to send the message with more buttons
  data:[
    {
      label: 'Label',
      desc: 'description',
      emoji: 'emoji id',
      embed: emb2, // embed sent when clicked
    }, 
  // etc..
  ]
})

```

# Output
![image](https://user-images.githubusercontent.com/71836991/129902270-328bb8c3-f3f0-4d97-a4bc-28e309f565b8.png)

<br>

# Options for menuPages function [(Required)](https://github.com/Rahuletto/simply-djs/blob/main/Examples/menuPages.md)
- **embed:** Embed to send with dropdown
- **data:** Data need to be provided to give what to send

## Options for data (Required)
- **label:** Name of the dropdown option
- **desc:** Description of the dropdown option
- **embed:** Embed to send when the option is selected

## Options for data (Optional)
- **emoji:** Emoji of the dropdown option

# Options for starboard function (Optional)
- **type:** Type 1/2 | Type 1: Send as ephemeral message (invisible message) | Type 2: Edit previous message
- **placeHolder:** Name that shows when nothing is selected
- **rows:** Custom rows to send the message with more buttons (only need to be row) [Array format]

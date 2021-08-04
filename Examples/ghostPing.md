# ghostPing function
#### This is an example of ghostPing

## With Customization
```js
const simplydjs = require('simply-djs')
// messageDelete event
simplydjs.ghostPing(message, {
embedDesc: 'desc', // default: (*a long message*)
embedColor: 'hex color', // default: #075FFF
embedFoot: 'Footer' // default: 'Ghost Ping.'
})
```

## Without Customization
```js
const simplydjs = require('simply-djs')
// messageDelete event
simplydjs.ghostPing(message)
```
# Output
![image](https://user-images.githubusercontent.com/71836991/128010116-601c6d6e-8d90-42d7-b741-446943e106be.png)

<br>

# Options for ghostPing function (Optional)
### Embed
- **embedDesc:** The Embed Description of the embed which is sent after ghost ping
- **embedColor:** The Embed Color of the embed which is sent after ghost ping
- **embedFoot:** The Embed Footer of the embed which is sent after ghost ping
- **credit:** Give credits to this package (Boolean [true/false]) Default: true

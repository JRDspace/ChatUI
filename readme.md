- Do `npm i` in `frontend`
- `npm start`
- ChatBubble Component - `frontend/src/components`
- `{ text: message, sender: 'user' }` in `app.js`  - is for right side bubble i.e., user message
- `{ text: message, sender: 'system' }` in `app.js`  - is for left side bubble i.e., system message
- To save the message send `save` property with boolean `true | false` for example `{ text: message, sender: 'system', save:false }` `{ text: message, sender: 'user', save:true }` 
- `app.js` line 9 - `{ showSendButton = true, showUploadButton = true, showClearButton = true }` we can set `false` for non-required buttons.
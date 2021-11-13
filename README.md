# Video-call-app-NodeJSserver
A clone meet, zoom or whatever you call facechat.
    Source: Web Dev Simplified
    Youtube Url: https://www.youtube.com/watch?v=DvlyzDZDEq4

This is an imitating work that is just for fun or future projects which may need to dive into this subject. You can follow the link above to see where i get the idea.

I, The first thing is to understand how a video call work on web.
  - We will need:
    + A server to handle all stream data, user id, room id got from client-side, and send back what the user want (stream videos of other in the room).
    + A webpage using the html, css and javascript (the most important part) technology.
  Well, that is fullstack, you can share the work and just be a frontend or backend developer.
  - Then we need to know how these things work with each other:
    + First of all, when we get access to the website, it will generate a random identified user Id for us.
    + We can create a room whose Id is generated automatically, or select a room by mouse-clicking or inserting room Id.
    + The webpage gets our stream-video from webcam, saves the data in a stream variable, shows us the stream (muted because surely we don't want to here our voice, At All) and sends the room Id and user Id to server together with .
    + The server, after receiving the data, will send the stream and user Id to all other users in the room.
    + When a client receives a new stream from a new user, a new video will be created and show on webpage. 

# Online Tutors

![image](https://github.com/user-attachments/assets/3cfbe558-b8bb-4550-903a-ca5855d2630c)


This website allows tutors and students to talk to each other over video chat and draw on a collaborative whiteboard. It uses React and Node.js for the frontend and backend services respectively and both run on Docker containers. It uses MongoDB for the database and Zoho Mail to mailing services. You can visit the site at https://onlinetutorstoday.net.
The site uses the WebRTC protocol for video connections and WebSockets for the whiteboard feature.

Title icon logo designed by Frank Tremmel from ClipSafari (https://www.clipsafari.com/clips/o245570-colorful-book-stack). Licensed under [CC0](https://creativecommons.org/publicdomain/zero/1.0/).

## Testing
You can run the unit tests for the React components by running these commands (after cloning my repo).

```
cd frontend
npm install
npm install --save-dev jest
npm test 
```

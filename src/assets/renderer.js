const AgoraRtcEngine = require("agora-electron-sdk").default;
const os = require("os");
const path = require("path");

// Pass your App ID here.
const APPID = "c895db377b9b45afbccf3fece8095f4e";
// Pass your token here.
const token = "006c895db377b9b45afbccf3fece8095f4eIAAj5zmWAiCaDmxBmPwizJmRFWGW9TY4OUBOgA2vRU7TqiGX0bEAAAAAEAD/8ff9+7WDYgEAAQD6tYNi";

// const sdkLogPath = path.resolve(os.homedir(), "./test.log");

let rtcEngine = new AgoraRtcEngine();
// Initialize AgoraRtcEngine.
rtcEngine.initialize(APPID);

rtcEngine.on("error", (err, msg) => {
    console.log("Error!");
});

// The video module is enabled by default. For a voice call, you need to call disableVideo to disable the video module
rtcEngine.disableVideo();

rtcEngine.setLogFile(sdkLogPath);

// Pass your channel name here, which must be the same as the channel name you filled in to generate the temporary token.
// Join the channel.
rtcEngine.joinChannel(token, "duck-room", null, 123456);
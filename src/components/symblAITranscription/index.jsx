let ws, accessToken;
let results = [];

async function getAccessToken() {
    const url = "https://api.symbl.ai/oauth2/token:generate";
    const appId = "774b314253685171587331614f4d616e55395a656a38796d4b654a336c766f7a";
    const appSecret = "49544f6f39577273566353333447762d5f64496d4a52316855653852584b7a4551314643476f6f585948344e317849535f7237517a777444432d70662d514655";


    accessToken = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            type: 'application',
            appId: appId,
            appSecret: appSecret
        })
    }).then(res => res.json())
    .then(data => data.accessToken)
}

export async function startSpeechToTextTest(startTime) {
    await getAccessToken();
    if (!accessToken) {
        console.log("Access Token can't be generated");
    } else {
        console.log("Symbl AI access token generated.");
    }
    const uniqueMeetingId = btoa("user@example.com");
    const symblEndpoint = `wss://api.symbl.ai/v1/realtime/insights/${uniqueMeetingId}?access_token=${accessToken}`;

    ws = new WebSocket(symblEndpoint);
    // Fired when a message is received from the WebSocket server
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'message_response') {
            for (let message of data.messages) {
                const transcript = `${Date.parse(message.duration.startTime) - startTime}-${message.payload.content}`;
                // console.log(transcript);
                results.push(transcript);
            }
        }
    };
    // Fired when the WebSocket closes unexpectedly due to an error or lost connection
    ws.onerror = (err) => {
        console.error(err);
    };
    // Fired when the WebSocket connection has been closed
    ws.onclose = (event) => {
        console.info('Connection to websocket closed');
    };
    // Fired when the connection succeeds.
    ws.onopen = (event) => {
        ws.send(JSON.stringify({
            type: 'start_request',
            meetingTitle: 'Websockets How-to', // Conversation name
            insightTypes: ['question', 'action_item'], // Will enable insight generation
            config: {
                confidenceThreshold: 0.5,
                languageCode: 'en-US',
                speechRecognition: {
                    encoding: 'LINEAR16',
                    sampleRateHertz: 44100,
                }
            },
            speaker: {
                userId: 'example@symbl.ai',
                name: 'Example Sample',
            }
        }));
        console.log("Symbl AI API websocket connected.")
    };

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });

    const handleSuccess = (stream) => {
        const AudioContext = window.AudioContext;
        const context = new AudioContext();
        const source = context.createMediaStreamSource(stream);
        const processor = context.createScriptProcessor(1024, 1, 1);
        const gainNode = context.createGain();
        source.connect(gainNode);
        gainNode.connect(processor);
        processor.connect(context.destination);
        processor.onaudioprocess = (e) => {
            // convert to 16-bit payload
            const inputData = e.inputBuffer.getChannelData(0) || new Float32Array(this.bufferSize);
            const targetBuffer = new Int16Array(inputData.length);
            for (let index = inputData.length; index > 0; index--) {
                targetBuffer[index] = 32767 * Math.min(1, inputData[index]);
            }
            // Send to websocket
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(targetBuffer.buffer);
            }
        };
    };
    handleSuccess(stream);
}

export function stopSpeechToTextTest() {
    ws.send(JSON.stringify({
        "type": "stop_request"
    }));
    console.log("Transcription:", results);
    return results;
}
let ws;
let results = [];

export async function startSpeechToTextTest(startTime) {
    const accessToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlFVUTRNemhDUVVWQk1rTkJNemszUTBNMlFVVTRRekkyUmpWQ056VTJRelUxUTBVeE5EZzFNUSJ9.eyJodHRwczovL3BsYXRmb3JtLnN5bWJsLmFpL3VzZXJJZCI6IjUzNTQzNjI3NDMyOTE5MDQiLCJpc3MiOiJodHRwczovL2RpcmVjdC1wbGF0Zm9ybS5hdXRoMC5jb20vIiwic3ViIjoid0sxQlNoUXFYczFhT01hblU5WmVqOHltS2VKM2x2b3pAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vcGxhdGZvcm0ucmFtbWVyLmFpIiwiaWF0IjoxNjM5Mjk1NzY1LCJleHAiOjE2MzkzODIxNjUsImF6cCI6IndLMUJTaFFxWHMxYU9NYW5VOVplajh5bUtlSjNsdm96IiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.CSU3hy5lxaBcfDcNNKBuC2nJsFAIVp_MOXWlg4weYtH6K5mexHKVKOobh9njs2EKEVnG-plkK4jeb9xmdaQ20BnGbeJDLOW2zaujq0ru2vzVIFDc9JtmTYgaisrGS75QNM5mN_duPw1Hm_H72ymAMERo5hYDWUqKZq1J4WR6kYTMnwtYz-fVFjKObDoNP64YT9bUNC6Tu4T6C6xrCvvvy96Y3pEcYpg3VQBG0mf3iO4OeYzDhFLgCT4wK4TDCj3zN-zB_Lk1NK00M_1WttP0pFJm19Cr2_9qIT06iuLhwZ6hFjIXzftNoxQK_0yzYaKgbGIW6gDwcG5MBkrFmaqjEg';
    const uniqueMeetingId = btoa("user@example.com");
    const symblEndpoint = `wss://api.symbl.ai/v1/realtime/insights/${uniqueMeetingId}?access_token=${accessToken}`;

    ws = new WebSocket(symblEndpoint);
    // Fired when a message is received from the WebSocket server
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'message_response') {
            for (let message of data.messages) {
                const transcript = `${Date.parse(message.duration.startTime) - startTime}-${message.payload.content}`;
                console.log(transcript);
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
    console.log(results);
    return results;
}
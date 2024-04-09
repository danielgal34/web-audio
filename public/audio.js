document.addEventListener('DOMContentLoaded', async () => {
    await updateDeviceList();
});

async function updateDeviceList() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioInputDevices = devices.filter(device => device.kind === 'audioinput');
    const audioOutputDevices = devices.filter(device => device.kind === 'audiooutput');

    const inputSelector = document.getElementById('microphoneList');
    inputSelector.innerHTML = ''; // Clear existing options
    audioInputDevices.forEach(device => {
        const option = document.createElement('option');
        option.value = device.deviceId;
        option.text = device.label || `Microphone ${inputSelector.length + 1}`;
        inputSelector.appendChild(option);
    });

    const outputSelector = document.getElementById('speakerList');
    outputSelector.innerHTML = ''; // Clear existing options
    audioOutputDevices.forEach(device => {
        const option = document.createElement('option');
        option.value = device.deviceId;
        option.text = device.label || `Speaker ${outputSelector.length + 1}`;
        outputSelector.appendChild(option);
    });
}

document.getElementById('startButton').addEventListener('click', async () => {
    const inputDeviceId = document.getElementById('microphoneList').value;
    const outputDeviceId = document.getElementById('speakerList').value;
    const audioElement = document.getElementById('audioElement');
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: { deviceId: inputDeviceId ? { exact: inputDeviceId } : undefined }
        });
        
        audioElement.srcObject = stream;
        audioElement.play().catch(e => console.error('Error playing audio:', e));
        
        // Set the output device if supported
        if (audioElement.setSinkId) {
            audioElement.setSinkId(outputDeviceId)
                .then(() => console.log(`Output device set to ${outputDeviceId}`))
                .catch(err => console.warn('Failed to set audio output device:', err));
        } else {
            console.warn('Your browser does not support setting the audio output device.');
        }
    } catch (err) {
        console.error('Failed to get media:', err);
    }
});

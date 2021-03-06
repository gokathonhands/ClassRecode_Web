// set up basic variables for app

var record = document.querySelector('.record');
var stop = document.querySelector('.stop');
var soundClips = document.getElementsByClassName(".sound-clips");
console.log(soundClips);

// disable stop button while not recording

stop.disabled = true;

// visualiser setup - create web audio api context and canvas

var audioCtx = new (window.AudioContext || webkitAudioContext)();

//main block for doing the audio recording

if (navigator.mediaDevices.getUserMedia) {
    console.log('getUserMedia supported.');

    var constraints = { audio: true };
    var chunks = [];

    var clipDown = document.createElement('a');
    
    var onSuccess = function(stream) {
        var mediaRecorder = new MediaRecorder(stream);
/**
 *  record click
 */
        record.onclick = function() {
            mediaRecorder.start();
            console.log(mediaRecorder.state);
            console.log("recorder started");
            record.style.background = "red";
            
            stop.disabled = false;
            record.disabled = true;
        }
/**
 *  stop click
 */
        stop.onclick = function() {
            mediaRecorder.stop();
            console.log(mediaRecorder.state);
            console.log("recorder stopped");
            record.style.background = "";
            record.style.color = "";

            stop.disabled = true;
            record.disabled = false;
        }
/**
 *  record stop
 */
        mediaRecorder.onstop = function(e) {
            console.log("data available after MediaRecorder.stop() called.");

            var clipName = prompt('Enter a name for your sound clip?','My unnamed clip');
            console.log(clipName);
            var clipContainer = document.createElement('article');
            var audio = document.createElement('audio');
            var deleteButton = document.createElement('button');

            clipContainer.classList.add('clip');
            audio.setAttribute('controls', '');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'delete';

            if(clipName === null) {
                clipDown.textContent = 'My unnamed clip';
            } else {
                clipDown.textContent = clipName;
            }
          
            clipContainer.appendChild(audio);
            clipContainer.appendChild(clipDown);
            clipContainer.appendChild(deleteButton);
            soundClips.appendChild(clipContainer);

            audio.controls = true;
            var blob = new Blob(chunks, { 'type' : 'audio/x-wav' });
            chunks = [];
            var audioURL = window.URL.createObjectURL(blob);
            audio.src = audioURL;
            clipDown.href = audioURL;
            clipDown.download = "asdf.wav";
            console.log("recorder stopped");

            var fd = new FormData();
            fd.append('wav', blob);

            console.log("waveData: " + blob);
          
            $.ajax({
                type: 'POST',
                url: '/a',
                data: fd,
                processData: false,
                contentType: false
            }).done(function(data) {
                console.log(data);
            });
          

            deleteButton.onclick = function(e) {
                evtTgt = e.target;
                evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
            }

            clipLabel.onclick = function() {
                var existingName = clipLabel.textContent;
                var newClipName = prompt('Enter a new name for your sound clip?');
                if(newClipName === null) {
                    clipLabel.textContent = existingName;
                } else {
                    clipLabel.textContent = newClipName;
                }
            }
        }

        mediaRecorder.ondataavailable = function(e) {
            chunks.push(e.data);
        }
    }

    var onError = function(err) {
        console.log('The following error occured: ' + err);
    }

    navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);

} else {
    console.log('getUserMedia not supported on your browser!');
}


$(document).ready(function() {
    
});
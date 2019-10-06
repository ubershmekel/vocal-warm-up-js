
const synthOptions = {
  oscillator: {
    // type: "sine"
    type: "triangle",
  },
  // envelope: {
  //   attack: 0.005,
  //   decay: 0.1,
  //   sustain: 0.3,
  //   release: 1
  // }
};
const synth = new Tone.Synth(synthOptions).toMaster();

let notes = [
  { time: '0n', note: 'C4', dur: '4n' },
  { time: '2n', note: 'G4', dur: '4n' },
  { time: '4n', note: 'E4', dur: '4n' },
  { time: '8n', note: 'B4', dur: '4n' },
];

notes = [];
const notesStr = 'C2,C2,,,C2,E2,G2,C3,E3,G3,F3,D3,B2,G2,F2,D2,C2,,,';
// const notesStr = 'C2,E2,G2,C3,,,,';
const noteParts = notesStr.split(',');
for (let i = 0; i < noteParts.length; i++) {
  notes.push({
    time: (i * 4) + 'n',
    note: noteParts[i],
    dur: '4n',
  });
}

// function playNotes(time, event) {
//   // the events will be given to the callback with the time they occur
//   synth.triggerAttackRelease(event.note, event.dur, time)
// }

// //pass in an array of events
// const part = new Tone.Part(playNotes, notes)

var app = new Vue({
  el: '#app',

  data: {
    isPlaying: false,
    time: 0,
    transpose: 0,
    notePlaying: "-",
    bpm: 90,
  },

  created() {
    Tone.Transport.scheduleRepeat(function(ev) {
      console.log(ev);
    }, "1n");

    Tone.Transport.on("start", function() {
      console.log("start");
    })
    Tone.Transport.on("stop", function() {
      console.log("stop");
    })
    Tone.Transport.on("pause", function() {
      console.log("“pause”");
    })
    Tone.Transport.on("loop", function() {
      console.log("loop");
    })

    
    const part = new Tone.Sequence(
      (time, note) => {
        let isPause = false;
        if (!note) {
          isPause = true;
        }
        note = Tone.Frequency(note).transpose(this.transpose);
        synth.triggerAttackRelease(note, "4n", time);
        if (isPause) {
          this.notePlaying = '-';
        } else {
          this.notePlaying = note.toNote();
        }
        
        console.log(note);
      },
      noteParts,
      "4n"
    );
    
    Tone.Transport.bpm.value = this.bpm;
    
    //start the part at the beginning of the Transport's timeline
    part.start(0)
    
    //loop the part 3 times
    //part.loop = 1
    //part.loopEnd = '1m'
    
    //start/stop the transport
    // document.querySelector('tone-play-toggle').addEventListener('change', e => Tone.Transport.toggle());
    
  },
  methods: {
    playPause() {
      Tone.Transport.toggle();
      // “started”, “stopped”, or “paused”
      if (Tone.Transport.state === "started") {
        this.isPlaying = true;
      } else {
        this.isPlaying = false;
      }
    },

    bpmSliderChange() {
      console.log("bpm", this.bpm);
      Tone.Transport.bpm.value = this.bpm;
    },

    transposeSliderChange() {
      console.log("transpose", this.transpose);
    },
  },
  computed: {
    notes() {
      return notesStr;
    }
  }
});

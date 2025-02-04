const newEffects = {
    tada: {
      animation: "animate__tada",
      sound: "assets/jazz-loop.mp3"
    },
    swing: {
      animation: "animate__swing",
      sound: "assets/correct-answer.mp3"
    }
};


for (const effectName in newEffects) {
    if (newEffects.hasOwnProperty(effectName)) {
        JuicyLib.addEffect(effectName, newEffects[effectName]);
    }
}

const newEffects = {
  bounceOnClick: {
    trigger: "click",
    target: ".contender", 
    type: "both",           // "sound", "animation" ou "both"
    animation: "animate__bounce",
    sound: "assets/correct-answer.mp3",
    element: "image.png",   // ex. si on veut manipuler une image
  },
  swingOnHover: {
    trigger: "hover",
    target: ".button",
    type: "animation",
    animation: "animate__swing",
  },
};


for (const effectName in newEffects) {
    if (newEffects.hasOwnProperty(effectName)) {
        JuicyLib.addEffect(effectName, newEffects[effectName]);
    }
}

JuicyLib.soundManager.setVolume(0.2);

import React, { useState } from 'react'
import { Icon } from '@iconify/react';

import "./index.scss";

const Speaker = (props: any) => {
    const [isSpeeching, setIsSpeeching] = useState<boolean>(false);
    const { text, lang } = props;

    const isAbleToSpeech = () => {

        if ('speechSynthesis' in window && 'SpeechSynthesisUtterance' in window) return true;

        alert("Sorry, your browser doesn't support text to speech!");

        return false;
    }

    const utter = () => {
        // var msg = new SpeechSynthesisUtterance();
        // var voices = window.speechSynthesis.getVoices();
        // msg.voice = voices[10];
        // msg.volume = 1; // From 0 to 1
        // msg.rate = 1; // From 0.1 to 10
        // msg.pitch = 2; // From 0 to 2
        // msg.text = "Como estas Joel";
        // msg.lang = 'es';
        // speechSynthesis.speak(msg);


        if (isAbleToSpeech()) {
            var msg = new SpeechSynthesisUtterance();
            msg.text = text;
            msg.lang = lang;
            msg.rate = 0.8;
            msg.onend = (e) => setIsSpeeching(false);
            msg.onerror = (e) => setIsSpeeching(false);
            window.speechSynthesis.speak(msg);
            return true;
        }

        return false;
    }
    const changeState = () => {
        if (isSpeeching) window.speechSynthesis.cancel();
        else if (utter()) setIsSpeeching(true);
    }

    return (
        <div className='speaker' onClick={changeState}>
            {
                text && <>
                    {
                        !isSpeeching
                            ? <Icon icon="material-symbols:play-circle" width="24" />
                            : <Icon icon="material-symbols:stop-rounded" width="24" />
                    }
                </>
            }
        </div>
    )
};

export default Speaker;
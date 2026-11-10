
"use strict";

const form = document.querySelector('form[name="chatForm"]');
const input = document.querySelector('input[name="userInput"]');
const chat = document.querySelector('[aria-live="polite"]');

const buttons = document.querySelectorAll("button");

const restart = Array.from(buttons).find(
    button => button.textContent.trim() === "Restart Conversation"
);

let name = "";
let capabilitiesShared = false;
let programmingShared = false;
let ended = false;

const capabilitiesPattern = /\b(what can you do|what else can you do|what more can you do|what other things can you do|what else are you able to do|what are your capabilities|what are your other capabilities|what are you capable of|how can you help|how else can you help|what else can you help me with|what can you help me with|what else do you offer|what do you do|anything else you can do|what else can you tell me about you|what else can you tell me|what else can you|what else|tell me more about you|what more can you tell me about you)\b/i;

const programmingPattern = /\b(how were you coded|how are you coded|how were you programmed|how are you programmed|how you were coded|how you were programmed|i want to know how you were coded|i want to know how you were programmed|what language were you written in|what programming language do you use|what is your source code|who programmed you)\b/i;

const generalProgrammingPattern = /\b(tell me about programming|what is programming|explain programming|teach me programming|what does programming mean|programming in general|tell me about coding|what is coding)\b/i;


function displayMessage(sender, message) {

    const paragraph = document.createElement("p");
    const bold = document.createElement("b");

    bold.textContent = sender + ": ";

    paragraph.appendChild(bold);
    paragraph.appendChild(document.createTextNode(message));

    chat.appendChild(paragraph);

    chat.scrollTop = chat.scrollHeight;
}


function getName(userText) {

    const match = userText.match(
        /\b(?:my\s+name\s+(?:is|was)|i\s+am|i'?m|im|call\s+me)\s+([A-Za-z][A-Za-z'-]*)\b/i
    );

    if (match) {
        return match[1].charAt(0).toUpperCase()
            + match[1].slice(1).toLowerCase();
    }

    else if (/^[A-Za-z][A-Za-z'-]*[,!?]*$/.test(userText)) {

        let simpleName = userText.replace(/[,!?]*$/, "");

        let invalidNames = [
            "hello", "hi", "hey", "yo", "what", "who",
            "where", "when", "why", "no", "nope",
            "greetings", "howdy", "salutations", "thanks",
            "thank", "okay", "ok", "help", "please",
            "goodbye", "bye", "yes", "yeah"
        ];

        if (!invalidNames.includes(simpleName.toLowerCase())) {

            return simpleName.charAt(0).toUpperCase()
                + simpleName.slice(1).toLowerCase();

        }
    }

    return "";
}


function restartChat() {

    name = "";

    capabilitiesShared = false;
    programmingShared = false;

    ended = false;

    chat.replaceChildren();

    displayMessage(
        "Chatbot",
        "Hello. I am a rule-based chatbot."
    );

    displayMessage(
        "Chatbot",
        "Hello. What is your name?"
    );

    input.disabled = false;
    input.value = "";
    input.focus();

}


function chatbotResponse(message) {

    let userText = message.trim().toLowerCase();

    userText = userText.replace(/\s+/g, " ");

    if (ended) {
        return;
    }

    if (name === "") {

        name = getName(message);

        if (name !== "") {

            displayMessage(
                "Chatbot",
                "Nice to meet you, " + name +
                "! Would you like to know more about me?"
            );

        }

        else {

            displayMessage(
                "Chatbot",
                "I'm sorry, I don't understand. Please tell me your name."
            );

        }

    }

    else if (/\b(quit|exit|goodbye|bye|farewell|see you|see ya|done|that's it|that's all|im done|i'm done|that's everything|thats everything|thats all)\b[.!?]*$/i.test(userText)) {

        displayMessage(
            "Chatbot",
            "Goodbye! It was nice talking to you."
        );

        ended = true;

    }

    else if ([
        "no", "nope", "nah", "not really", "not at all",
        "no way", "never", "not interested", "not now",
        "not today", "not at this time", "not at the moment",
        "not currently", "not presently", "not immediately",
        "not right now", "not this time", "not this moment",
        "not this instance", "nay", "negative", "nuh-uh",
        "no sir", "no ma'am", "no thanks", "no thank you",
        "not a chance"
    ].includes(userText)) {

        displayMessage(
            "Chatbot",
            "Alright, if you have any questions later about me, feel free to ask!"
        );

        ended = true;

    }

    else if (
        capabilitiesPattern.test(userText) ||
        programmingPattern.test(userText)
    ) {

        if (capabilitiesShared && programmingShared) {

            displayMessage(
                "Chatbot",
                "That's all I can share right now."
            );

            displayMessage(
                "Chatbot",
                "Have a good day!"
            );

            ended = true;

        }

        else if (capabilitiesShared) {

            displayMessage(
                "Chatbot",
                "I was programmed in Python using regular expressions, conditional statements, loops, and functions."
            );

            programmingShared = true;

        }

        else if (programmingShared) {

            displayMessage(
                "Chatbot",
                "I can answer basic questions and help with technical problems."
            );

            capabilitiesShared = true;

        }

        else if (capabilitiesPattern.test(userText)) {

            displayMessage(
                "Chatbot",
                "I can answer basic questions and help with technical problems."
            );

            capabilitiesShared = true;

        }

        else {

            displayMessage(
                "Chatbot",
                "I was programmed in Python using regular expressions, conditional statements, loops, and functions."
            );

            programmingShared = true;

        }

        if (capabilitiesShared && programmingShared) {

            displayMessage(
                "Chatbot",
                "That's all I can share right now."
            );

            displayMessage(
                "Chatbot",
                "Have a good day!"
            );

            ended = true;

        }

    }

    else if (generalProgrammingPattern.test(userText)) {

        displayMessage(
            "Chatbot",
            "I can only answer questions about my capabilities and how I was programmed. Would you like to know more about either of those?"
        );

    }

    else if (/\b(what should i ask you|what can i ask you|what can i ask|what should i know about you)\b/i.test(userText)) {

        displayMessage(
            "Chatbot",
            "You can ask me about my capabilities, what I can do, or how I was programmed."
        );

    }

    else if ([
        "yes", "yeah", "yep", "sure", "of course", "absolutely"
    ].includes(userText)) {

        displayMessage(
            "Chatbot",
            "Great! You can ask me what I can do or how I was programmed."
        );

    }

    else if ([
        "nice", "cool", "great", "awesome", "interesting"
    ].includes(userText)) {

        displayMessage(
            "Chatbot",
            "Thank you! Would you like to know about my capabilities or programming?"
        );

    }

    else if (/\b(what|who|where|when|why|how)\b/i.test(userText)) {

        displayMessage(
            "Chatbot",
            "I can only answer questions about my capabilities and how I was programmed. Would you like to know more about either of those?"
        );

    }

    else {

        displayMessage(
            "Chatbot",
            "What else would you like to know about me?"
        );

    }

    input.disabled = ended;

}


form.addEventListener("submit", function(event) {

    event.preventDefault();

    const message = input.value.trim();

    if (message === "") {
        return;
    }

    displayMessage("You", message);

    input.value = "";

    chatbotResponse(message);

    if (!ended) {
        input.focus();
    }

});


restart.addEventListener("click", function() {

    restartChat();

});
restartChat();
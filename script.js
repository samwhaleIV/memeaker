const canvas = document.getElementById("meme-canvas");
const rollButton = document.getElementById("roll-button");
const subtitle = document.getElementById("subtitle");
const context = canvas.getContext("2d");

const fullWidth = canvas.width;
const fullHeight = canvas.height;
const halfWidth = fullWidth / 2;
const halfHeight = fullHeight / 2;
const PI2 = Math.PI * 2;

let rollButtonEnabled = true;
const enableRollButton = () => {
    rollButtonEnabled = true;
    rollButton.classList.remove("disabled");
}
const disableRollButton = () => {
    rollButtonEnabled = false;
    rollButton.classList.add("disabled");
}

let animationFrame = null;

const particleField = new ParticleFieldEffect();
const particleWhammer = new ParticleWhammerEffect();
particleWhammer.calloutFunction =  particleField.bumpRegion;

let rendering = false;

function render(timestamp) {
    context.fillStyle = "black";
    context.fillRect(0,0,fullWidth,fullHeight);
    particleWhammer.render(timestamp);
    particleField.render(timestamp);
    animationFrame = window.requestAnimationFrame(render);
}

function stopRenderer() {
    rendering = false;
    window.cancelAnimationFrame(animationFrame);
    console.log("Renderer stopped");
}

function startRenderer() {
    rendering = true;
    animationFrame = window.requestAnimationFrame(render);
}
function somethingFuckedUp() {
    console.error("Something fucked up");
    updateParagraphText("The gods are having problems... Try again?");
    enableRollButton();
}
let runningOffset = 0;
const blockedTags = {"a":true,"some":true};
function loadImage(searchName,callback) {
    const splitReuslt = searchName.split(" ");
    if(splitReuslt.length > 1) {
        searchName = splitReuslt.filter(item=>{
            return !blockedTags[item];
        });
    }
    const processData = data => {
        console.log(`Search name: ${searchName}`);
        const image = data.items[(Math.floor(Math.random() * data.items.length) + runningOffset) % data.items.length]["media"]["m"].replace("_m", "_b");
        runningOffset++;
        callback(image);
    }
    $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",{
        tags: searchName,
        tagmode: "any",
        format: "json"
    },processData).catch(somethingFuckedUp);
}

const updateParagraphText = text => {
    subtitle.textContent = text;
}
let aMemeIsSet = false;

const verbs = [
    "fuck",
    "eat",
    "shoot",
    "destroy",
    "talk",
    "walk",
    "touch",
    "fire",
    "lick",
    "smile to",
    "please",
    "befriend",
    "anger",
    "congratulate",
    "consider",
    "run",
    "drown",
    "shave",
    "explode",
    "slurp",
    "exhale",
    "inhale",
    "tickle",
    "free",
    "jail",
    "slave",
    "yeet",
    "greet",
    "slap",
    "hug",
    "kiss",
    "kick",
    "bounce",
    "leave",
    "ditch",
    "join",
    "show",
    "smoke",
    "grow",
    "sleep",
    "win",
    "lose",
    "tie",
    "fly"
];
const subjectsPlural = [
    "bitches",
    "dogs",
    "babies",
    "zebras",
    "friends",
    "parents",
    "money",
    "fame",
    "fortune",
    "hemorrhoids",
    "fire",
    "hipsters",
    "vegans",
    "dinosaurs",
    "birds",
    "cats",
    "mormons",
    "churches",
    "christians",
    "children",
    "kids",
    "ghosts",
    "questions",
    "confusion",
    "trees",
    "mountains",
    "lakes",
    "rivers",
    "ugly",
    "pretty",
    "goats",
    "lions",
    "homosexuals",
    "lesbians",
    "gay pride",
    "legislation",
    "revenge",
    "doctors",
    "nurses",
    "corns",
    "fruit",
    "meat",
    "vegetables",
    "monsters",
    "diseases",
    "jobs",
    "schools",
    "science",
    "drugs",
    "cocaine",
    "thc",
    "weed",
    "alchohol",
    "compliments",
    "drunk",
    "high",
    "slutty",
    "poor"
];
const subjectsSingular = [
    "a dog",
    "some money",
    "a car",
    "a meal",
    "a big problem",
    "a hemorrhoid",
    "a fire",
    "a bad time",
    "some danger",
    "a ghost",
    "a mouse",
    "a question",
    "a daddy",
    "a father",
    "a mother",
    "a mom",
    "a gift",
    "a nice time",
    "aids",
    "death",
    "carl",
    "dave",
    "a tree",
    "a mountain",
    "a goat",
    "a gay",
    "a lesbian",
    "a homosexual",
    "a corn",
    "a dildo",
    "a job",
    "a school"
];
const anySubject = [...subjectsPlural,...subjectsSingular];

const memeTypes = [
    "VS-GO",
    "bSorV"
];

const getAnySubject = () => {
    return anySubject[Math.floor(Math.random()*anySubject.length)];
}
const getAnyPluralSubject = () => {
    return subjectsPlural[Math.floor(Math.random() * subjectsPlural.length)];
}
const getAnyVerb = () => {
    return verbs[Math.floor(Math.random()*verbs.length)];
}
const getAnySubjectSingular = () => {
    return subjectsSingular[Math.floor(Math.random()*subjectsSingular.length)];
}

const getRandomMeme = () => {
    const type = memeTypes[Math.floor(Math.random() * memeTypes.length)];
    const meme = {
        topLine: "",
        bottomLine: "",
        subject: getAnySubject()
    }
    switch(type) {
        default:
        case "VS-GO": {
                meme.topLine = `${getAnyVerb()} ${meme.subject}`;
                const s2 = getAnySubject();
                meme.bottomLine = `get ${s2}`;
            }
            break;
        case "bSorV": {
                meme.topLine = `be ${meme.subject}`;
                if(Math.random() > 0.5) {
                    const s2 = getAnySubjectSingular();
                    meme.bottomLine = `or be ${s2}`;
                } else {
                    meme.bottomLine = `or ${getAnyVerb()}`;
                }
            }
            break;
    }
    meme.topLine = meme.topLine.toUpperCase();
    meme.bottomLine = meme.bottomLine.toUpperCase();
    return meme;
}

const drawMemeText = (text,x,isTop) => {
    const size = 45;
    const antiMargin = 10;
    let y;
    if(isTop) {
        y = size - antiMargin;
    } else {
        y = fullHeight - size + antiMargin;
    }
    context.font = `${size}px impact`;
    context.textBaseline = "middle"; 
    context.textAlign = "center";
    context.strokeStyle = "black";
    context.lineWidth = 3;
    context.strokeText(text,x,y);
    context.fillStyle = "white";
    context.fillText(text,x,y);
}

const setAMeme = () => {
    if(aMemeIsSet) {
        startRenderer();
    }
    updateParagraphText("The gods are thinking...");
    const meme = getRandomMeme();
    loadImage(meme.subject,imageUrl => {
        const imageElement = new Image();
        imageElement.onerror = somethingFuckedUp;
        imageElement.onload = () => {
            stopRenderer();
            context.fillStyle = "white";
            context.fillRect(0,0,fullWidth,fullHeight);
            const ratio = imageElement.width / imageElement.height;
            if(ratio > 1) {
                const adjustedWidth = imageElement.width / (imageElement.height / fullHeight);
                const x = (fullWidth - adjustedWidth) / 2;
                if(x > 0) {
                    const adjustedHeight = imageElement.height / (imageElement.width / fullWidth);
                    const y = (fullHeight - adjustedHeight) / 2;
                    context.drawImage(
                        imageElement,0,0,imageElement.width,imageElement.height,
                        0,y,fullWidth,adjustedHeight
                    );
                } else {
                    context.drawImage(
                        imageElement,0,0,imageElement.width,imageElement.height,
                        x,0,adjustedWidth,fullHeight
                    );
                }
            } else {
                const adjustedHeight = imageElement.height / (imageElement.width / fullWidth);
                const y = (fullHeight - adjustedHeight) / 2;
                if(y > 0) {
                    const adjustedWidth = imageElement.width / (imageElement.height / fullHeight);
                    const x = (fullWidth - adjustedWidth) / 2;
                    context.drawImage(
                        imageElement,0,0,imageElement.width,imageElement.height,
                        x,0,adjustedWidth,fullHeight
                    );
                } else {
                    context.drawImage(
                        imageElement,0,0,imageElement.width,imageElement.height,
                        0,y,fullWidth,adjustedHeight
                    );
                }
            }
            drawMemeText(meme.topLine,halfWidth,true);
            drawMemeText(meme.bottomLine,halfWidth,false);
            updateParagraphText("The gods have spoken");
            enableRollButton();
            aMemeIsSet = true;
        };
        try {
            imageElement.src = imageUrl;
        } catch(error) {
            console.log(error);
            somethingFuckedUp();
        }
    });
}

rollButton.addEventListener("click",()=>{
    if(!rollButtonEnabled) {
        return;
    }
    disableRollButton();
    setAMeme();
});

startRenderer();

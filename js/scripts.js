console.log("Lets write javascripts")
let songs=[]
async function getsongs(folder) {
    currFolder=folder
    let a = await fetch(`http://127.0.0.1:3000/${currFolder}/`)
    let response = await a.text()
    // console.log(response)   
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    // console.log(as)
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
    let clean = decodeURIComponent(element.href).replace(/\\/g, "/")
    songs.push(clean.split("/").pop())
}
        // console.log(songs)
    }
     let songUl = document.querySelector(".playlist").getElementsByTagName("ul")[0]
     songUl.innerHTML=""
    for (const element of songs) {
        let name = decodeURIComponent(element).trim().replaceAll("_", " ")
        songUl.innerHTML = songUl.innerHTML + `
        <li>
                <div class="info">
                  <div>${name}</div>
                  <div>Kamran Ali</div>
                </div>
                <div class="GreenPlay">
                <img src="Assets/play-button.svg" alt="" />
                <div class="playnow">Play Now</div>
                </div>
              </li>
              `

    }
    Array.from(document.querySelector(".playlist").getElementsByTagName("li")).forEach((e, i) => {
    e.addEventListener("click", () => {
        playMusic(songs[i])
    })
})
return songs
}
let currentSong = new Audio()
const playMusic = (track, pause=false) => {
    // let audio=new Audio("/songs/"+track)
    currentSong.src = `/${currFolder}/` + track
    if (!pause) {
        currentSong.play()
        play.src = "Assets/pause-button.svg"
    }
    else{
        play.src="Assets/play-button.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

}
function formatTime(time) {
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);

    // Add leading zero if seconds < 10
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return `${minutes}:${seconds}`;
}
let currFolder;async function displayAlbum() {
    let a = await fetch(`http://127.0.0.1:3000/songs/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response

    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".card-container")
    let cardsHTML = ""                       // accumulate here

    for (let e of anchors) {
        let clean = decodeURIComponent(e.href).replace(/\\/g, "/")

        if (clean.includes("/songs/") && !clean.endsWith(".mp3")) {
            let parts = clean.split("/").filter(Boolean)
            let folder = parts[parts.length - 1]

            if (folder && folder !== "songs" && !folder.includes(":")) {
                try {
                    let res = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)
                    let info = await res.json()

                    cardsHTML += `
                    <div data-folder="${folder}" class="card">
                        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"
                             viewBox="0 0 100 100" class="play">
                            <circle cx="50" cy="50" r="45" fill="#1ED760" />
                            <path d="M40 30 L40 70 L72 50 Z" fill="white" />
                        </svg>
                        <img src="/songs/${folder}/cover.jpg" alt="" />
                        <h2>${info.title}</h2>
                        <p>${info.discription}</p>
                    </div>`
                } catch (err) {
                    console.warn(`Skipping "${folder}" — no valid info.json`, err)
                }
            }
        }
    }

    cardContainer.innerHTML = cardsHTML       // set ONCE, after the loop
}
async function main() {
    await getsongs("songs/ncs")
    playMusic(songs[0],true)
    // console.log(songs)
    displayAlbum()
   

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "Assets/pause-button.svg"
        }
        else {
            currentSong.pause()
            play.src = "Assets/play-button.svg"
        }
    })
    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration)
        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`
        document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100+"%"
    })

    document.querySelector(".seekbar").addEventListener("click",e=>{
        let per= (e.offsetX/e.target.getBoundingClientRect().width)*100
        document.querySelector(".circle").style.left=per+"%"
        currentSong.currentTime=((currentSong.duration)*per)/100
    })
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0"
    })
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-100%"
    })
  previous.addEventListener("click", () => {
    let current = decodeURIComponent(currentSong.src.split("/").pop())   // decode + filename only
    let index = songs.indexOf(current)
    if (index - 1 >= 0) {
        playMusic(songs[index - 1])
    }
})
next.addEventListener("click", () => {
    let current = decodeURIComponent(currentSong.src.split("/").pop())
    let index = songs.indexOf(current)
    if (index + 1 < songs.length) {
        playMusic(songs[index + 1])
    }
})

let volumeSlider = document.getElementById("volumeside");

currentSong.volume = volumeSlider.value / 100;

volumeSlider.addEventListener("input", () => {
    currentSong.volume = volumeSlider.value / 100;
    // console.log(volumeSlider.value + "%");
});
document.querySelector(".card-container").addEventListener("click", async e => {
    let card = e.target.closest(".card")
    if (!card) return
    await getsongs(`songs/${card.dataset.folder}`)
    playMusic(songs[0], true)
})
document.querySelector(".volume> img").addEventListener("click",e=>{
    console.log(e.target)
    if (e.target.src.includes("Assets/volume.svg"))
    {
        e.target.src=e.target.src.replace("Assets/volume.svg","Assets/mute.svg")
        currentSong.volume=0
        volumeSlider.value=0

    }
    else{
         e.target.src=e.target.src.replace("Assets/mute.svg","Assets/volume.svg")
        currentSong.volume=0.10
        volumeSlider.value=10

    }
})
}
main()
console.log("Lets write javascripts")
async function getsongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/")
    let response = await a.text()
    // console.log(response)   
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    // console.log(as)
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("songs%5C")[1])

        }
        // console.log(songs)
    }
    return songs
}
let currentSong = new Audio()
const playMusic = (track, pause=false) => {
    // let audio=new Audio("/songs/"+track)
    currentSong.src = "/songs/" + track
    if (!pause) {
        currentSong.play()
        play.src = "pause-button.svg"
    }
    else{
        play.src="play-button.svg"
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
let song;
async function main() {
    song = await getsongs()
   
    playMusic(song[0],true)
    // console.log(song)
    let songUl = document.querySelector(".playlist").getElementsByTagName("ul")[0]
    for (const element of song) {
        let name = decodeURIComponent(element).trim().replaceAll("_", " ")
        songUl.innerHTML = songUl.innerHTML + `
        <li>
                <div class="info">
                  <div>${name}</div>
                  <div>Kamran Ali</div>
                </div>
                <div class="GreenPlay">
                <img src="play-button.svg" alt="" />
                <div class="playnow">Play Now</div>
                </div>
              </li>
              `

    }
    Array.from(document.querySelector(".playlist").getElementsByTagName("li")).forEach((e, i) => {
    e.addEventListener("click", () => {
        playMusic(song[i])
    })
})

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "pause-button.svg"
        }
        else {
            currentSong.pause()
            play.src = "play-button.svg"
        }
    })
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration)
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
    previous.addEventListener("click",()=>{
        let index=song.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index-1)>=0)
        {
            playMusic(song[index-1])

        }
    })
    next.addEventListener("click",()=>{
        let index=song.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index+1)<song.length)
        {
            playMusic(song[index+1])

        }
    })
}
main()
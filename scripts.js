console.log("Lets write javascripts")
async function getsongs() {
    let a=await fetch("http://127.0.0.1:3000/songs/")
    let response=await a.text()
    // console.log(response)   
    let div=document.createElement("div")
    div.innerHTML=response;
    let as=div.getElementsByTagName("a")
    // console.log(as)
    let songs=[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3"))
        {
            songs.push(element.href.split("songs%5C")[1])
            
        }
        console.log(songs)
    }
    return songs
}
async function main() {
    let song=await getsongs()
    console.log(song)
    let songUl = document.querySelector(".playlist").getElementsByTagName("ul")[0]
    for (const element of song) {
        let name = decodeURIComponent(element).trim().replaceAll("_", " ")
        songUl.innerHTML=songUl.innerHTML + `
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
    var audio=new Audio(song[0])
    // audio.play()                           
}
main()
console.log("Lets write javascripts")
async function getsongs() {
    let a=await fetch("http://127.0.0.1:3002/songs/")
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
        songUl.innerHTML=songUl.innerHTML + `<li>${element.replaceAll("%20", " ")}</li>`
        
    }
    var audio=new Audio(song[0])
    // audio.play()                           
}
main()
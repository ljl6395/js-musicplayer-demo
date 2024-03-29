// var currentIndex = 0
// var audio = new Audio()
// var musicList = []
// audio.autoplay = true

// getMusicList(function(list){
//     musicList = list
//     loadMusic(list[currentIndex])
// })

// audio.ontimeupdate = function(){
//     // console.log(this.currentTime)
//     $('.musicbox .progress-now').style.width = (this.currentTime/this.duration)*100 + '%'
   
// }
// audio.onplay = function(){
//     clock = setInterval(function(){
//         var min = Math.floor(audio.currentTime/60)
//         var sec = Math.floor(audio.currentTime)%60 + ''
//         sec = sec.length === 2? sec : '0' + sec
//         $('.musicbox .time').innerText = min + ':' + sec
//     },1000)
// }
// audio.onpause = function(){
//     clearInterval(clock)
// }

// audio.onended = function(){
//     currentIndex = (++currentIndex)%musicList.length
//     console.log(currentIndex)
//     loadMusic(musicList[currentIndex])
// }

// $('.musicbox .play').onclick = function(){
//     if(audio.paused){
//         audio.play()
//         this.querySelector('.fa').classList.add('fa-pause')
//         this.querySelector('.fa').classList.remove('fa-play')
//     }else{
//         audio.pause()
//         this.querySelector('.fa').classList.remove('fa-pause')
//         this.querySelector('.fa').classList.add('fa-play')
//     }
// }

// $('.music .forward').onclick = function(){
//     currentIndex = (++currentIndex)%musicList.length
//     console.log(currentIndex)
//     loadMusic(musicList[currentIndex])
    
// }

// $('.music .back').onclick = function(){
//     currentIndex = (musicList.length + --currentIndex)%musicList.length
//     console.log(currentIndex)
//     loadMusic(musicList[currentIndex])
// }

// $('.musicbox .bar').onclick = function(e){
//     console.log(e)
//     var percent = e.offsetX / parseInt(getComputedStyle(this).width)
//     console.log(percent)
//     audio.currentTime = audio.duration * percent
// }

// function $(selector){
//     return document.querySelector(selector)
// }
// function getMusicList(callback){
//     var xhr = new XMLHttpRequest()
//     xhr.open('GET','/music.json',true)
//     xhr.onload = function(){
//         if((xhr.status >= 200 && xhr.status < 300)|| xhr.status ===304){
//             callback(JSON.parse(this.responseText))
//         }else {
//             console.log('获取数据失败')
//         }
//     }
//     xhr.onerror = function(){
//         console.log('网络异常')
//     }
//     xhr.send()
// }

// function loadMusic(musicObj){
//     console.log('begin play',musicObj)
//     $('.musicbox .title').innerText = musicObj.title
//     $('.musicbox .author').innerText = musicObj.author
//     $('.cover').style.backgroundImage = 'url('+ musicObj.img +')'
//     audio.src = musicObj.src
    
// }


var cover = document.querySelector('.cover')
    var backBtn = document.querySelector('.musicbox .back')
    var playBtn = document.querySelector('.musicbox .play')
    var forwardBtn = document.querySelector('.musicbox .forward')
    var titleNode = document.querySelector('.musicbox .title')
    var authorNode = document.querySelector('.musicbox .author')
    var timeNode = document.querySelector('.musicbox .time')
    var progressBarNode = document.querySelector('.musicbox .progress .bar')
    var progressNowNode = document.querySelector('.musicbox .progress-now')
    var musicListContainer = document.querySelector('.musicbox .list')
    var timer
    var musicList
    var music = new Audio()
    music.autoplay = true
    var musicIndex = 0
    getMusic(function(list){
      musicList = list
      setPlaylist(list)
      loadMusic(list[musicIndex])
    })
    
    playBtn.onclick = function() {
      var icon = this.querySelector('.fa')
      if (icon.classList.contains('fa-play')) {
        music.play()
      } else {
        music.pause()
      }
      icon.classList.toggle('fa-play')
      icon.classList.toggle('fa-pause')
    }
    forwardBtn.onclick = loadNextMusic
    backBtn.onclick = loadLastMusic
    music.onended = loadNextMusic
    music.shouldUpdate = true
    music.onplaying = function() {
      timer = setInterval(function() {
        updateProgress()
      }, 1000)
      console.log('play')
    }
    music.onpause = function() {
        console.log('pause')
        clearInterval(timer)
      }
    music.ontimeupdate = updateProgress
    progressBarNode.onclick = function(e) {
      var percent = e.offsetX / parseInt(getComputedStyle(this).width)
      music.currentTime = percent * music.duration
      progressNowNode.style.width = percent * 100 + "%"
    }
    musicListContainer.onclick = function(e){
      if(e.target.tagName.toLowerCase() === 'li'){
        for(var i = 0; i < this.children.length; i++){
          if(this.children[i] === e.target){
            musicIndex = i
          }
        }
        console.log(musicIndex)
        loadMusic(musicList[musicIndex])
      }
    }
    //fa-li fa fa-spinner fa-spin
    function setPlaylist(musicList){
      var container = document.createDocumentFragment()
      musicList.forEach(function(musicObj){
        var node = document.createElement('li')
        node.innerText = musicObj.author + '-' + musicObj.title
        console.log(node)
        container.appendChild(node)
      })
      musicListContainer.appendChild(container)
    }
    function loadMusic(songObj) {
      music.src = songObj.src
      titleNode.innerText = songObj.title
      authorNode.innerText = songObj.author
      cover.style.backgroundImage = 'url(' + songObj.img + ')'
      for(var i = 0; i < musicListContainer.children.length; i++){
        musicListContainer.children[i].classList.remove('playing')
      }
      musicListContainer.children[musicIndex].classList.add('playing')
    }
    function loadNextMusic() {
      musicIndex++
      musicIndex = musicIndex % musicList.length
      loadMusic(musicList[musicIndex])
    }
    function loadLastMusic() {
      musicIndex--
      musicIndex = (musicIndex + musicList.length) % musicList.length
      loadMusic(musicList[musicIndex])
    }
    function updateProgress() {
      var percent = (music.currentTime / music.duration) * 100 + '%'
      progressNowNode.style.width = percent
      var minutes = parseInt(music.currentTime / 60)
      var seconds = parseInt(music.currentTime % 60) + ''
      seconds = seconds.length == 2 ? seconds : '0' + seconds
      timeNode.innerText = minutes + ':' + seconds
    }
    function getMusic(callback) {
      var xhr = new XMLHttpRequest()
      xhr.open('get', 'music.json', true)
      xhr.send()
      xhr.onload = function() {
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
          callback(JSON.parse(xhr.responseText))
        }
      }
    }

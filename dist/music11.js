const ap = new APlayer({
    container: document.getElementById('aplayer'),
    fixed: true,
    autoplay: false,
    audio: [
      {
        name: "A39868.mp3",
        artist: 'A39868',
        url: 'http://up.mcyt.net/?down/39868.mp3',
        cover: 'http://oeff2vktt.bkt.clouddn.com/image/84.jpg',
      },
      {
        name: 'B45967.mp3',
        artist: 'B45967',
        url: 'http://up.mcyt.net/?down/45967.mp3',
        cover: 'http://oeff2vktt.bkt.clouddn.com/image/8.jpg',
      },
      {
        name: 'C46644.mp3',
        artist: 'C46644',
        url: 'http://up.mcyt.net/?down/46644.mp3',
        cover: 'http://oeff2vktt.bkt.clouddn.com/image/96.jpg',
      }
    ]
});
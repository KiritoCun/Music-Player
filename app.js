const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8_PLAYER'

const player = $('.player')
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');
const app = {
    currentIndex:0,
    isPlaying:false,
    isRandom:false,
    isRepeat:false,
    config:JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: "Đường tôi chở em về",
            singer: "Bùi Trường Linh",
            path: "/assets/audios/DuongTaChoEmVe-buitruonglinh-6318765.mp3",
            image:"./assets/images/duong_toi_cho_em_ve.jpg"
        },
        {
          name: "Cữ ngỡ là anh",
          singer: "Đinh Tùng Huy",
          path: "./assets/audios/Cu Ngo La Anh - Dinh Tung Huy.mp3",
          image: "./assets/images/cu_ngo_la_anh.jpg"
        },
        {
          name: "Dễ đến dễ đi",
          singer: "Quang Hùng MasterD",
          path: "./assets/audios/De Den De Di - Quang Hung MasterD.mp3",
          image: "./assets/images/de_den_de_di.jpg"
        },
        {
          name: "Đừng lo anh đợi mà",
          singer: "Mr Siro",
          path: "./assets/audios/Dung Lo Anh Doi Ma - Mr Siro.mp3",
          image: "./assets/images/dung_lo_anh_doi_ma.jpg"
        },
        {
          name: "Không cần thêm một ai nữa",
          singer: "Mr Siro",
          path: "/assets/audios/Khong Can Them Mot Ai Nua - Mr Siro.mp3",
          image:"./assets/images/khong_can_them_mot_ai_nua.jpg"
        },
        {
          name: "Lẻ Loi",
          singer: "Châu Đăng Khoa",
          path: "/assets/audios/Le Loi - Chau Dang Khoa.mp3",
          image:"./assets/images/le_loi.jpg"
        },
        {
          name: "Níu Duyên Remix",
          singer: "Lê Bảo Bình x Dj.Dai M",
          path:"/assets/audios/Niu Duyen Remix_ - Le Bao Binh_ DJ Dai M.mp3",
          image:"./assets/images/niu_duyen.jpg"
        },
        {
          name: "Thời gian sẽ trả lời",
          singer: "Justatee",
          path: "/assets/audios/Thoi Gian Se Tra Loi DJ Beat U___ Remix_.mp3",
          image:"./assets/images/thoi_gian_se_tra_loi.jpg"
        },
        {
          name: "Tình sầu thiên thu muốn lối",
          singer: "Doãn Hiếu",
          path: "/assets/audios/Tinh Sau Thien Thu Muon Loi - Doan Hieu.mp3",
          image:"./assets/images/tinh_sau_thien_thu_muon_loi.jpg"
        },
        {
          name: "Tình Yêu đẹp nhất",
          singer: "Bình Minh Vũ",
          path: "/assets/audios/Tinh Yeu Dep Nhat - Binh Minh Vu.mp3",
          image:"./assets/images/tinh_yeu_dep_nhat.jpg"
        },
        {
          name: "Từng yêu",
          singer: "Phan Duy Anh",
          path: "/assets/audios/Tung Yeu - Phan Duy Anh.mp3",
          image:"./assets/images/tung_yeu.jpg"
        }
      ],
    setConfig: function(key,value){
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function(){
        const htmls = this.songs.map((song,index)=> {
            return `<div class="song ${index === this.currentIndex ? 'active' : ''}"data-index="${index}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>`
        })
        playlist.innerHTML = htmls.join('');
    },
    defineProperties:function(){
        Object.defineProperty(this,'currentSong',{
            get:function(){
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvents: function(){
        const _this = this;
        const cdWidth = cd.offsetWidth;

        // Xử lý CD quay và dừng
        const cdThumbAnimate = cdThumb.animate([{
            transform:'rotate(360deg'
        }], {
            duration:10000, //10 seconds
            iterations:Infinity
        });
        cdThumbAnimate.pause();
        // Xử lý phóng to, thu nhỏ CD
        document.onscroll = function(){
            const scrollTop = (window.scrollY || document.documentElement.scrollTop)
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth/cdWidth;
        }
        // Xử lý khi click play
        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause();
            } else{
                audio.play();
            }
        }
        // Khi song được play
        audio.onplay = function(){
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }
        // Khi song bị pause
        audio.onpause = function(){
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        } 
        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime/audio.duration *100);
                progress.value = progressPercent;
            }
        }
        // Xử lý khi tua song 
        progress.onchange = function(e){
            const seekTime = audio.duration/100 * e.target.value;
            audio.currentTime = seekTime;
        }
        // Khi next song
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong();
            } else{
            _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }
        // Khi prev song
        prevBtn.onclick = function(){
            if(isRandom){
                _this.playRandomSong();
            } else{
            _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }
        // Xử lý bật tắt random song
        randomBtn.onclick = function(){
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom',_this.isRandom);
            randomBtn.classList.toggle('active',_this.isRandom);
        }
        // Xử lý lặp lại một song
        repeatBtn.onclick = function(){
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat',_this.isRepeat);
            repeatBtn.classList.toggle('active',_this.isRepeat);
        }
        // Xử lý next song khi audio ended
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play();
            } else{
                nextBtn.click();
            }
        }
        // Lắng nghe hành vi click vào playlist
        playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)');
            if(songNode || e.target.closest('.option')){
            // Xử lý khi click vào song
                if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                } 
                //Xử lý khi click vào song option
                if(e.target.closest('.option')){

                }
            }
        }
    },
    scrollToActiveSong: function(){
        setTimeout(function(){
            $('.song.active').scrollIntoView({
                behavior:'smooth',
                block:'nearest'
            });
        },300);
        
    },
    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    loadConfig: function(){
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    nextSong: function(){
        this.currentIndex++;
        if(this.currentIndex>=this.songs.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function(){
        this.currentIndex--;
        if(this.currentIndex<0){
            this.currentIndex = this.songs.length-1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function(){
        let newIndex;
        do{
            newIndex = Math.floor(Math.random() * (this.songs.length))
        } while(this.currentIndex === newIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function(){
        // Gán cấu hình từ config vào ứng dụng
        this.loadConfig();

        // Định nghĩa các thuộc tính cho Object
        this.defineProperties();

        // Lắng nghe và xử lý các sự kiện (DOM events)
        this.handleEvents();

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();

        // Render playlist
        this.render();

        // Hiển thị trạng thái ban đầu của button repeat và random
        randomBtn.classList.toggle('active',this.isRandom);
        repeatBtn.classList.toggle('active',this.isRepeat);
    },

}

app.start();

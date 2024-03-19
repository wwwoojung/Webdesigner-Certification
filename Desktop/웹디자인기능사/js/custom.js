
// 1. fade slide
// window.onload = function () {
//     let currentindex = 0;
//     const Slide = document.querySelectorAll(".NainVisual .visual_slide .slide_wrapper>.slide");

//     setInterval(() => {
//         let nextindex = (currentindex + 1) % Slide.length;

//         Slide[currentindex].classList.remove('on');
//         Slide[nextindex].classList.add('on')

//         currentindex = nextindex;
//     }, 3000)
// } 


// 2. 가로슬라이드

window.onload = function () {
    let currentindex = 0;
    const SlideWrapper = document.querySelector('.NainVisual .visual_slide .slide_wrapper');
    const SlideClone = SlideWrapper.firstElementChild.cloneNode(true);
    SlideWrapper.appendChild(SlideClone);

    setInterval(() => {
        currentindex++;
        SlideWrapper.style.marginLeft = -currentindex * 100 + "%";
        SlideWrapper.style.transition = "all 0.6s";
        // SlideWrapper.style.marginLeft = `${-currentindex * 100}%`;

        if (currentindex == 3) {
            setTimeout(() => {
                SlideWrapper.style.transition = "0s"; //애니메이션 정지
                SlideWrapper.style.marginLeft = "0";  //이미지 위치 초기화
                currentindex = 0;   //현재 이미지 초기화
            }, 700)
        }
    }, 3000)
}
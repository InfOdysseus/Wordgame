
//TODO
//인원수제한(게임시작조건)
//다시시작
//이름은 처음에 한번만 입력, 혹은 서버에서 정해줄 것
//채팅 '방'구현 -> 방마다 동일한 초성, 탈락시 퇴출
//추가 규칙 구현

const arr = [ 'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ' ];     //쌍자음 삭제
const randomWord = document.querySelector("#randomword")
console.log(arr)
let criticWord = arr[Math.floor(Math.random() * arr.length)]+arr[Math.floor(Math.random() * arr.length)]
randomWord.innerHTML = criticWord

var socket = io.connect('http://192.168.35.245'); //io.connect('http://192.168.35.245')



// 서버 접속
socket.on( 'connect', function() {
  socket.emit( 'my event', {
    data: 'User Connected'
  } )
  var form = $( 'form' ).on( 'submit', function( e ) {
    e.preventDefault()
    let user_name = $( 'input.username' ).val()
    let user_input = $( 'input.message' ).val()

    socket.emit( 'my event', {
      user_name : user_name,
      message : user_input
    } )
    $( 'input.message' ).val( '' ).focus()
  } )
} )

function getFirst(src) {  //유저의 단어에서 초성 추출
  var iSound = '';
  for(var i=0; i<src.length; i++) {
    var index = Math.floor(((src.charCodeAt(i) - 44032) /28) / 21);
    if(index >= 0) {
      iSound += arr[index];
    } 
  }
  return iSound;
}

function xmlSuccess(xmlRst, msg){
  //xmlRst는 객체. 내용물을 보려면 consol.log(xmlRst)

  if(getFirst(msg.message)!=criticWord){    //초성 불일치
    $( 'h3' ).remove()
    $( 'div.message_holder' ).append( '<div>'+'초성과 다른 단어입니다!  '+'<b style="color: #000">'+msg.user_name+'</b>'+'님께서 탈락하셨습니다'+'</div>' )
    console.log(getFirst(msg.message))
    console.log(criticWord)
    alert(msg.user_name+'패배' + " : 초성과 맞지 않습니다")   //브라우저 경고창
    location.reload(true)   //새로고침
  }
  else{
    if(xmlRst.all[5].innerHTML > 0){      //적절한 단어
      $( 'h3' ).remove()
      $( 'div.message_holder' ).append( '<div><b style="color: #000">'+msg.user_name+'</b> '+msg.message+'</div>' )
      console.log(getFirst(msg.message))
    }
    else{       //초성은 동일하지만 존재하지 않는 단어
      $( 'h3' ).remove()
      $( 'div.message_holder' ).append( '<div>'+'<b style="color: #000">'+`\'${msg.message}\'` + '</b>'+' 라는 단어는 사전에 없는 단어입니다!  '+'<b style="color: #000">'+msg.user_name+'</b>'+'님께서 탈락하셨습니다'+'</div>' )
      //alert(msg.user_name+'패배' + " : 존재하지 않는 단어")
      //location.reload(true)
    }
  }
}

socket.on( 'my response', function( msg ) {
  console.log( 1, msg )
  if( typeof msg.user_name !== 'undefined' ) {    //단어를 입력받은 경우
    let data = $.ajax({ 
      type: "GET", 
    url: `https://stdict.korean.go.kr/api/search.do?key=58BF2069B566A253C8BADE473DEA85F7&q=${msg.message}`,     //국어사전 api
    success: (xml)=>{console.log("succes!"); xmlSuccess(xml, msg)},     //get호출에 오류가 없었을 시 함수 호출
    dataType: 'xml' 
    });
  }
}) 

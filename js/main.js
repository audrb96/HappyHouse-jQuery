
let map;
$(() => {

  let aptSet = new Set();
  let apts = {
    도로명 : aptSet
  };

  $.ajax({
    url: "https://grpc-proxy-server-mkvo6j4wsq-du.a.run.app/v1/regcodes?regcode_pattern=*00000000",
    type: "GET",
    contentType: "application/json;charset=utf-8",
    dataType: "json",
    success: (response) => {
      let citylist = ``;
      for (let i = 0; i < response.regcodes.length; i++) {
        citylist += `<li><a class="dropdown-item" name = "${response.regcodes[i].code}" href="#" >${response.regcodes[i].name}</a></li>`;
      }
      $("#city-list").empty().append(citylist);
    },
    error: (e) => {
      console.log(e);
    },
  });

  let doName = "";
  $(document).on("click", "#city-list li > a", (e) => {
    let code = e.target.name / 10 ** 8 + "*000000";
    doName = e.target.text;
    $("#dropdownMenuButton1").empty().text(e.target.text);
    console.log(`도/광역시 = ${e.target.text}`);
    $.ajax({
      url: `https://grpc-proxy-server-mkvo6j4wsq-du.a.run.app/v1/regcodes?regcode_pattern=${code}&is_ignore_zero=true`,
      type: "GET",
      contentType: "json",
      success: (response) => {
        let silist = ``;
        console.log(response);
        for (let i = 0; i < response.regcodes.length; i++) {
          let siName = response.regcodes[i].name;
          silist += `<li><a class="dropdown-item" name = "${
            response.regcodes[i].code
          }" href="#" >${siName.substring(
            doName.length,
            siName.length
          )}</a></li>`;
        }
        $("#si-list").empty().append(silist);
      },
      error: (e) => {
        console.log(e);
      },
    });
  });

  $(document).on("click", "#si-list li > a", (e) => {
    let code = e.target.name / 10 ** 6 + "*";
    let siName = e.target.text;
    $("#dropdownMenuButton2").empty().text(e.target.text);
    console.log(`시/군/구 = ${e.target.text}`);
    $.ajax({
      url: `https://grpc-proxy-server-mkvo6j4wsq-du.a.run.app/v1/regcodes?regcode_pattern=${code}&is_ignore_zero=true`,
      type: "GET",
      contentType: "json",
      success: (response) => {
        let donglist = ``;
        console.log(response);
        for (let i = 0; i < response.regcodes.length; i++) {
          let dongName = response.regcodes[i].name;
          donglist += `<li><a class="dropdown-item" name = "${
            response.regcodes[i].code
          }" href="#" >${dongName.substring(
            doName.length + siName.length + 1,
            dongName.length
          )}</a></li>`;
        }
        $("#dong-list").empty().append(donglist);
      },
      error: (e) => {
        console.log(e);
      },
    });
  });

  $(document).on("click", "#dong-list li > a", (e) => {
    $("#dropdownMenuButton3").empty().text(e.target.text);
    // 구현해야할 기능 3 시작
    console.log(`동 = ${e.target.text}`);
    //끝

    var ServiceKey =
      "suEl2XqtRg8fCmePwg203yb3PfeP26VcV7PMusAwhf95sNOkiUGRSncuwiUxCjn8ToHYpwksB3GrU8RFQe6mug==";
    var pageNo = "1";
    var numOfRows = "30";
    var LAWD_CD = e.target.name.substring(0, 5);
    var DEAL_YMD = "202012";
    // server에서 넘어온 data
    $.ajax({
      url: "http://openapi.molit.go.kr/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTradeDev",
      type: "GET",
      data: {
        ServiceKey: ServiceKey,
        pageNo: pageNo,
        numOfRows: numOfRows,
        LAWD_CD: LAWD_CD,
        DEAL_YMD: DEAL_YMD,
      },
      dataType: "xml",
      success: (response) => {
        console.log(response);
        let aptList = `<div style="font-size: 25px;">거래 정보</div>
        <hr>`;

        let lat="";
        let lng="";

        $(response)
          .find("item")
          .each(function () {
            let apt = $(this).find("아파트").text();
            let price = $(this).find("거래금액").text();
            let area = $(this).find("전용면적").text();
            let year = $(this).find("년").text();
            let month = $(this).find("월").text();
            let day = $(this).find("일").text();
            apts.도로명.add($(this).find("도로명").text());
            aptList += `<div><div class ="apt-name" name="${LAWD_CD}" style="font-size:20px;">${apt}</div> <div style="font-size:10px;">거래금액 : ${price}만원</div> <div style="font-size:10px;">면적 : ${area}</div><div style="font-size:8px;color:lightgray;">${year}. ${month}. ${day}</div></div><hr>`;
          });

        $("#trade-info").empty().append(aptList);
        $("#main").css("display", "none");
        $(".banner").css("display", "none");
        $("#map-main").css("display", "flex");

        $.get(
          "https://maps.googleapis.com/maps/api/geocode/json",
          {
            key: "AIzaSyC0-HJ8XQXXWU52TxrGLViCHP8o1plZhmo",
            address: `${$("#dropdownMenuButton1").text().trim()}+${$("#dropdownMenuButton2").text().trim()}+${e.target.text.trim()}`,
          },
          function (data, status) {        
                lat = data.results[0].geometry.location.lat;
                lng = data.results[0].geometry.location.lng;

                map = new google.maps.Map(document.getElementById("trade-map"), {
                  center: {
                  lat: lat,
                  lng: lng
                  },
                  zoom: 13
                  });
                  apts.도로명.forEach((item)=>{
                    $.get(
                      "https://maps.googleapis.com/maps/api/geocode/json",
                      {
                        key: "AIzaSyC0-HJ8XQXXWU52TxrGLViCHP8o1plZhmo",
                        address: `${$("#dropdownMenuButton1").text().trim()}+${$("#dropdownMenuButton2").text().trim()}+${e.target.text.trim()}+${item}`,
                      },
                      function(data,status){
                        let multimarker = {
                          coords: {lat : data.results[0].geometry.location.lat ,lng : data.results[0].geometry.location.lng},
                          iconImage : "img/my_position.png",
                          content : e.target.text
                      };
                      addMarker2(multimarker);
                      }
                    )
                  })                  
              },
          "json"
        );

      },

      error: function (xhr, status, msg) {
        console.log("상태값 : " + status + " Http에러메시지 : " + msg);
      },
    });
  });

  //index.html, 상단 헤더에 있는 Login 버튼을 눌렀을 때
  $("#login-btn").on("click", () => {
    document.getElementById("Pop").style.display =
      document.getElementById("Pop").style.display == "none"
        ? "inline"
        : "none";
  });

  $("#inner-login-btn").on("click", () => {
    let id = $("#login-id").val();
    let password = $("#login-password").val();
    let load_data = localStorage.getItem("info");
    let isLogin = false;
    let user_info = JSON.parse(load_data);

    for (let i = 0; i < user_info.user_id.length; i++) {
      if (user_info.user_id[i] == id && user_info.user_pw[i] == password) {
        isLogin = true;
        localStorage.removeItem("isLogin");
        localStorage.setItem("isLogin", id);
        console.log(`id = ${id}`);
        console.log(`password = ${password}`);
        console.log("login");
        break;
      }
    }
    if (isLogin) {
      document.getElementById("Pop").style.display = "none";
      $("#find-around").css("display", "");
      $("#interested-region").css("display", "");
      $("#interested-around").css("display", "");
      $("#login-btn").css("display", "none");
      $("#logout-btn").css("display", "");
      $("#signUp-btn").css("display", "none");
      $("#user-info").css("display", "");
    } else {
      alert("다시 시도 해주세요.");
    }
  });

  if (localStorage.getItem("isLogin")) {
    document.getElementById("Pop").style.display = "none";
    $("#find-around").css("display", "");
    $("#interested-region").css("display", "");
    $("#interested-around").css("display", "");
    $("#login-btn").css("display", "none");
    $("#logout-btn").css("display", "");
    $("#signUp-btn").css("display", "none");
    $("#user-info").css("display", "");
  }

  $("#logout-btn").on("click", () => {
    $("#find-around").css("display", "none");
    $("#interested-region").css("display", "none");
    $("#interested-around").css("display", "none");
    $("#login-btn").css("display", "");
    $("#logout-btn").css("display", "none");
    $("#signUp-btn").css("display", "");
    $("#user-info").css("display", "none");

    localStorage.removeItem("isLogin");
    console.log("logout");
  });

  // 회원정보 버튼 클릭
  $("#user-info").on("click", () => {
    location.href = "./userinfo.html";
  });

  let user_info_text = $("#userinfo-title").text();
  if (user_info_text) {
    let load_data = localStorage.getItem("info");
    let user_info = JSON.parse(load_data);
    let login_id = localStorage.getItem("isLogin");

    for (let i = 0; i < user_info.user_id.length; i++) {
      if (user_info.user_id[i] == login_id) {
        $("#user-info-id").append(`<p>${user_info.user_id[i]}</p>`);
        $("#user-info-pw").append(`<p>${user_info.user_pw[i]}</p>`);
        $("#user-info-name").append(`<p>${user_info.user_name[i]}</p>`);
        $("#user-info-email").append(`<p>${user_info.user_email[i]}</p>`);
        $("#user-info-col").append(`<p>${user_info.user_colNum[i]}</p>`);
        break;
      }
    }
  }
  $(document).on("click", ".apt-name", (e) => {
    let aptName = e.target.innerText;
    var ServiceKey =
      "suEl2XqtRg8fCmePwg203yb3PfeP26VcV7PMusAwhf95sNOkiUGRSncuwiUxCjn8ToHYpwksB3GrU8RFQe6mug==";
    var pageNo = "1";
    var numOfRows = "30";
    var LAWD_CD = e.target.getAttribute("name");
    var DEAL_YMD = "202012";
    $.ajax({
      url: "http://openapi.molit.go.kr/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTradeDev",
      type: "GET",
      data: {
        ServiceKey: ServiceKey,
        pageNo: pageNo,
        numOfRows: numOfRows,
        LAWD_CD: LAWD_CD,
        DEAL_YMD: DEAL_YMD,
      },
      dataType: "xml",
      success: (response) => {
        let road;
        let aptList = `<div style="font-size: 25px;">거래 정보</div>
        <hr>`;
        $(response)
          .find("item")
          .each(function () {
            let apt = $(this).find("아파트").text();
            let price = $(this).find("거래금액").text();
            let area = $(this).find("전용면적").text();
            let year = $(this).find("년").text();
            let month = $(this).find("월").text();
            let day = $(this).find("일").text();
            


            if (aptName == apt) {
              console.log("hhha");
              road = $(this).find("도로명").text();
              aptList += `<div><div class ="apt-name" name=${LAWD_CD} style="font-size:20px;">${apt}</div> <div style="font-size:10px;">거래금액 : ${price}만원</div> <div style="font-size:10px;">면적 : ${area}</div><div style="font-size:8px;color:lightgray;">${year}. ${month}. ${day}</div></div><hr>`;
            }
          });
        $("#trade-info").empty().append(aptList);
        $("#main").css("display", "none");
        $(".banner").css("display", "none");
        $("#map-main").css("display", "flex");
        

        deleteMarkers();
        
        apts.도로명.forEach((item)=>{
          if(road == item){
            $.get(
              "https://maps.googleapis.com/maps/api/geocode/json",
              {
                key: "AIzaSyC0-HJ8XQXXWU52TxrGLViCHP8o1plZhmo",
                address: `${$("#dropdownMenuButton1").text().trim()}+${$("#dropdownMenuButton2").text().trim()}+${$("#dropdownMenuButton3").text()}+${item}`,
              },
              function(data,status){
                let multimarker = {
                  coords: {lat : data.results[0].geometry.location.lat ,lng : data.results[0].geometry.location.lng},
                  iconImage : "img/my_position.png",
                  content : e.target.text
              };
              addMarker2(multimarker);
              }
            )
          }
        })

      },
      error: function (xhr, status, msg) {
        console.log("상태값 : " + status + " Http에러메시지 : " + msg);
      },
    });
  });
});

// 회원가입 위한 함수 시작
function signUp() {
  let id = $("#inputId");
  let pw = $("#inputPassword");
  let name = $("#inputUserName");
  let email = $("#inputEmail");
  let colNum = $("#inputColNum");

  //빈 곳이 있으면 다 채우라고 하기
  if (!id.val() || !pw.val() || !name.val() || !email.val() || !colNum.val()) {
    alert("빈 항목을 채워주세요");
    return;
  }
  //json으로 변환해서 localstorage에 넣어주기 위해, 여러 데이터를 넣기 위해 배열로함
  let info = {
    user_id: [id.val()],
    user_pw: [pw.val()],
    user_name: [name.val()],
    user_email: [email.val()],
    user_colNum: [colNum.val()],
  };

  let info_json = JSON.stringify(info);
  let load_data = localStorage.getItem("info");

  if (load_data) {
    //기존에 localstorage가 있으면 각각 맞는 부분에 배열로 추가
    let user_info = JSON.parse(load_data);

    user_info.user_id.push(id.val());
    user_info.user_pw.push(pw.val());
    user_info.user_name.push(name.val());
    user_info.user_email.push(email.val());
    user_info.user_colNum.push(colNum.val());
    let new_data = JSON.stringify(user_info);
    console.log(`user id = ${id.val()}`);
    console.log(`user passwor = ${pw.val()}`);
    console.log(`user name = ${name.val()}`);
    console.log(`user email = ${email.val()}`);
    console.log(`user 전화번호 = ${colNum.val()}`);
    localStorage.setItem("info", new_data);
    alert("가입이 완료되었습니다.");
  } else {
    //기존에 localstorage가 비어있으면 새로 추가
    localStorage.setItem("info", info_json);
  }
  location.href = "index.html";
}
//회원가입 위한 함수 끝
function addMarker2(props) {
  const marker = new google.maps.Marker({
      position: new google.maps.LatLng(parseFloat(props.coords.lat), parseFloat(props.coords.lng)),
      map: map
  });


  if (props.iconImage) {
      marker.setIcon(props.iconImage);
  }

  if (props.content) {
      infoWindow = new google.maps.InfoWindow({
          content: props.content
      });

  }

  marker.addListener('click', function () {
      map.setZoom(17);
      map.setCenter(marker.getPosition());
      bounceMarker(marker);
  });
  markers.push(marker);
  setMapOnAll2(map);
}

function setMapOnAll2(map) {
  for (let i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
  }
}

function deleteMarkers() {
  clearMarkers();
  markers = [];
}

function clearMarkers() {
  setMapOnAll(null);
}

function findPw() {
  let id = $('#inputId').val();
  let info = JSON.parse(localStorage.getItem('info'));
  let idList = info.user_id;
  let index;

  for(let i =0;i<idList.length;i++){
    if(idList[i] == id){
      index = i;
      let pw = info.user_pw[index];
      alert("패스워드는 " +pw +"입니다.");
      return;
    }
  }
  alert("존재하지 않는 아이디 입니다.");
}
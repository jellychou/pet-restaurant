let allReof_pagesults = [];  //全部的資料
let allZones = [];  //全部的區（重複）
let clearZones = [];  //總共有幾區
let allLen;  //總長度
let resType = []; //全部的餐廳類型
let allResults;
let north = document.getElementById('northCount');
let middle = document.getElementById('middleCount');
let south = document.getElementById('southCount');
let east = document.getElementById('eastCount');
let year = document.querySelector('.year');
let pointSerch = document.querySelector('.point-serch');
let serchBtn = document.querySelector('.serch-btn');
let serchId = document.getElementById('serch');
let list = document.querySelector('.list');
let all = document.getElementById('all');
let map;
let markers = [];
let categoryArr = [];
let selectArry = [];
let mapList = document.querySelector('.map-list');
let btnRadius = document.querySelectorAll('.btn-radius');
let infoCardshow = [];
let show_per_page = 5;
let number_of_items = 0;
let number_of_pages = 0;
let textNode;
let pagination = document.querySelector('.pagination');
let select = document.querySelector('.select');
let originalArr = [];
let pageArr = [];
let activePage;
let keyWord;
let reset = document.querySelector('.reset');
let totalPage = document.querySelector('.total-page');
let infowindow;
let content = document.getElementById('content');
let serchLg = document.querySelector('.point-serch-lg');
let btnLg = document.querySelector('.serch-btn-lg')

serchBtn.addEventListener('click', point_Serch);
btnLg.addEventListener('click',point_Serchlg);
$(document).ready(function () {
    //關鍵字查詢
    $('.point-btn').click(function () {
        $('.point').removeClass('dispoint').addClass('disblock');
        $('.dispage').removeClass('dispage').addClass('disblock');
        listCount();
        if (window.innerWidth > 411) {
            document.querySelectorAll('.page-num')[0].classList.add('active');
        }
        if ($('.map').hasClass('disblock')) {
            $('.map').removeClass('disblock').addClass('dismap');
        }
    });
    //地圖式查詢
    $('.map-btn').click(function () {
        pagination.innerHTML = '';
        totalPage.innerHTML = '';
        $('.map').removeClass('dismap').addClass('disblock');
        $('.dispage').removeClass('dispage').addClass('disblock');
        if ($('.point').hasClass('disblock')) {
            $('.point').removeClass('disblock').addClass('dispoint');
        }
    });

    //用ajax撈API資料
    $.ajax({
        url: 'JSON/db.json',
        method: 'get',
        dataType: 'json',
        data: {}
    }).done(function (res) {
        console.log(res)
        allResults = res;
        allLen = allResults.length;
        console.log(allLen);
        for (let i = 0; i < allResults.length; i++) {
            allZones.push(allResults[i].properties.Zone);
        }

        for (let i = 0; i < allZones.length; i++) {
            if (clearZones.indexOf(allZones[i]) == -1) {
                clearZones.push(allZones[i]);
            }
        }
        for (let i = 0; i < allLen; i++) {
            resType.push(allResults[i].properties.Classification);
        }

        init();


        //各地區撈幾筆資料
        let tempNorth = 0;
        let tempMid = 0;
        let tempSouth = 0;
        let tempEast = 0;
        for (let i = 0; i < allZones.length; i++) {
            switch (allZones[i]) {
                case '北部':
                    tempNorth++;
                    break;
                case '中部':
                    tempMid++;
                    break;
                case '南部':
                    tempSouth++;
                    break;
                case '東部':
                    tempEast++;
                    break;
            }
        }

        north.textContent = '(' + tempNorth + ')';
        middle.textContent = '(' + tempMid + ')';
        south.textContent = '(' + tempSouth + ')';
        east.textContent = '(' + tempEast + ')';

        for (let i = 0; i < allLen; i++) {
            categoryArr.push(allResults[i].properties.Category);
        }

        //click 地區按鈕(areaClick),並innerHTML渲染
        $('.areaClick').on('click', function (e) {
            $('#all').removeClass('active');
            $('.btn-radius').removeClass('active');
            let el = e.target.textContent;
            list.innerHTML = '';
            for (let i = 0; i < allLen; i++) {
                if (el.indexOf(allZones[i]) !== -1) {
                    list.innerHTML += `
                    <div class="mt-md-3 border-style infoCard">
                        <div class="bg-warning">
                            <div class="row list"> 
                                <div class="col-md-4 no-gutter">
                                    <img class="w-100 object-fit bg-cover" style="height:250px;" src="${allResults[i].properties.Images}">
                                </div> 
                                <div class="col-md-8 my-md-2 order-table">
                                    <h4 class="ml-4 mt-1 ml-md-0 mt-md-0">${allResults[i].properties.Name}</h4>
                                    <p class="mb-md-1 ml-4 ml-md-0"><i class="fas fa-phone-square text-secondary mr-md-3"></i>
                                    ${allResults[i].properties.Tel}</p>
                                    <p class="mb-md-1 ml-4 ml-md-0"><i class="fas fa-map-marker-alt text-secondary mr-md-3"></i>
                                    ${allResults[i].properties.Add}</p>
                                    <p class="mb-md-1 ml-4 ml-md-0"><i class="fas fa-clock text-secondary mr-md-3"></i>
                                    ${allResults[i].properties.Time}</p>
                                    <p class="mb-md-1 ml-4 ml-md-0"><i class="fas fa-paw text-secondary mr-md-3"></i>
                                    ${allResults[i].properties.Classification}</p>
                                </div>
                            </div>
                        </div>      
                    </div>`;
                }
            }
            //先把之前陣列裡面的值清空,計算出每一個地區幾筆資料,並加入到陣列,然後執行計算分頁(listCount)
            infoCardshow = [];
            $('.infoCard').each(function () {
                infoCardshow.push(this);
            })
            listCount();
            if (window.innerWidth > 411 ) {
                console.log(document.querySelectorAll('.page-num')[0].classList);
                document.querySelectorAll('.page-num')[0].classList.add('active');
            }
        });


        //點選分類btn(btn-radius)新增刪除class        
        $('.btn-radius').on('click', function (e) {
            pagination.innerHTML = '';
            if (e.target.id !== 'all') {
                $('#all').removeClass('active');
            } else {
                $('#all').addClass('active');
                $('.btn-radius').attr('class', 'btn-radius');
            }
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
            } else {
                $(this).addClass('active');
            }
            typeCount();
        });

        $('.infoCard').each(function () {
            infoCardshow.push(this);
        });

        $('#serch').on('keypress', (e) => {
            if (e.keyCode === 13) {
                point_Serch();
            }
        });
        $('#serchlg').on('keypress', (e) => {
            if (e.keyCode === 13) {
                point_Serchlg();
            }
        });

        let image = {
            url: 'images/point-icon.png',
            scaledSize: new google.maps.Size(65, 65),
        };

        infowindow = setinfowindow();

        for (let i = 0; i < allResults.length; i++) {
            let str = {};
            let place = {};
            place.lng = parseFloat(allResults[i].geometry.Coordinates[0]);
            place.lat = parseFloat(allResults[i].geometry.Coordinates[1]);

            str.map = map;
            str.icon = image;
            str.title = allResults[i].properties["Name"];
            str.position = place;
            str.animation = google.maps.Animation.DROP;
            let marker = new google.maps.Marker(str);
            markers.push(marker);

            if (window.innerWidth > 411) {
                marker.addListener('click', function () {
                mapList.innerHTML = ` 
                    <div class="card d-none d-lg-block">
                        <img src="${allResults[i].properties.Images}" class="card-img-top object-fit w-100 bg-cover" alt="..." style="height:350px;>
                        <div class="card-body">
                            <h3 class="card-title ml-3 mt-1">${allResults[i].properties.Name}</h3>
                            <p class="card-text ml-3 mb-1"><i class="fas fa-phone-square text-secondary mr-md-3"></i>${allResults[i].properties.Tel}
                            </p>
                            <p class="card-text ml-3 mb-1"><i
                                    class="fas fa-map-marker-alt text-secondary mr-md-3"></i>${allResults[i].properties.Add}</p>
                            <p class="card-text ml-3 mb-1"><i class="fas fa-clock text-secondary mr-md-3"></i>${allResults[i].properties.Time}</p>
                            <p class="card-text ml-3 mb-1"><i
                                    class="fas fa-paw text-secondary mr-md-3"></i>${allResults[i].properties.Classification}
                            </p>
                        </div>
                    </div> 
                <div class="mt-md-3 mb-3 border-style infoCard d-block d-lg-none">
                    <div class="bg-warning">
                        <div class="row list mt-sm-3 mt-md-0"> 
                            <div class="col-md-4 no-gutter col-4 col-sm-5">
                                <img class="object-fit bg-cover" style="height:250px;" src="${allResults[i].properties.Images}">
                            </div> 
                            <div class="col-md-8 my-md-2 order-table col-8 col-sm-7 phone-page">
                                <h4>${allResults[i].properties.Name}</h4>
                                <p class="mb-sm-1 phone-icon"><i class="fas fa-phone-square text-secondary mr-md-3"></i>
                                ${allResults[i].properties.Tel}</p>
                                <p class="mb-sm-1 phone-icon"><i class="fas fa-map-marker-alt text-secondary mr-md-3"></i>
                                ${allResults[i].properties.Add}</p>
                                <p class="mb-sm-1 phone-icon"><i class="fas fa-clock text-secondary mr-md-3"></i>
                                ${allResults[i].properties.Time}</p>
                                <p class="mb-sm-1 phone-icon"><i class="fas fa-paw text-secondary mr-md-3"></i>
                                ${allResults[i].properties.Classification}</p>
                            </div>
                        </div> 
                    </div>      
                </div>`;
                });
                marker.addListener('click', initBounce);
                function initBounce() {
                    markers.forEach((val) => {
                        val.setAnimation(null);
                    });
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                }
            } else {
                marker.addListener('click', function () {
                    let contentString = `
                    <div id="content-style">
                        <div id="content">
                            <div id="siteNotice"></div>
                            <h5 id="firstHeading" class="firstHeading">${allResults[i].properties.Name}</h5>
                            <div id="bodyContent">
                                <span><i class="fas fa-map-marker-alt phone-icon"></i>${allResults[i].properties.Add}</span></br>
                                <span><i class="fas fa-phone-square phone-icon"></i>${allResults[i].properties.Tel}</span></br>
                                <span><i class="fas fa-clock phone-icon"></i>${allResults[i].properties.Time}</span></br>
                                <span><i class="fas fa-paw phone-icon"></i>${allResults[i].properties.Classification}</span>
                            </div>
                        </div>
                    </div>`;
                    infowindow = createinfowindow(infowindow, contentString);
                    infowindow.open(map, this);
                });
            }
        };
        $('.top').click(function (e){
            e.preventDefault();
            $('html,body').animate({
                scrollTop: 500
            }, 1000);
        })

    }).fail(function (err) {
        console.log(err)
    });
});

let today = new Date();
let thisYear = today.getFullYear();
year.innerHTML = `&copy; ${thisYear}`;

//map
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 23.6468743, lng: 121.0105996 },
        zoom: 7.4,
        disableDefaultUI: true,
        styles: [
            {
                "stylers": [
                    {
                        "hue": "#dd0d0d"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [
                    {
                        "lightness": 100
                    },
                    {
                        "visibility": "simplified"
                    }
                ]
            }
        ],
    });
};

function arrInArr(ary, target) {
    for (let i = 0; i < ary.length; i++) {
        if (!target.includes(ary[i])) {
            return false;
        }
    }
    return true;
}



function init() {
    for (let i = 0; i < allLen; i++) {
        list.innerHTML += `
        <div class="mt-md-3 border-style infoCard" data-name="${allResults[i].properties.Name}"
            data-add="${allResults[i].properties.Add}" data-classification="${allResults[i].properties.Classification}">
                <div class="bg-warning">
                    <div class="row list">
                        <div class="col-md-4 no-gutter">
                            <img class="w-100 object-fit bg-cover" style="height:250px;" src="${allResults[i].properties.Images}">
                        </div> 
                        <div class="col-md-8 my-md-2 order-table ml-5 ml-md-0">
                            <h4 class="mt-3 mt-md-0">${allResults[i].properties.Name}</h4>
                            <p class="mb-md-1"><i class="fas fa-phone-square text-secondary mr-md-3"></i>
                            ${allResults[i].properties.Tel}</p>
                            <p class="mb-md-1"><i class="fas fa-map-marker-alt text-secondary mr-md-3"></i>
                            ${allResults[i].properties.Add}</p>
                            <p class="mb-md-1"><i class="fas fa-clock text-secondary mr-md-3"></i>
                            ${allResults[i].properties.Time}</p>
                            <p class="mb-md-1"><i class="fas fa-paw text-secondary mr-md-3"></i>
                            ${allResults[i].properties.Classification}</p>
                        </div>
                    </div> 
                </div>      
        </div>`;
    };
}

function listCount() {
    originalArr = [];
    number_of_items = infoCardshow.length;
    number_of_pages = Math.ceil(number_of_items / show_per_page);
    textNode = '';
    if (window.innerWidth > 411) {
        for (let i = 1; i < number_of_pages + 1; i++) {
            textNode += `
                <li class="page-item page-num" onclick="changePage(${i - 1})">
                <a class="page-link" href="#all">${i}</a>
                </li>`;
            pagination.innerHTML = `
                <li class="page-item">
                    <a class="page-link" href="#all" aria-label="Previous" onclick="preOrNext('pre')">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
                ${textNode}
                <li class="page-item">
                    <a class="page-link" href="#all" aria-label="Next" onclick="preOrNext('next')">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li> `;
        }
    } else {
        for (let i = 1; i < number_of_pages + 1; i++) {
            pagination.innerHTML = `
        <li class="page-item">
            <a class="page-link" href="#all" aria-label="Previous" onclick="preOrNext('pre')">
                <span aria-hidden="true">&laquo;</span>
            </a>
        </li>
        <li class="page-item">
            <p class="page-link">
                <span aria-hidden="true" class="page">${1}</span>
            </p>
        </li>
        <li class="page-item">
            <a class="page-link" href="#all" aria-label="Next" onclick="preOrNext('next')">
                <span aria-hidden="true">&raquo;</span>
            </a>
        </li> `;
            totalPage.innerHTML = `
        <p class="d-flex text-info justify-content-center">共${number_of_pages}頁 / ${number_of_items}筆資料</p>`;
        }
    }
    for (let i = 0; i < infoCardshow.length; i++) {
        $(infoCardshow[i]).hide();
        originalArr.push(infoCardshow[i]);
    }
    for (let i = 0; i < show_per_page; i++) {
        $(originalArr.slice(0, show_per_page)[i]).show();
    }
}



function changePage(page_num) {
    if (window.innerWidth > 411) {
        for (let i = 0; i < number_of_pages; i++) {
            document.querySelectorAll('.page-num')[i].classList.remove('active');
        }
        document.querySelectorAll('.page-num')[page_num].classList.add('active');
        let start_form = page_num * show_per_page;
        let end_on = start_form + show_per_page;
        for (let i = 0; i < infoCardshow.length; i++) {
            $(infoCardshow[i]).hide();
        }

        for (let i = 0; i < show_per_page; i++) {
            $(originalArr.slice(start_form, end_on)).show();

        }
    } else {
        let start_form = (page_num - 1) * show_per_page;
        let end_on = start_form + show_per_page;
        for (let i = 0; i < infoCardshow.length; i++) {
            $(infoCardshow[i]).hide();
        }

        for (let i = 0; i < show_per_page; i++) {
            $(originalArr.slice(start_form, end_on)).show();

        }
    }
}

function preOrNext(go) {
    if (window.innerWidth > 411) {
        for (let i = 0; i < number_of_pages; i++) {
            if (document.querySelectorAll('.page-num')[i].classList.contains('active')) {
                activePage = document.querySelectorAll('.page-num')[i].children[0];
            }
        }
        let now = parseInt(activePage.textContent) - 1
        if (go == 'pre' && now > 0) {
            changePage(now - 1)
        } else if (go == 'next' && now < number_of_pages - 1) {
            changePage(now + 1)
        }
    } else {
        let now = parseInt(document.querySelector('.page').textContent);
        if (go == 'pre') {
            if (now !== 1) {
                document.querySelector('.page').textContent = Number(now - 1);
                changePage(now - 1)
            }
        } else if (go == 'next') {
            if (now < number_of_pages) {
                document.querySelector('.page').textContent = Number(now + 1);
                changePage(now + 1)
            }
        }
    }
}


//input 關鍵字查詢
function point_Serch(e) {
    console.log('123');
    typeCount();
    let tempShow = [];
    let none = [];
    infoCardshow.forEach(function (val, index) {
        keyWord = pointSerch.value;
        let address = $(val).data('add');
        let classification = $(val).data('classification');
        let name = $(val).data('name');
        if (address.indexOf(keyWord) !== -1 || classification.indexOf(keyWord) !== -1 || name.indexOf(keyWord) !== -1) {
            $(val).show();
            tempShow.push(val);
        } else {
            $(val).hide();
            none.push(val);
            if (none.length == infoCardshow.length) {
                list.innerHTML = '查無此關鍵字';
            }
        }
    });
    infoCardshow = tempShow;
    pagination.innerHTML = '';
    listCount();
};

//input-lg 關鍵字查詢
function point_Serchlg(e) {
    console.log('123');
    typeCount();
    let tempShow = [];
    let none = [];
    infoCardshow.forEach(function (val, index) {
        keyWord = serchLg.value;
        let address = $(val).data('add');
        let classification = $(val).data('classification');
        let name = $(val).data('name');
        if (address.indexOf(keyWord) !== -1 || classification.indexOf(keyWord) !== -1 || name.indexOf(keyWord) !== -1) {
            $(val).show();
            tempShow.push(val);
        } else {
            $(val).hide();
            none.push(val);
            if (none.length == infoCardshow.length) {
                list.innerHTML = '查無此關鍵字';
            }
        }
    });
    infoCardshow = tempShow;
    pagination.innerHTML = '';
    listCount();
};

//先把全部隱藏display-none,在比對btn資料,符合的就顯示display-block,並執行分頁
function typeCount() {
    list.innerHTML = '';
    init();
    selectArry = [];
    $('.infoCard').hide();
    infoCardshow = [];
    $('.btn-radius.active').each(function () {
        selectArry.push(Number(this.dataset.num));
    });
    categoryArr.forEach((val, index) => {
        if (arrInArr(selectArry, val)) {
            $($('.infoCard')[index]).show();
            infoCardshow.push($('.infoCard')[index]);
        }
    });
    listCount();
    if (window.innerWidth > 411) {
        console.log(document.querySelectorAll('.page-num')[0].classList);
        document.querySelectorAll('.page-num')[0].classList.add('active');
    }
}

function setinfowindow()
{
    var infowindow = new google.maps.InfoWindow();
    return infowindow;
}
    
function createinfowindow(infowindow, content)
{   
    infowindow.close();
    infowindow = new google.maps.InfoWindow({content: content});
    infowindow.setOptions({maxWidth: 300});
    return infowindow;
}


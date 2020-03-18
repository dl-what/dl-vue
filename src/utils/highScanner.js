let DeviceMain; //主头
let DeviceAssist; //副头
let VideoMain; //主头
let VideoAssist; //副头
let videoCapMain;
let videoCapAssist;

let PicPath;
let initFaceDetectSuccess;
let readIDcard = false;

function plugin() {
  return document.getElementById('view1');
}

function MainView() {
  return document.getElementById('view1');
}

function AssistView() {
  return document.getElementById('view2');
}

function thumb1() {
  return document.getElementById('thumb1');
}

function addEvent(obj, name, func) {
  if (obj.attachEvent) {
    obj.attachEvent("on" + name, func);
  } else {
    obj.addEventListener(name, func, false);
  }
}

function OpenVideo() {

  OpenVideoMain();
  OpenVideoAssist();
}

function CloseVideo() {
  CloseVideoMain();
  CloseVideoAssist();
}

function CloseVideoMain() {
  if (VideoMain) {
    plugin().Video_Release(VideoMain);
    VideoMain = null;

    MainView().View_SetText("", 0);
  }
}

function CloseVideoAssist() {
  if (VideoAssist) {
    plugin().Video_Release(VideoAssist);
    VideoAssist = null;

    AssistView().View_SetText("", 0);
  }
}

function OpenVideoMain() {
  CloseVideoMain();

  if (!DeviceMain)
    return;

  let sSubType = document.getElementById('subType1');
  let sResolution = document.getElementById('selRes1');

  let SelectType = 0;
  let txt;
  if (sSubType.options.selectedIndex != -1) {
    txt = sSubType.options[sSubType.options.selectedIndex].text;
    if (txt == "YUY2") {
      SelectType = 1;
    } else if (txt == "MJPG") {
      SelectType = 2;
    } else if (txt == "UYVY") {
      SelectType = 4;
    }
  }

  let nResolution = sResolution.selectedIndex;

  VideoMain = plugin().Device_CreateVideo(DeviceMain, nResolution, SelectType);
  if (VideoMain) {
    MainView().View_SelectVideo(VideoMain);
    MainView().View_SetText("打开视频中，请等待...", 0);

  }
}

function OpenVideoAssist() {
  CloseVideoAssist();

  if (!DeviceAssist)
    return;

  let sSubType = document.getElementById('subType2');
  let sResolution = document.getElementById('selRes2');

  let SelectType = 0;
  let txt;
  if (sSubType.options.selectedIndex != -1) {
    txt = sSubType.options[sSubType.options.selectedIndex].text;
    if (txt == "YUY2") {
      SelectType = 1;
    } else if (txt == "MJPG") {
      SelectType = 2;
    } else if (txt == "UYVY") {
      SelectType = 4;
    }
  }

  let nResolution = sResolution.selectedIndex;

  VideoAssist = plugin().Device_CreateVideo(DeviceAssist, nResolution, SelectType);
  if (VideoAssist) {
    AssistView().View_SelectVideo(VideoAssist);
    AssistView().View_SetText("打开视频中，请等待...", 0);
  }
}

function changesubTypeMain() {
  if (DeviceMain) {
    let sSubType = document.getElementById('subType1');
    let sResolution = document.getElementById('selRes1');
    let SelectType = 0;
    let txt;
    if (sSubType.options.selectedIndex != -1) {
      let txt = sSubType.options[sSubType.options.selectedIndex].text;
      if (txt == "YUY2") {
        SelectType = 1;
      } else if (txt == "MJPG") {
        SelectType = 2;
      } else if (txt == "UYVY") {
        SelectType = 4;
      }
    }

    let nResolution = plugin().Device_GetResolutionCountEx(DeviceMain, SelectType);
    sResolution.options.length = 0;
    for (let i = 0; i < nResolution; i++) {
      let width = plugin().Device_GetResolutionWidthEx(DeviceMain, SelectType, i);
      let heigth = plugin().Device_GetResolutionHeightEx(DeviceMain, SelectType, i);
      sResolution.add(new Option(width.toString() + "*" + heigth.toString()));
    }
    sResolution.selectedIndex = 0;
  }
}

function changesubTypeAssist() {
  if (DeviceAssist) {
    let sSubType = document.getElementById('subType2');
    let sResolution = document.getElementById('selRes2');

    let SelectType = 0;
    let txt;
    if (sSubType.options.selectedIndex != -1) {
      let txt = sSubType.options[sSubType.options.selectedIndex].text;
      if (txt == "YUY2") {
        SelectType = 1;
      } else if (txt == "MJPG") {
        SelectType = 2;
      } else if (txt == "UYVY") {
        SelectType = 4;
      }
    }

    let nResolution = plugin().Device_GetResolutionCountEx(DeviceAssist, SelectType);
    sResolution.options.length = 0;
    for (let i = 0; i < nResolution; i++) {
      let width = plugin().Device_GetResolutionWidthEx(DeviceAssist, SelectType, i);
      let heigth = plugin().Device_GetResolutionHeightEx(DeviceAssist, SelectType, i);
      sResolution.add(new Option(width.toString() + "*" + heigth.toString()));
    }
    sResolution.selectedIndex = 0;
  }
}

function Load() {
  //设备接入和丢失
  //type设备类型， 1 表示视频设备， 2 表示音频设备
  //idx设备索引
  //dbt 1 表示设备到达， 2 表示设备丢失
  addEvent(plugin(), 'DevChange',
    function (type, idx, dbt) {
      if (1 == type) //视频设备
      {
        if (1 == dbt) //设备到达
        {
          let deviceType = plugin().Global_GetEloamType(1, idx);
          if (1 == deviceType) //主摄像头
          {
            if (null == DeviceMain) {
              DeviceMain = plugin().Global_CreateDevice(1, idx);
              if (DeviceMain) {
                document.getElementById('lab1').innerHTML = plugin().Device_GetFriendlyName(DeviceMain);

                let sSubType = document.getElementById('subType1');
                sSubType.options.length = 0;
                let subType = plugin().Device_GetSubtype(DeviceMain);
                if (subType & 1) {
                  sSubType.add(new Option("YUY2"));
                }
                if (subType & 2) {
                  sSubType.add(new Option("MJPG"));
                }
                if (subType & 4) {
                  sSubType.add(new Option("UYVY"));
                }

                sSubType.selectedIndex = 0;
                changesubTypeMain();

                OpenVideoMain();
              }
            }
          } else if (2 == deviceType || 3 == deviceType) //辅摄像头
          {
            if (null == DeviceAssist) {
              DeviceAssist = plugin().Global_CreateDevice(1, idx);
              if (DeviceAssist) {
                document.getElementById('lab2').innerHTML = plugin().Device_GetFriendlyName(DeviceAssist);

                let sSubType = document.getElementById('subType2');
                sSubType.options.length = 0;
                let subType = plugin().Device_GetSubtype(DeviceAssist);
                if (subType & 1) {
                  sSubType.add(new Option("YUY2"));
                }
                if (subType & 2) {
                  sSubType.add(new Option("MJPG"));
                }
                if (subType & 4) {
                  sSubType.add(new Option("UYVY"));
                }
                if ((0 != (subType & 2)) && (0 != (subType & 1))) //辅摄像头优先采用mjpg模式打开 
                {
                  sSubType.selectedIndex = 1;
                } else {
                  sSubType.selectedIndex = 0;
                }
                initFaceDetectSuccess = plugin().InitFaceDetect();

                changesubTypeAssist();

                OpenVideoAssist();
              }
            }
          }
        } else if (2 == dbt) //设备丢失
        {
          if (DeviceMain) {
            if (plugin().Device_GetIndex(DeviceMain) == idx) {
              CloseVideoMain();
              plugin().Device_Release(DeviceMain);
              DeviceMain = null;

              document.getElementById('lab1').innerHTML = "";
              document.getElementById('subType1').options.length = 0;
              document.getElementById('selRes1').options.length = 0;
            }
          }

          if (DeviceAssist) {
            if (plugin().Device_GetIndex(DeviceAssist) == idx) {
              CloseVideoAssist();
              plugin().Device_Release(DeviceAssist);
              DeviceAssist = null;

              document.getElementById('lab2').innerHTML = "";
              document.getElementById('subType2').options.length = 0;
              document.getElementById('selRes2').options.length = 0;
            }
          }
        }
      }
    });

  addEvent(plugin(), 'Ocr',
    function (flag, ret) {
      if (1 == flag && 0 == ret) {
        let ret = plugin().Global_GetOcrPlainText(0);
        alert(ret);
      }
    });

  addEvent(plugin(), 'IdCard',
    function (ret) {
      if (1 == ret) {
        let str = GetTimeString() + "：";

        for (let i = 0; i < 16; i++) {
          str += plugin().Global_GetIdCardData(i + 1);
          str += ";";
        }

        document.getElementById("idcard").value = str;

        let image = plugin().Global_GetIdCardImage(1); //1表示头像， 2表示正面， 3表示反面 ...
        plugin().Image_Save(image, "C:\\idcard.jpg", 0);
        plugin().Image_Release(image);

        document.getElementById("idcardimg").src = "C:\\idcard.jpg";
      }
    });

  addEvent(plugin(), 'Biokey',
    function (ret) {
      if (4 == ret) {
        // 采集模板成功
        let mem = plugin().Global_GetBiokeyTemplateData();
        if (mem) {
          if (plugin().Memory_Save(mem, "C:\\1.tmp")) {
            document.getElementById("biokey").value = "获取模板成功，存储路径为C:\\1.tmp";
          }
          plugin().Memory_Release(mem);
        }

        let img = plugin().Global_GetBiokeyImage();
        plugin().Image_Save(img, "C:\\BiokeyImg1.jpg", 0);
        plugin().Image_Release(img);

        document.getElementById("BiokeyImg1").src = "C:\\BiokeyImg1.jpg";
        alert("获取指纹模板成功");
      } else if (8 == ret) {
        let mem = plugin().Global_GetBiokeyFeatureData();
        if (mem) {
          if (plugin().Memory_Save(mem, "C:\\2.tmp")) {
            document.getElementById("biokey").value = "获取特征成功，存储路径为C:\\2.tmp";
          }
          plugin().Memory_Release(mem);
        }

        let img = plugin().Global_GetBiokeyImage();
        plugin().Image_Save(img, "C:\\BiokeyImg2.jpg", 0);
        plugin().Image_Release(img);

        document.getElementById("BiokeyImg2").src = "C:\\BiokeyImg2.jpg";
        alert("获取指纹特征成功");
      } else if (9 == ret) {
        document.getElementById("biokey").value += "\r\n刷的不错！";
      } else if (10 == ret) {
        document.getElementById("biokey").value += "\r\n图像质量太差！";
      } else if (11 == ret) {
        document.getElementById("biokey").value += "\r\n图像点数太少！";
      } else if (12 == ret) {
        document.getElementById("biokey").value += "\r\n太快！";
      } else if (13 == ret) {
        document.getElementById("biokey").value += "\r\n太慢！";
      } else if (14 == ret) {
        document.getElementById("biokey").value += "\r\n其它质量问题！";
      }
    });

  addEvent(plugin(), 'Reader',
    function (type, subtype) {
      let str = "";
      if (4 == type) {
        if (0 == subtype) //接触式CPU卡
        {
          str += "[接触式CPU卡][银行卡号]:";
          str += plugin().Global_ReaderGetCpuCreditCardNumber();
        } else if (1 == subtype) //非接触式CPU卡
        {
          str += "[非接触式CPU卡] :";
          str += "[Id]:";
          str += plugin().Global_ReaderGetCpuId();
          str += "[银行卡号]:";
          str += plugin().Global_ReaderGetCpuCreditCardNumber();

          str += "[磁道数据]:";
          str += plugin().Global_CpuGetBankCardTrack(); //磁道数据

          str += "[交易记录]:";
          let n = plugin().Global_CpuGetRecordNumber(); //交易条数
          for (let i = 0; i < n; i++) {
            str += plugin().Global_CpuGetankCardRecord(i);
            str + ";";
          }
        }
      } else if (2 == type) {
        str += "[M1卡] Id:";
        str += plugin().Global_ReaderGetM1Id();
      } else if (3 == type) {
        str += "[Memory卡] Id:";
        str += plugin().Global_ReaderGetMemoryId();
      } else if (5 == type) {
        str += "[社保卡] :";
        str += plugin().Global_ReaderGetSocialData(1);
        str += plugin().Global_ReaderGetSocialData(2);
      }
      document.getElementById("reader").value = str;
    });

  addEvent(plugin(), 'Mag',
    function (ret) {
      let str = "";

      str += "[磁卡卡号] ";
      str += plugin().Global_MagneticCardGetNumber();

      str += "[磁道数据]";

      str += "磁道1:";
      str += plugin().Global_MagneticCardGetData(0);
      str += "磁道2:";
      str += plugin().Global_MagneticCardGetData(1);
      str += "磁道3:";
      str += plugin().Global_MagneticCardGetData(2);

      document.getElementById("mag").value = str;
    });

  addEvent(plugin(), 'ShenZhenTong',
    function (ret) {
      let str = "";

      str += "[深圳通卡号] ";
      str += plugin().Global_GetShenZhenTongNumber();

      str += "[金额:] ";
      str += plugin().Global_GetShenZhenTongAmount();

      str += "[交易记录:]";

      let n = plugin().Global_GetShenZhenTongCardRecordNumber();
      for (let i = 0; i < n; i++) {
        str += plugin().Global_GetShenZhenTongCardRecord(i);
        str += ";";
      }
      document.getElementById("shenzhentong").value = str;
    });

  addEvent(plugin(), 'MoveDetec',
    function (video, id) {
      // 自动拍照事件	
    });

  addEvent(plugin(), 'Deskew',
    function (video, view, list) {
      // 纠偏回调事件
      let count = plugin().RegionList_GetCount(list);
      for (let i = 0; i < count; ++i) {
        let region = plugin().RegionList_GetRegion(list, i);

        let x1 = plugin().Region_GetX1(region);
        let y1 = plugin().Region_GetY1(region);

        let width = plugin().Region_GetWidth(region);
        let height = plugin().Region_GetHeight(region);

        plugin().Region_Release(region);
      }

      plugin().RegionList_Release(list);
    });

  let title = document.title;
  document.title = title + plugin().version;

  MainView().Global_SetWindowName("view");
  AssistView().Global_SetWindowName("view");
  thumb1().Global_SetWindowName("thumb");

  let ret;
  ret = plugin().Global_InitDevs();
  if (ret) {
    //进行人脸识别初始化时，视频应处于关闭状态
    plugin().InitFaceDetect();
  }

  if (!plugin().Global_VideoCapInit()) {
    alert("初始化失败！");
  }
}

function Unload() {
  if (VideoMain) {
    MainView().View_SetText("", 0);
    plugin().Video_Release(VideoMain);
    VideoMain = null;
  }
  if (DeviceMain) {
    plugin().Device_Release(DeviceMain);
    DeviceMain = null;
  }
  if (VideoAssist) {
    AssistView().View_SetText("", 0);
    plugin().Video_Release(VideoAssist);
    VideoAssist = null;
  }
  if (DeviceAssist) {
    plugin().Device_Release(DeviceAssist);
    DeviceAssist = null;
  }

  StopICCard();
  StopMagCard();
  StopShenZhenTongCard();
  StopIDCard();

  plugin().Global_DeinitDevs();

  //进行人脸识别反初始化时，视频应处于关闭状态
  plugin().DeinitFaceDetect();
}

function EnableDate(obj) {
  if (obj.checked) {
    let offsetx = 1000;
    let offsety = 60;

    let font;
    font = plugin().Global_CreateTypeface(50, 50, 0, 0, 2, 0, 0, 0, "宋体");

    if (VideoMain) {
      let width = plugin().Video_GetWidth(VideoMain);
      let heigth = plugin().Video_GetHeight(VideoMain);

      plugin().Video_EnableDate(VideoMain, font, width - offsetx, heigth - offsety, 0xffffff, 0);
    }
    if (VideoAssist) {
      let width = plugin().Video_GetWidth(VideoAssist);
      let heigth = plugin().Video_GetHeight(VideoAssist);

      plugin().Video_EnableDate(VideoAssist, font, width - offsetx, heigth - offsety, 0xffffff, 0);
    }
    plugin().Font_Release(font);
  } else {
    if (VideoMain) {
      plugin().Video_DisableDate(VideoMain);
    }
    if (VideoAssist) {
      plugin().Video_DisableDate(VideoAssist);
    }
  }
}

function AddText(obj) {
  if (obj.checked) {
    let font;
    font = plugin().Global_CreateTypeface(200, 200, 0, 0, 2, 0, 0, 0, "宋体");

    if (VideoMain) {
      plugin().Video_EnableAddText(VideoMain, font, 0, 0, "文字水印", 65280, 150);
    }
    if (VideoAssist) {
      plugin().Video_EnableAddText(VideoAssist, font, 0, 0, "文字水印", 65280, 150);
    }
    plugin().Font_Release(font);
  } else {
    if (VideoMain) {
      plugin().Video_DisableAddText(VideoMain);
    }
    if (VideoAssist) {
      plugin().Video_DisableAddText(VideoAssist);
    }
  }
}

function ShowProperty() {
  if (DeviceMain) {
    plugin().Device_ShowProperty(DeviceMain, MainView().View_GetObject());
  }
}

function Deskew(obj) {
  if (obj.checked) {
    if (VideoMain) {
      plugin().Video_EnableDeskewEx(VideoMain, 1);
    }
    if (VideoAssist) {
      plugin().Video_EnableDeskewEx(VideoAssist, 1);
    }
  } else {
    if (VideoMain) {
      plugin().Video_DisableDeskew(VideoMain);
    }
    if (VideoAssist) {
      plugin().Video_DisableDeskew(VideoAssist);
    }
  }
}

function SetState(obj) {
  if (obj.checked) {
    MainView().View_SetState(2);
    document.getElementById('scansize').disabled = "disabled";
  } else {
    MainView().View_SetState(1);
    document.getElementById('scansize').disabled = "";
  }
}

function OpenVerifyFacRect(obj) {
  if (!initFaceDetectSuccess) {
    alert("人脸初始化失败，机型不支持！");
    obj.checked = false;
  } else {
    if (VideoMain) {
      if (obj.checked)
        plugin().Global_EnableFaceRectCrop(VideoMain, 1);
      else
        plugin().Global_DisableFaceRectCrop(VideoMain);
    }
    if (VideoAssist) {
      if (obj.checked)
        plugin().Global_EnableFaceRectCrop(VideoAssist, 1);
      else
        plugin().Global_DisableFaceRectCrop(VideoAssist);
    }
  }
}

function changescansize() {
  let rect;
  let width = plugin().Video_GetWidth(VideoMain);
  let heigth = plugin().Video_GetHeight(VideoMain);

  let s = document.getElementById('scansize');
  let size = s.options.selectedIndex;

  if (size == 0) {
    MainView().View_SetState(1); //取消框选 状态											
  } else if (size == 1) {
    rect = plugin().Global_CreateRect(width / 2 - width / 4, heigth / 2 - heigth / 4, width / 2, heigth / 2);
    MainView().View_SetState(2); //小尺寸
    MainView().View_SetSelectedRect(rect);

  } else if (size == 2) {
    rect = plugin().Global_CreateRect(width / 2 - width / 6, heigth / 2 - heigth / 6, width / 3, heigth / 3);
    MainView().View_SetState(2); //中尺寸
    MainView().View_SetSelectedRect(rect);
  }

  if (size != 0) {
    document.getElementById('SetState').checked = false;
    document.getElementById('SetState').disabled = "disabled";
  } else {
    document.getElementById('SetState').disabled = ""
  }
}

function Left() {
  if (VideoMain) {
    plugin().Video_RotateLeft(VideoMain);
  }
  if (VideoAssist) {
    plugin().Video_RotateLeft(VideoAssist);
  }

}

function Right() {
  if (VideoMain) {
    plugin().Video_RotateRight(VideoMain);
  }
  if (VideoAssist) {
    plugin().Video_RotateRight(VideoAssist);
  }

}

function GetTimeString() {
  let date = new Date();
  let yy = date.getFullYear().toString();
  let mm = (date.getMonth() + 1).toString();
  let dd = date.getDate().toString();
  let hh = date.getHours().toString();
  let nn = date.getMinutes().toString();
  let ss = date.getSeconds().toString();
  let mi = date.getMilliseconds().toString();

  let ret = yy + mm + dd + hh + nn + ss + mi;
  return ret;
}

//拍照
function Scan() {
  if (VideoMain) {
    let imgList = plugin().Video_CreateImageList(VideoMain, 0, 0);
    if (imgList) {
      let len = plugin().ImageList_GetCount(imgList);
      for (let i = 0; i < len; i++) {
        let img = plugin().ImageList_GetImage(imgList, i);
        let Name = "C:\\" + GetTimeString() + ".jpg";
        let b = plugin().Image_Save(img, Name, 0);
        if (b) {
          MainView().View_PlayCaptureEffect();
          thumb1().Thumbnail_Add(Name);

          PicPath = Name;
        }

        plugin().Image_Release(img);
      }

      plugin().ImageList_Release(imgList);
    }
  }

  if (VideoAssist) {
    let imgList2 = plugin().Video_CreateImageList(VideoAssist, 0, 0);
    if (imgList2) {
      let len = plugin().ImageList_GetCount(imgList2);
      for (let i = 0; i < len; i++) {
        let img = plugin().ImageList_GetImage(imgList2, i);
        let Name = "C:\\" + GetTimeString() + ".jpg";
        let b = plugin().Image_Save(img, Name, 0);
        if (b) {
          AssistView().View_PlayCaptureEffect();
          thumb1().Thumbnail_Add(Name);
        }

        plugin().Image_Release(img);
      }

      plugin().ImageList_Release(imgList2);
    }
  }
}


function OCR() {
  if (PicPath) {
    plugin().Global_InitOcr();

    let img;
    img = plugin().Global_CreateImageFromFile(PicPath, 0);
    plugin().Global_DiscernOcr(1, img);
    let b = plugin().Global_WaitOcrDiscern();
    if (b) {
      alert(plugin().Global_GetOcrPlainText(0));
      plugin().Global_SaveOcr("C:\\1.doc", 0);
    }

    plugin().Global_DeinitOcr();

    plugin().Image_Release(img);
  } else {
    alert("请先拍照！");
  }
}

function UploadToHttpServer() {

  //let http = plugin().Global_CreateHttp("http://192.168.1.56:80/upload.asp");//asp服务器demo地址
  let http = plugin().Global_CreateHttp("http://192.168.1.56:8080/FileStreamDemo/servlet/FileSteamUpload?"); //java服务器demo地址
  if (http) {
    let b = plugin().Http_UploadImageFile(http, "C:\\1.jpg", "2.jpg");
    if (b) {
      alert("上传成功");
    } else {
      alert("上传失败");
    }

    plugin().Http_Release(http);
  } else {
    alert("url 错误");
  }
}

function UploadThumbToServer() {
  let http = thumb1().Thumbnail_HttpUploadCheckImage("http://192.168.1.56:8080/FileStreamDemo/servlet/FileSteamUpload?", 0);
  if (http) {
    let htInfo = thumb1().Thumbnail_GetHttpServerInfo();
    alert(htInfo);
  } else {
    alert("上传失败！");
  }
}

function ScanToHttpServer() {
  if (VideoMain) {
    let img = plugin().Video_CreateImage(VideoMain, 0, MainView().View_GetObject());
    if (img) {
      //let http = plugin().Global_CreateHttp("http://192.168.1.193:8080/upload.asp");//asp服务器demo地址
      let http = plugin().Global_CreateHttp("http://192.168.1.56:80/FileStreamDemo/servlet/FileSteamUpload?"); //java服务器demo地址
      if (http) {
        let b = plugin().Http_UploadImage(http, img, 2, 0, "2.jpg");
        if (b) {
          alert("上传成功");
        } else {
          alert("上传失败");
        }

        plugin().Http_Release(http);
      }

      plugin().Image_Release(img);
    }
  }
}

function RGB(r, g, b) {
  return r | g << 8 | b << 16;
}

/******************录像********************/
function StartMainRecord() {
  if (VideoMain) {
    let videoOutputWidth = plugin().Video_GetWidth(VideoMain);
    let videoOutputHeight = plugin().Video_GetHeight(VideoMain);
    //录像时，打开视频的分辨率越低，帧率越高,一般不超过200w像素
    //所设置的帧率应尽可能高于实际帧率，避免丢帧
    let FrameRate = 15; //此参数可根据录像分辨率与机型实际帧率调节
    let CheckWidth = 1600;
    let CheckHeight = 1200;
    //主流视频分辨率少有大于200万的，因此为节约cpu资源，当分辨率大于200w，应采用200w的配置录制
    if (videoOutputWidth * videoOutputHeight > (CheckWidth * CheckHeight)) {
      if (confirm("当前分辨率过高，切换到200万像素时，录制效果最佳！\r\n点击'确定'，手动切换到1600X1200或相近分辨率后再次尝试\r\n点击'取消'，本次录制继续")) {
        return;
      }
      videoOutputWidth = CheckWidth;
      videoOutputHeight = CheckHeight;
    }

    if (videoCapMain) {
      plugin().VideoCap_Stop(videoCapMain);
      plugin().VideoCap_Destroy(videoCapMain);
    }

    videoCapMain = plugin().Global_CreatVideoCap();
    if (null == videoCapMain) {
      alert("创建录像对象失败");
      return;
    }

    //设置水印
    plugin().VideoCap_SetWatermark(videoCapMain, 1, 0, 0, 4, 100, 0, "深圳新良田科技", RGB(255, 23, 140), "Microsoft YaHei", 72, 50, 0);

    let selMicIdx = -1;
    if (plugin().Global_VideoCapGetAudioDevNum() > 0) //有麦克风
    {
      selMicIdx = 0;
    }

    if (!plugin().VideoCap_PreCap(videoCapMain, "C:\\eloamPlugin_main.mp4", selMicIdx, FrameRate, 1, videoOutputWidth, videoOutputHeight)) {
      alert("录像设置失败");
      return;
    }

    if (!plugin().VideoCap_AddVideoSrc(videoCapMain, VideoMain)) {
      alert("添加视频源失败");
      return;
    }

    if (!plugin().VideoCap_Start(videoCapMain)) {
      alert("启动录像失败");
      return;
    }
    alert("已开始录像");
  }
}

function StopMainRecord() {
  if (plugin().VideoCap_Stop(videoCapMain)) {
    plugin().VideoCap_Destroy(videoCapMain);
    videoCapMain = null;
    alert("录像结束，文件保存于C:\\eloamPlugin_main.mp4\r\n若录像失败请选择较小的分辨率尝试");
  } else {
    alert("停止录像失败");
  }
}

function StartAssistRecord() {
  if (VideoAssist) {
    let videoOutputWidth = plugin().Video_GetWidth(VideoAssist);
    let videoOutputHeight = plugin().Video_GetHeight(VideoAssist);
    //录像时，打开视频的分辨率越低，帧率越高,一般不超过200w像素
    //所设置的帧率应尽可能高于实际帧率，避免丢帧
    let FrameRate = 15; //此参数可根据录像分辨率与机型实际帧率调节
    let CheckWidth = 1600;
    let CheckHeight = 1200;
    //主流视频分辨率少有大于200万的，因此为节约cpu资源，当分辨率大于200w，应采用200w的配置录制
    if (videoOutputWidth * videoOutputHeight > (CheckWidth * CheckHeight)) {
      if (confirm("当前分辨率过高，切换到200万像素时，录制效果最佳！\r\n点击'确定'，手动切换到1600X1200或相近分辨率后再次尝试\r\n点击'取消'，本次录制继续")) {
        return;
      }
      videoOutputWidth = CheckWidth;
      videoOutputHeight = CheckHeight;
    }

    if (videoCapAssist) {
      plugin().VideoCap_Stop(videoCapAssist);
      plugin().VideoCap_Destroy(videoCapAssist);
    }

    videoCapAssist = plugin().Global_CreatVideoCap();
    if (null == videoCapAssist) {
      alert("创建录像对象失败");
      return;
    }

    //设置水印
    plugin().VideoCap_SetWatermark(videoCapAssist, 1, 0, 0, 1, 220, 0, "深圳新良田科技", RGB(255, 23, 140), "Microsoft YaHei", 72, 50, 0);

    let selMicIdx = -1;
    if (plugin().Global_VideoCapGetAudioDevNum() > 0) //有麦克风
    {
      selMicIdx = 0;
    }

    if (!plugin().VideoCap_PreCap(videoCapAssist, "C:\\eloamPlugin_assist.mp4", selMicIdx, FrameRate, 1, videoOutputWidth, videoOutputHeight)) {
      alert("启动录像失败");
      return;
    }

    if (!plugin().VideoCap_AddVideoSrc(videoCapAssist, VideoAssist)) {
      alert("添加视频源失败");
      return;
    }

    if (!plugin().VideoCap_Start(videoCapAssist)) {
      alert("启动录像失败");
      return;
    }
    alert("已开始录像");
  }
}

function StopAssistRecord() {
  if (plugin().VideoCap_Stop(videoCapAssist)) {
    plugin().VideoCap_Destroy(videoCapAssist);
    videoCapAssist = null;
    alert("录像结束，文件保存于C:\\eloamPlugin_assist.mp4\r\n若录像失败请选择较小的分辨率尝试");
  } else {
    alert("停止录像失败");
  }
}
/******************录像********************/
function GetImgMD5() {
  if (PicPath) {
    let img;
    img = plugin().Global_CreateImageFromFile(PicPath, 0);
    let md5 = plugin().Image_GetMD5(img, 2, 0);
    alert("图像的MD5值为：" + md5);

    plugin().Image_Release(img);
  } else {
    alert("请先拍照！");
  }
}

function Barcode() {
  if (DeviceMain) {
    if (VideoMain) {
      let imgList = plugin().Video_CreateImageList(VideoMain, 0, 0);
      if (imgList) {
        plugin().Global_InitBarcode();

        let len = plugin().ImageList_GetCount(imgList);
        for (let i = 0; i < len; i++) {
          let image = plugin().ImageList_GetImage(imgList, i);

          if (image) {
            let b = plugin().Global_DiscernBarcode(image);
            if (b) {
              if (plugin().Global_GetBarcodeCount() <= 0) {
                alert("识别失败！");
              } else {
                for (let i = 0; i < plugin().Global_GetBarcodeCount(); i++)
                  alert(plugin().Global_GetBarcodeData(i));
              }
            }
          }
        }
        plugin().ImageList_Release(imgList);
        plugin().Global_DeinitBarcode();
      }
    }
  }
}


/******************指纹识别********************/
function InitBiokey() {
  if (!plugin().Global_InitBiokey()) {
    alert("初始化指纹识别失败！");
  }
}

function DInitBiokey() {
  plugin().Global_DeinitBiokey();
}

function GetTemplate() {
  let b = plugin().Global_GetBiokeyTemplate();
  if (b) {
    document.getElementById("BiokeyImg1").src = "";
    document.getElementById("biokey").value = "请按压手指三次完成模板采集！";
  }
}

function StopGetTemplate() {
  let b = plugin().Global_StopGetBiokeyTemplate();
  if (b) {
    document.getElementById("biokey").value = "已停止获取模板";
  }
}

function GetFeature() {
  let b = plugin().Global_GetBiokeyFeature();
  if (b) {
    document.getElementById("BiokeyImg2").src = "";
    document.getElementById("biokey").value = "请按压手指";
  }
}

function StopGetFeature() {
  let b = plugin().Global_StopGetBiokeyFeature();
  if (b) {
    document.getElementById("biokey").value = "已停止获取特征";
  }
}

function BiokeyVerify() {
  let mem1 = plugin().Global_CreateMemoryFromFile("C:\\1.tmp");
  let mem2 = plugin().Global_CreateMemoryFromFile("C:\\2.tmp");
  if (mem1 && mem2) {
    // 比较
    let ret = plugin().Global_BiokeyVerify(mem1, mem2);
    if (ret > 50) {
      document.getElementById("biokey").value = "匹配成功" + ret.toString();
    } else {
      document.getElementById("biokey").value = "匹配失败" + ret.toString();
    }
    plugin().Memory_Release(mem1);
    plugin().Memory_Release(mem2);
  } else {
    alert("请采集完指纹模板和指纹特征后再比对！");
  }
}
/******************二代证阅读器********************/
function StartIDCard() {
  if (plugin().Global_InitIdCard()) {
    if (plugin().Global_DiscernIdCard()) {
      alert("请刷卡！");
      readIDcard = true;
    } else {
      document.getElementById("idcard").value = "启动二代证阅读失败！";
    }
  } else {
    document.getElementById("idcard").value = "初始化二代证阅读器失败！";
  }
}

function StopIDCard() {
  plugin().Global_StopIdCardDiscern();
  plugin().Global_DeinitIdCard();
  readIDcard = false;

  document.getElementById("idcard").value = "已停止！";
}


function ReadIDCard() {
  if (readIDcard) {
    alert("请先停止二代证阅读");
    return;
  }

  if (plugin().Global_InitIdCard()) {
    let ret = plugin().Global_ReadIdCard();
    if (ret) {
      let str = GetTimeString() + "：";

      for (let i = 0; i < 18; i++) {
        str += plugin().Global_GetIdCardData(i + 1);
        str += ";";
      }

      let image = plugin().Global_GetIdCardImage(1); //1表示头像， 2表示正面， 3表示反面 ...
      plugin().Image_Save(image, "C:\\idcard.jpg", 0);
      plugin().Image_Release(image);

      document.getElementById("idcardimg").src = "C:\\idcard.jpg";
      document.getElementById("idcard").value = str;
    } else {
      document.getElementById("idcard").value = "读取二代证失败！";
    }

    plugin().Global_DeinitIdCard();
  } else {
    alert("初始化二代证阅读器失败！");
  }
}
/******************IC卡阅读器********************/
function StartICCard() {
  if (!plugin().Global_InitReader()) {
    alert("初始化IC卡阅读器失败！");
    return;
  }
  if (plugin().Global_ReaderStart()) {
    alert("请刷卡！");
  } else {
    alert("启动IC卡阅读失败！");
  }
}

function StopICCard() {
  plugin().Global_ReaderStop();
  plugin().Global_DeinitReader();
}
/******************磁条卡阅读器********************/
function StartMagCard() {
  if (!plugin().Global_InitMagneticCard()) {
    alert("初始化磁条卡阅读器失败！");
    return;
  }
  if (plugin().Global_MagneticCardReaderStart()) {
    alert("请刷卡！");
  } else {
    alert("启动磁条阅读失败！");
  }
}

function StopMagCard() {
  plugin().Global_MagneticCardReaderStop();
  plugin().Global_DeinitMagneticCard();
}

/******************深圳通卡阅读器********************/
function StartShenZhenTongCard() {
  if (!plugin().Global_InitShenZhenTong()) {
    alert("初始化深圳通卡阅读器失败！");
    return;
  }
  if (plugin().Global_StartShenZhenTongCard()) {
    alert("请刷卡！");
  } else {
    alert("启动深圳通卡阅读失败！");
  }
}

function StopShenZhenTongCard() {
  plugin().Global_StopShenZhenTongCard();
  plugin().Global_DeinitShenZhenTong();
}
/******************人脸识别********************/
function FaceDetect() {
  let image1 = plugin().Global_CreateImageFromFile("C:\\1.jpg", 0);
  let image2 = plugin().Global_CreateImageFromFile("C:\\2.jpg", 0);
  if (image1 && image2) {
    let ret = plugin().DiscernFaceDetect(image1, image2);
    if (ret != -1) {
      ret += 20;
      if (ret > 100) {
        ret = 100;
      }
      let msg = "识别已完成，匹配度：" + ret + "\r\n（匹配阈值为70，高于阈值则为同一人）";
      alert(msg);
    } else {
      alert("识别失败！");
    }
  } else {
    alert("找不到图像！");
    return;
  }

  plugin().Image_Release(image1);
  plugin().Image_Release(image2);
}

function VerifyFaceDetect() {
  if (VideoAssist) {
    let image = plugin().Video_CreateImage(VideoAssist, 0, AssistView().View_GetObject());
    let idcardImage = plugin().Global_CreateImageFromFile("C:\\idcard.jpg", 0);

    if (image && idcardImage) {
      let ret = plugin().DiscernFaceDetect(image, idcardImage);
      if (ret != -1) {
        ret += 20;
        if (ret > 100) {
          ret = 100;
        }
        let msg = "识别已完成，匹配度：" + ret + "\r\n（匹配阈值为70，高于阈值则为同一人）";
        alert(msg);
      } else {
        alert("识别失败！");
      }
    } else {
      alert("获取图像失败，未识别到二代证！");
      return;
    }

    plugin().Image_Release(image);
    plugin().Image_Release(idcardImage);
  }
}

export default {
  plugin,
  MainView,
  AssistView,
  thumb1,
  addEvent,
  OpenVideo,
  CloseVideo,
  CloseVideoMain,
  CloseVideoAssist,
  OpenVideoMain,
  Load,
  Unload
}
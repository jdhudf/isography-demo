export function downloadImages ({ filename, filesize }) {

  var userAgent = window.navigator.userAgent.toLowerCase();


  if(userAgent.indexOf('msie') !== -1 || userAgent.indexOf('trident') !== -1) { // For IE

    //console.log('Internet Explorer');

  } else if(userAgent.indexOf('edge') !== -1) { //For Edge

     svg2imageData(document.getElementById('svg_preview'), function(data) {

       window.navigator.msSaveOrOpenBlob(data, filename + '.png');

     },  function(error) {
            console.log(error);
            alert('failed to convert');
          }, filesize );

  } else {

    svg2imageData(document.getElementById('svg_preview'), function(data) {



        //document.getElementById('converted-image').src = data;
        // Create an invisible A element
        const a = document.createElement("a");
　　　　　a.style.display = "none";
　　　　　document.body.appendChild(a);

　　　　　// Set the HREF to a Blob representation of the data to be downloaded
　　　　　a.href = data;
　　　　　// Use download attribute to set set desired file name
　　　　　a.setAttribute("download", filename);
　　　　　// Trigger the download by simulating click
　　　　　a.click();
　　　　　// Cleanup
        window.URL.revokeObjectURL(a.href);
        document.body.removeChild(a);


    },  function(error) {
            console.log(error);
            alert('failed to convert');
          }, filesize);

  }
}

export function svg2imageData(svgElement, successCallback, errorCallback, filesize) {

  var canvas = document.createElement('canvas'),
      ctx = canvas.getContext('2d'),
      image = new Image();
  var imageURL = canvas.toDataURL();

  canvas.style.display = "none";
  document.body.appendChild(canvas);

  canvas.width = svgElement.width.baseVal.value * filesize;//svgElement.dataset.width;//svgElement.width.baseVal.value;
  canvas.height = svgElement.height.baseVal.value * filesize;//svgElement.dataset.height;//svgElement.height.baseVal.value;


  svgElement.setAttribute("width", svgElement.width.baseVal.value)
  svgElement.setAttribute("height", svgElement.height.baseVal.value)

  var svgData = new XMLSerializer().serializeToString(svgElement);

  image.src = 'data:image/svg+xml;charset=utf-8;base64,' + btoa(unescape(encodeURIComponent(svgData)));

  image.width = svgElement.width.baseVal.value * filesize;
  image.height =  svgElement.height.baseVal.value * filesize;


  if( navigator.userAgent.match(/(iPhone|iPod|Android.*Mobile)/i) ){
    // スマホ（iPhone・Androidスマホ）の場合の処理を記述
    image.onload = function(){
      ctx.drawImage(image, 0, 0, image.width, image.height);
      successCallback(canvas.toDataURL());
    };
    image.onerror = function(e){
      errorCallback(e);
    };

  } else {
    // PC・タブレットの場合の処理を記述

    if (canvas.toBlob) {

      image.onload = function(){


        ctx.drawImage(image, 0, 0, image.width, image.height);

        canvas.toBlob(function (blob) {

          imageURL = window.URL.createObjectURL(blob);
          successCallback(imageURL);

        });


      };

      image.onerror = function(e){
        errorCallback(e);
      };

    } else if (canvas.msToBlob) {

      var userAgent = window.navigator.userAgent.toLowerCase();

      if(userAgent.indexOf('msie') !== -1 || userAgent.indexOf('trident') !== -1) {
        //console.log('Internet Explorer');

        image.onload = function(){
        }

      } else {
        //console.log('edge');

        image.onload = function(){

          // I don't know why, but twice code of drawImage() & msToBlob() works well.

          ctx.drawImage(image, 0, 0, image.width, image.height);

          var blob = canvas.msToBlob();

          ctx.drawImage(image, 0, 0, image.width, image.height);

          //var blob = canvas.msToBlob();

          var imageURL = canvas.toDataURL();
          document.getElementById('converted-image').src = imageURL;

          successCallback(blob);

        };

        image.onerror = function(e){
          errorCallback(e);
        };

      }



    } else {

      image.onload = function(){
        ctx.drawImage(image, 0, 0, image.width, image.height);
        successCallback(canvas.toDataURL());
      };
      image.onerror = function(e){
        errorCallback(e);
        console.log(e)
      };

    }


  }


}

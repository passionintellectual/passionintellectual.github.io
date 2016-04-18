(function(scope) {
  HTMLImports.whenReady(function () {

    Polymer({
      is: "image-gallery",
      properties: {
        current: {
          type: Number,
          value: 0
        },
        data: {
          type: Array,
          value: []
        }
      },
      processData: function(data) {
        var scope = this;
        var dataObj = {
          thumbImgs: [],
          largeImgs: [],
          id: [],
          caption: [],
          caption_position: []
        };
        if(undefined != data) {
          for(var count = 0; count < data.length; count++) {
            dataObj.thumbImgs.push(data[count].thumb_src);
            dataObj.largeImgs.push(data[count].img_src);
            dataObj.id.push(data[count].id);
            dataObj.caption.push(data[count].caption);
            dataObj.caption_position.push(data[count].caption_position);
          }

          var modal = document.querySelectorAll('mm-modal');
          var imgSlider = document.querySelector('div.img-slider');
          this.current = 0;
          var leftSlider = document.querySelectorAll('#slider-panel > div.left');
          var rightSlider = document.querySelectorAll('#slider-panel > div.right');
          leftSlider[0].addEventListener('click', function(ev) {
            scope.slideLeft(ev);
          });
          rightSlider[0].addEventListener('click', function(ev) {
            scope.slideRight(ev);
          });
          for (var img in dataObj.thumbImgs) {
            var imgElement = document.createElement('img');
            imgElement.setAttribute('src', dataObj.thumbImgs[img]);
            imgElement.setAttribute('height', '100');
            imgElement.setAttribute('class', '');
            imgElement.setAttribute('id', dataObj.id[img]);
            if(img == 0) {
              imgElement.setAttribute('class', 'active');
            }

            imgElement.addEventListener('click', function(ev) {
              scope.loadImage(ev, data);
            });
            imgSlider.appendChild(imgElement);
          }

          var imgNode = document.querySelectorAll('mm-modal > img');
          var lblNode = document.querySelectorAll('mm-modal > label');
          imgNode[0].setAttribute('src', dataObj.largeImgs[0]);
          lblNode[0].innerHTML = dataObj.caption[0];
        }
      },

      ready: function() {
        this.processData(this.data);
      },

      loadImage: function(ev, data) {
        var results = [];
        for(var i=0; i < data.length; i++) {
          if(ev.target.id == data[i]["id"]) {
            results.push(data[i]);
          }
        }
        var elems = document.querySelectorAll("img.active");
        [].forEach.call(elems, function(el) {
          el.classList.remove("active");
        });

        var imgsrc = results[0].img_src;
        ev.target.setAttribute('class', 'active');
        var modal = document.querySelectorAll('mm-modal');

        var imgNode = document.querySelectorAll('mm-modal > img');
        var lblNode = document.querySelectorAll('mm-modal > label');
        imgNode[0].setAttribute('src', imgsrc);
        lblNode[0].innerHTML = results[0].caption;
      },


      isOnScreen: function(obj) {
        var win = window;

        var scrollPosition = win.screenTop;
        var visibleArea = win.screenTop + win.innerHeight;
        var objEndPos = (obj.offsetTop + obj.innerHeight);
        return(visibleArea >= objEndPos && scrollPosition <= objEndPos ? true : false);
      },

      slideLeft: function(ev) {
        if(this.current == 0) {
          ev.preventDefault();
          return;
        }
        var leftSlider = '';
        if(!(this.isOnScreen(document.querySelectorAll('div.img-slider > img:first-child')))) {
          var imgDiv = document.querySelectorAll('#imglinks');
          if(undefined != imgDiv[0]) {
            leftSlider = document.querySelectorAll('div.img-slider > img:nth-child('+this.current+')');
            if(undefined != leftSlider[0]) {
              leftSlider[0].className = 'slide_left';
              this.current--;
              this.updateStyles();
            }
          }
        } else {
          ev.preventDefault();
        }
      },
      slideRight: function(ev) {
        if (this.current >= this.data.length - 1) {
          ev.preventDefault();
          return;
        }

        if ((this.isOnScreen(document.querySelectorAll('div.img-slider > img:last-child')))) {

          ev.preventDefault();
        } else {
          var rightSlider = document.querySelectorAll('div.img-slider > img:not(.slide_right)');
          var imgDiv = document.querySelectorAll('#imglinks');
          if (undefined != imgDiv[0]) {
            if (undefined != rightSlider[0]) {
              rightSlider[0].className = 'slide_right';
              this.current++;
              this.updateStyles();
            }
          }
        }
      }
    });
  });
})(window.Strand = window.Strand || {});
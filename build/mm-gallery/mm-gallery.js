(function(scope) {
  HTMLImports.whenReady(function () {

    scope.Gallery = Polymer({
      is: "mm-gallery",
      properties: {
        current: {
          type: Number,
          value: 0
        },
        data: {
          type: Array,
          value: []
        },
        dataObj: {
          type: Array,
          value: []
        }
      },
      _setData: function(data) {
        this.data = data;
      },
      _getData: function() {
        return this.data;
      },
      createDataObj: function(data) {
        var dataObj = {
          thumbImgs: [],
          largeImgs: [],
          id: [],
          caption: [],
          caption_position: []
        };
        if(undefined != data && data.length != 0) {
          for (var count = 0; count < data.length; count++) {
            dataObj.thumbImgs.push(data[count].thumb_src);
            dataObj.largeImgs.push(data[count].img_src);
            dataObj.id.push(data[count].id);
            dataObj.caption.push(data[count].caption);
            dataObj.caption_position.push(data[count].caption_position);
          }
          this.dataObj = dataObj;
          this.processData(this.dataObj);
        }
      },
      processData: function(dataObj) {
        if (undefined != dataObj && dataObj.length != 0) {

          var scope = this;
          var headerElt = document.querySelector('div.header');
          var footerElt = document.querySelector('div.footer');

          var modal = document.querySelectorAll('.img-modal');
          var imgSlider = document.querySelector('div.img-slider');
          this.current = 0;
          var leftSlider = document.querySelectorAll('#slider-panel > div.left');
          var rightSlider = document.querySelectorAll('#slider-panel > div.right');
          leftSlider[0].addEventListener('click', function (ev) {
            scope._slideLeft(ev);
          });
          rightSlider[0].addEventListener('click', function (ev) {
            scope._slideRight(ev);
          });
          for (var img in dataObj.thumbImgs) {
            var imgElement = document.createElement('img');
            imgElement.setAttribute('src', dataObj.thumbImgs[img]);
            imgElement.setAttribute('height', '100');
            imgElement.setAttribute('class', '');
            imgElement.setAttribute('id', dataObj.id[img]);
            if (img == 0) {
              imgElement.setAttribute('class', 'active');
            }

            imgElement.addEventListener('click', function (ev) {
              scope._loadImage(ev, scope.data);
            });
            imgSlider.appendChild(imgElement);
          }

          if(undefined != dataObj.largeImgs[0]) {
            var imgNode = document.querySelectorAll('.img-modal img.img-align');
            imgNode[0].setAttribute('src', dataObj.largeImgs[0]);
          }

          if (undefined != dataObj.caption_position[0]) {
            if (dataObj.caption_position[0] == 'top') {

              headerElt.innerHTML = dataObj.caption[0];
              headerElt.setAttribute('style', 'visibility:visible');
              footerElt.setAttribute('style', 'visibility:hidden');

            } else if (dataObj.caption_position[0] == 'bottom') {

              footerElt.innerHTML = dataObj.caption[0];
              footerElt.setAttribute('style', 'visibility:visible');
              headerElt.setAttribute('style', 'visibility:hidden');
            }
          } else {
            headerElt.innerHTML = " ";
            footerElt.innerHTML = " ";
          }
        }
      },

      ready: function() {
        this.createDataObj(this._getData());
      },

      _deactiveSelection: function() {
        var activeElem = document.querySelectorAll("img.active");
        if(activeElem.length > 0)
          activeElem[0].classList.remove("active");
      },
      _loadImage: function(ev, data) {
        this._deactiveSelection();
        var results = [];
        var headerElt = document.querySelector('div.header');
        var footerElt = document.querySelector('div.footer');
        for(var i=0; i < data.length; i++) {
          if(ev.target.id == data[i]["id"]) {
            results.push(data[i]);
          }
        }

        var imgsrc = results[0].img_src;
        var modal = document.querySelectorAll('.img-modal');

        var imgNode = document.querySelectorAll('.img-modal img.img-align');
        ev.target.setAttribute('class', 'active');
        imgNode[0].setAttribute('src', imgsrc);

        if(undefined != results[0].caption_position) {
          if(results[0].caption_position == 'top') {

            headerElt.innerHTML = results[0].caption;
            headerElt.setAttribute('style', 'visibility:visible');
            footerElt.setAttribute('style', 'visibility:hidden');
          } else if(results[0].caption_position == 'bottom') {

            footerElt.innerHTML = results[0].caption;
            footerElt.setAttribute('style', 'visibility:visible');
            headerElt.setAttribute('style', 'visibility:hidden');
          }
        } else {
          headerElt.innerHTML = " ";
          footerElt.innerHTML = " ";
        }
      },

      _isOnScreen: function(obj, wrapper, direction) {
        var win = window;

        if(direction === 'right') {
          var viewport = wrapper[0].getBoundingClientRect();
          var element = obj[0].getBoundingClientRect();

          if(element.right < viewport.right) {
            return true;
          } else {
            return false;
          }
        }
        if(direction === 'left') {
          var scrollPos = win.screenTop;
          var visibleArea = win.screenTop + win.innerHeight;
          var objEndPos = (obj.offsetTop + obj.innerHeight);
          return(visibleArea >= objEndPos && scrollPos <= objEndPos ? true : false);
        }
      },

      _slideLeft: function(ev) {
        var leftSlider = '';
        var isOnscreen = (this._isOnScreen(document.querySelectorAll('div.img-slider > img:first-child'), document.querySelectorAll('#slider-panel'), 'left'));
        if(this.current == 0 || isOnscreen) {
          ev.preventDefault();
        } else {
          var imgDiv = document.querySelectorAll('#imglinks');
          if(undefined != imgDiv[0]) {
            leftSlider = document.querySelectorAll('div.img-slider > img:nth-child('+this.current+')');
            if(undefined != leftSlider[0]) {
              leftSlider[0].className = 'slide_left';
              this.current--;
              this.updateStyles();
            }
          }
        }
      },
      _slideRight: function(ev) {
        var isOnScreen = (this._isOnScreen(document.querySelectorAll('div.img-slider > img:last-child'), document.querySelectorAll('#slider-panel'), 'right'));
        if(isOnScreen || (this.current >= this.data.length - 1)) {
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
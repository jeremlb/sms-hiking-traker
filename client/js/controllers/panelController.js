var angular = require('angular');

module.exports = [function () {

     var _this = this;

     this.items = [{
          date: '06/08/2016',
          weather: '/static/img/weather/clear-night.png',
          breakType: '/static/img/weather/unknown.png',
          message: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam animi hic earum obcaecati fuga qui ut nobis suscipit magni asperiores magnam iste corporis minima doloribus, tempora fugiat, pariatur repellat! Soluta.',
          photos: [{url: '/static/img/tmp/1.jpg'}],
          videos: [{url: 'https://video.twimg.com/ext_tw_video/761828795003375617/pu/vid/180x320/u8R217RCXCPq_AKY.mp4'}]
     }];

     this.isDetailShown = false;
     this.detailItem = {};

     this.showDetail = function (item) {
          _this.isDetailShown = true;
          _this.detailItem = item;
     };

     this.hideDetail = function () {
          _this.isDetailShown = false;
     };
}];

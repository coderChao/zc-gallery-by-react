require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

//获取图片相关的数据
let imageDatas = require('../data/imageDatas.json');
//利用自执行函数，将图片名信息，转换为图片路径信息
imageDatas = (function generatorsImageUrl(imageDataArray){
     for(var i=0;i<imageDataArray.length;i++)
     {
         var singleImageData = imageDataArray[i];
         singleImageData.imageUrl = require('../images/' + singleImageData.fileName);
         imageDataArray[i] = singleImageData;
     }
     return imageDataArray;
})(imageDatas);


class AppComponent extends React.Component {
  render() {
    return (
        <section className="stage">
            <section className="image-sec">
            </section>
            <nav className="controller-nav">
            </nav>
        </section>
    );
  }
}

AppComponent.defaultProps = {
};


export default AppComponent;

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


class ImgFigure extends React.Component{
   render(){
     return (
         //figure标签通常用来表示自包含的单个单元内容，自包含：单独拿出来，放在哪里它也是有意义的 figcaption用来定义标题
        <figure className="img-figure">
           <img src={this.props.data.imageUrl} alt={this.props.data.title}/>
           <figcaption className="img-title">
               <h2>{this.props.data.desc}</h2>
           </figcaption>
        </figure>
     );
    }
}

class AppComponent extends React.Component {
  render()
    {
        let controllerUnits = [];
        let imgFigures = [];
        for (var i = 0; i < imageDatas.length; i++)
        {
            var value = imageDatas[i];
            imgFigures.push(<ImgFigure data={value} />);
        }
    return (
        <section className="stage">
            <section className="image-sec">
             {imgFigures}
            </section>
            <nav className="controller-nav">
             {controllerUnits}
            </nav>
        </section>
    );
  }
}


AppComponent.defaultProps = {
};


export default AppComponent;

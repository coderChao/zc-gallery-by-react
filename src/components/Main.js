require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

//获取图片相关的数据
let imageDatas = require('../data/imageDatas.json');
//利用自执行函数，将图片名信息，转换为图片路径信息
imageDatas = (function generatorsImageUrl(imageDataArray){
     for(let i=0;i<imageDataArray.length;i++)
     {
         let singleImageData = imageDataArray[i];
         singleImageData.imageUrl = require('../images/' + singleImageData.fileName);
         imageDataArray[i] = singleImageData;
     }
     return imageDataArray;
})(imageDatas);

//获取区间内的一个随机值
function getRangeRandom(low,high)
{
    return Math.ceil(Math.random() * (high - low) + low);
}

//获取0-30度之间的任意正负值
function get30DegRandom()
{
    return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));
}


class ImgFigure extends React.Component{
   handleClick(e){

      if(this.props.arrange.isCenter)
      {
          this.props.inverse();
      }
      else
      {
          this.props.center();
      }
      e.stopPropagation();
      e.preventDefault();
   }
   render(){
     var styleObj = {};
     //如果props属性中指定这张图片的位置，则使用
     if(this.props.arrange.pos)
     {
        styleObj = this.props.arrange.pos;
     }

     //如果图片的旋转角度有值并且不为0，添加旋转角度
     if(this.props.arrange.rotate)
     {
         (['MozTransform','msTransform','WebkitTransform','transform']).forEach((value,index) => {

             styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';

         });

     }
     if(this.props.arrange.isCenter)
     {
         styleObj.zIndex = 11;
     }
     var imgFigureClassName = "img-figure";
         imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';
     return (
         //figure标签通常用来表示自包含的单个单元内容，自包含：单独拿出来，放在哪里它也是有意义的 figcaption用来定义标题
        <figure className={imgFigureClassName}  style={styleObj} onClick={this.handleClick.bind(this)}>
           <img src={this.props.data.imageUrl} alt={this.props.data.title}/>
           <figcaption className="img-title">
               <h2>{this.props.data.title}</h2>
               <div className="img-back"  onClick={this.handleClick.bind(this)}>
                  <p>{this.props.data.desc}</p>
               </div>
           </figcaption>
        </figure>
     );
    }
}

//控制组件
class ControllerUnit extends React.Component{
  handleClick(e){

      //如果点击的是当前正在选中态的按钮，则翻转图片，否则将对应的图片居中
      if(this.props.arrange.isCenter)
      {
          this.props.inverse();
      }
      else{
          this.props.center();
      }
      e.stopPropagation();
      e.preventDefault();
  }
  render(){
      var controllerUnitClassName = "controller-unit";
      //如果对应的是居中的图片，显示居中按钮的居中态
      if(this.props.arrange.isCenter)
      {
          controllerUnitClassName += ' is-center';

          //如果同时对应的是翻转图片，显示控制按钮的翻转态
          if(this.props.arrange.isInverse)
          {
             controllerUnitClassName += 'is-inverse';
          }
      }


      return (
           <span className={controllerUnitClassName} onClick={this.handleClick.bind(this)}></span>
        );
  }
}

class AppComponent extends React.Component {
  constructor(props){
      super(props);
      this.state = ({
          imgsArrangeArr: [
              // {
              //    pos:{
              //       left: 0,
              //       top: 0
              //    },
              //    rotate: 0 //旋转角度
              //    isInverse : false; 图片正反面
              //    isCenter : false;  是否是中心图片
              // }
          ]
      });
      this.Constant = ({
           CenterPos : {
              left: 0,
              top: 0
           },
           hPosRange : {  //水平方向的取值范围
              leftSecX: [0,0],
              rightSecX: [0,0],
              y: [0,0]
           },
           vPosRange : {  //垂直方向的取值范围
              x: [0,0],
              topY: [0,0],

           }
      });
  }
  //组件加载后，为每张图片计算其位置的范围
  componentDidMount(){
     //首先，通过refs属性拿到舞台的大小
     let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
     //scrollWidth：对象的实际内容的宽度，不包边线宽度，会随对象中内容超过可视区后而变大。
     //clientWidth：对象内容的可视区的宽度，不包滚动条等边线，会随对象显示大小的变化而改变。
     //offsetWidth：对象整体的实际宽度，包滚动条等边线，会随对象显示大小的变化而改变
         stageW = stageDOM.scrollWidth,
         stageH = stageDOM.scrollHeight,
         halfStageW = Math.ceil(stageW / 2),
         halfStageH = Math.ceil(stageH / 2);

     //拿到一个imFigure的大小
     let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
         imgW = imgFigureDOM.scrollWidth,
         imgH = imgFigureDOM.scrollHeight,
         halfImgW = Math.ceil(imgW / 2),
         halfImgH = Math.ceil(imgH / 2);
      //计算中心图片的位置点
      this.Constant.CenterPos.left = halfStageW - halfImgW;
      this.Constant.CenterPos.top = halfStageH - halfImgH;

      //计算左侧，右侧区域图片排布位置的取值范围
      this.Constant.hPosRange.leftSecX[0] = 0 - halfImgW;
      this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
      this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
      this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
      this.Constant.hPosRange.y[0] = 0 - halfImgH;
      this.Constant.hPosRange.y[1] = stageH - halfImgH;

      //计算上侧区域图片排布范围的取值范围
      this.Constant.vPosRange.topY[0] = 0 - halfImgW;
      this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
      this.Constant.vPosRange.x[0] = halfStageW - imgW;
      this.Constant.vPosRange.x[1] = halfStageW;

      //指定初始时第一张的位置居中
      this.rearrange(0);
  }
  /*
    翻转图片
    @params: index 输入当前被执行inverse操作的图片对应的图片信息数组index值
    @return：{Function}  这是一个闭包函数，其内return一个真正待被执行的函数
    闭包：能够读取其他函数内部变量的函数，定义在一个函数内部的函数  本质上是将函数外部和函数内部连接起来的一座桥梁
  */
  inverse(index){
     return () => {
        let imgArr = this.state.imgsArrangeArr;
        imgArr[index].isInverse = !imgArr[index].isInverse;
        this.setState({
           imgsArrangeArr : imgArr
        });
     };
  }

  /*
   利用rearrange函数，居中对应index的图片
   @prarms index：需要居中对应的图片的index
   @return {Function}
  */
  center(index){
     return () => {
        this.rearrange(index);
     };
  }
  /*
   重新布局所有图片
  */
  rearrange(centerIndex){
      let imgsArrangeArr = this.state.imgsArrangeArr;
      let Constant = this.Constant;
      let centerPos = Constant.CenterPos;
      let hPosRange = Constant.hPosRange;
      let vPosRange = Constant.vPosRange;
      let hPosRangeLeftSecX = Constant.hPosRange.leftSecX;
      let hPosRangeRightSecX = Constant.hPosRange.rightSecX;
      let hPosRangeY = hPosRange.y;
      let vPosRangeTopY = vPosRange.topY;
      let vPosRangeX = vPosRange.x;

      let imgsArrangeTopArr = [];
      let topImgNum = Math.floor(Math.random() * 2)   //取一个或者不取
      let topImgSpliceIndex = 0;

      let imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);

      //首先居中centerIndex的图片,居中的 centerIndex 的图片不需要旋转
      imgsArrangeCenterArr[0]  =
         {
             pos : centerPos,
             rotate : 0,
             isCenter : true,
             isInverse : false
         }


      //取出要布局上侧的图片的状态信息
      topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
      imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

      //布局位于上侧的图片
      imgsArrangeTopArr.forEach((value,index) => {
          imgsArrangeTopArr[index] = {
             pos:{
                  top: getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
                  left: getRangeRandom(vPosRangeX[0],vPosRangeX[1])
             },
             rotate: get30DegRandom(),
             isCenter : false,
             isInverse : false
          }
      });

      let k = imgsArrangeArr.length / 2;
      //布局左右两侧的图片
      for(let i = 0; i < imgsArrangeArr.length; i++)
      {
           let hPosRangeLORX = null;
           //前半部分布局左边，右半部份布局右边
           if(i < k){
               hPosRangeLORX = hPosRangeLeftSecX;
           }
           else{
               hPosRangeLORX = hPosRangeRightSecX;
           }
           imgsArrangeArr[i] = {
               pos:{
                  top : getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
                  left : getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
               },
               rotate: get30DegRandom(),
               isCenter : false,
               isInverse : false
           }
      }

      if(imgsArrangeTopArr && imgsArrangeTopArr[0])
      {
         imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
      }
      imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);

      this.setState({
         imgsArrangeArr : imgsArrangeArr
      });
  }
  render()
    {
        let controllerUnits = [];
        let imgFigures = [];
        // for (var i = 0; i < imageDatas.length; i++)
        // {
        //     var value = imageDatas[i];
        //     imgFigures.push(<ImgFigure data={value}  ref={'imgFigure' + i}/>);
        // }
        imageDatas.forEach(function(value,index) {
            if(!this.state.imgsArrangeArr[index])
            {
                this.state.imgsArrangeArr[index] = {
                    pos:{
                        left : 0,
                        top : 0
                    },
                    rotate : 0,
                    isInverse : false,
                    isCenter :false
                }
            }
            imgFigures.push(<ImgFigure data={value}  ref={'imgFigure' + index}  arrange={this.state.imgsArrangeArr[index]}
              inverse={this.inverse(index)}  center={this.center(index)} />);
            controllerUnits.push(<ControllerUnit arrange={this.state.imgsArrangeArr[index]}  inverse={this.inverse(index)} center={this.center(index)}/>)
        }.bind(this));
    return (
        <section className="stage" ref="stage">
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

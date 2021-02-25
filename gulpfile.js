const {src,dest,parallel,series}=require('gulp')
const del=require('del')
const sass=require('gulp-sass')
const babel=require('gulp-babel')
const swig=require('gulp-swig')
const userefPlugin=require('gulp-useref')
const gulpIf=require('gulp-if')
const htmlMin=require('gulp-htmlmin')
const uglify=require('gulp-uglify')
const cleanCss=require('gulp-clean-css')
const style=()=>{
  //转换的时候基准路径
  return src('src/assets/styles/*.scss',{base:"src"})
         .pipe(sass())
        .pipe(dest('dist'))
}
const clean=()=>{
  return del(['dist'])
}
// 脚本编译
const script=()=>{
  return src('src/assets/scripts/*.js',{base:'src'})
         .pipe(babel({presets:['@babel/preset-env']}))
        .pipe(dest('dist'))
}
const page=()=>{
  return src('src/**/*.html',{base:'src'})
  .pipe(swig())
  .pipe(dest('dist'))
}
const useref=()=>{
  // 处理dist文件
  return src('dist/*.html',{base:''})
      //useref执行之前要执行compile
  //处理文件中的注释，并对文件中的引用文件做处理
   .pipe(userefPlugin({searchPath:['dist','.']}))
   //压缩：三种文件类型gulp-htmlmin gulp-uglify gulp-clean-css
    //判断文件类型gulp-if
    //js的压缩
    .pipe(gulpIf(/\.js$/,uglify()))
    //css压缩
    .pipe(gulpIf(/\.css$/,cleanCss()))
    //html的压缩collapseWhitespace：折叠空白字符,minifyCSS：压缩内部的css，minifyJS压缩js文件
    .pipe(gulpIf(/\.html$/,htmlMin({collapseWhitespace:true,minifyCSS:true,minifyJS:true})))
    //如果读写都是一个文件夹容易造成读写冲突，所以一般不同的目录
   .pipe(dest('dist'))
}
// 创建一个组合任务
const compile=parallel(style,script,page)
const build=series(clean,compile)
module.exports={
  build,
  useref
}

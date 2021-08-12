#!/usr/bin/env node

let fs = require('fs');
let prodConfig =  require("./src/productionConfig"); 

let textColor = (prodConfig.text || {}).color || {};
let title = prodConfig.title || '',
    theme_color = prodConfig.themeColor || '#3264fd';
    text_color_first = textColor.first || '#171D44',
    text_color_second = textColor.second || '#787C99',
    text_color_third = textColor.third || '#C0C4CC',
    text_color_fourth = textColor.fourth || 'rgba(255,255,255,0.5)',
    text_color_link = textColor.link || '#3264fd',
    button_color_common = ((prodConfig.button || {}).color || {}).common || 'white',
    button_bgColor_common = ((prodConfig.button || {}).bgColor || {}).common || '#3264FD';
    background_color_common = prodConfig.background || '#F8F8F8';

replaceEnv([
        "./public/index.html",
        "./src/style/productization.scss",
    ],
    {
        title : title,
        theme_color:theme_color,
        text_color_first : text_color_first,
        text_color_second : text_color_second,
        text_color_third : text_color_third,
        text_color_fourth : text_color_fourth,
        text_color_link : text_color_link,
        button_color_common : button_color_common,
        button_bgColor_common : button_bgColor_common,
        background_color_common : background_color_common,
    }
);


function replaceEnv(files, params) {
    files.forEach(function(file,index){
        let result = fs.readFileSync(file).toString();
        for (let key in params) {
            let r = "\\${"+key+"}";
            result = result.replace(new RegExp(r,"g"), params[key]);
        }
        fs.writeFileSync(file, result)
    });
}
'use strict';
const fetch = require('node-fetch');
const {
  JSDOM
} = require("jsdom");

fetch(`https://www.zhihu.com/search?type=content&q=${encodeURIComponent(process.argv[2])}`)
  .then(response => response.text())
  .then(data => {
    data = data.replace(/\<script id="js-initialData" type="text\/json"\>(\w|\W)+<\/script>/,"")
    data = data.replace(/\<head\>(\w|\W)+<\/head>/,"")
    const {
      document
    } = (new JSDOM(data)).window;
    
    

    data = [...document.querySelectorAll('.ContentItem.AnswerItem')].map(e => ({
      title: e.querySelector('a').textContent,
      href: e.querySelector('a').href,
      description: e.querySelector('.RichText').textContent
    })).map(item => ({
      title: `${item.title}`,
      subtitle: item.description,
      arg: "https://www.zhihu.com" + item.href,
      text: {
        copy: item.href,
        largetype: item.description
      },
    }));
    let items = {
      items: data
    }
    console.log(JSON.stringify(items));
  })
  .catch(error => {
    console.log(JSON.stringify({
      items: [{
        title: error.name,
        subtitle: error.message,
        valid: false,
        text: {
          copy: error.stack
        }
      }]
    }));
  });

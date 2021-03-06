const {Button,TextInput,TextView,ImageView,Composite,TabFolder,Tab,AlertDialog,ActivityIndicator,ui} = require('tabris')

let tabComposite = new Composite({
  top: 0, height: 90, left: 0, right: 0,
  background: 'rgba(0,120,180,0.8)'
}).appendTo(ui.contentView)

new ImageView({
  top: 10, left: 20,
  image: {src: '/images/fleep.png', scale: 2.5}
}).appendTo(tabComposite)

let tabFolder = new TabFolder({
  top: 42, bottom: 0, left: 0, right: 0, 
  tabBarLocation: 'top', tabMode: 'fixed', paging: true, textColor: 'white' 
}).appendTo(ui.contentView)

let settings = new Tab({
  title: 'SETTINGS'
}).appendTo(tabFolder)

let help = new Tab({
  title: 'HELP'
}).appendTo(tabFolder)

let setComposite = new Composite({
  top: 'prev() 10', bottom: 0, left: 0, right: 0  
}).appendTo(settings)

new TextView({
  top: 0, left:10, 
  text: 'WiFi ssid',
  textColor: 'gray', font: '16px'
}).appendTo(setComposite)

let ssid = new TextInput({  
  top: 10, left:10, right: 10, 
  text: localStorage.getItem('ssid'), alignment: 'left', 
  borderColor: 'rgba(0,120,180,0.8)'
}).on('textChanged', event => {
  localStorage.setItem('ssid', event.target.text)    
}).appendTo(setComposite)

new TextView({
  top: 50, left:10,  
  text: 'WiFi password',
  textColor: 'gray', font: '16px'
}).appendTo(setComposite)

let password = new TextInput({  
  top: 60, left:10, right: 10,
  text: localStorage.getItem('password'), alignment: 'left',    
  borderColor: 'rgba(0,120,180,0.8)'
}).on('textChanged', event => {
  localStorage.setItem('password', event.target.text)    
}).appendTo(setComposite)

new TextView({
  top: 100, left:10,
  text: 'Fleep webhook link',
  textColor: 'gray', font: '16px'
}).appendTo(setComposite)

let fleep = new TextInput({  
  top: 110, left:10, right: 10,
  text: localStorage.getItem('fleep'), alignment: 'left',   
  borderColor: 'rgba(0,120,180,0.8)'
}).on('textChanged', event => {
  localStorage.setItem('fleep', event.target.text)    
}).appendTo(setComposite)

new TextView({
  top: 150, left:10,
  text: 'Place',
  textColor: 'gray', font: '16px'
}).appendTo(setComposite)

let place = new TextInput({  
  top: 160, left:10, right: 10,
  text: localStorage.getItem('place'), alignment: 'left',  
  borderColor: 'rgba(0,120,180,0.8)'
}).on('textChanged', event => {
  localStorage.setItem('place', event.target.text)    
}).appendTo(setComposite)

new TextView({
  top: 200, left:10,
  text: 'Button',
  textColor: 'gray', font: '16px'
}).appendTo(setComposite)

let button = new TextInput({  
  top: 210, left:10, right: 10,
  text: localStorage.getItem('button'), alignment: 'left',  
  borderColor: 'rgba(0,120,180,0.8)'
}).on('textChanged', event => {
  localStorage.setItem('button', event.target.text)    
}).appendTo(setComposite)

function clear() {
  localStorage.clear() 
}

function download() {
  act.visible = true
  setComposite.enabled = false  
  let raceTimeout = function(ms){
    let timeout = new Promise((resolve, reject) => {
      let id = setTimeout(() => {
        clearTimeout(id)
        reject()
      }, ms)
    })
    return Promise.race([
      fetch('http://192.168.4.1/configs', {
        method: 'GET'    
      }),
      timeout
    ])
  }  
  let result = raceTimeout(5000)
  result.then(res => res.json())    
  .then(response => {      
    ssid.text = response.ssid
    password.text = response.password
    fleep.text = response.fleep
    place.text = response.place
    button.text = response.button     
    act.visible = false
    setComposite.enabled = true    
    new AlertDialog({
      title: 'Download',
      message: 'Configuration downloaded !',
      buttons: {ok: 'OK'}
    }).open() 
  })
  result.catch(error => {
    act.visible = false
    setComposite.enabled = true    
    new AlertDialog({
      title: 'Download',
      message: 'Can not connect to Button !',
      buttons: {ok: 'OK'}
    }).open() 
  })
}

function upload() {
  act.visible = true
  setComposite.enabled = false   
  let sendConfigs = {}
  sendConfigs.ssid = localStorage.getItem('ssid')
  sendConfigs.password = localStorage.getItem('password')
  sendConfigs.fleep = localStorage.getItem('fleep')
  sendConfigs.place = localStorage.getItem('place')
  sendConfigs.button = localStorage.getItem('button')  
  let raceTimeout = function(ms){
    let timeout = new Promise((resolve, reject) => {
      let id = setTimeout(() => {
        clearTimeout(id)
        reject()
      }, ms)
    })
    return Promise.race([
      fetch('http://192.168.4.1/configs', {
        method: 'POST',
        body: JSON.stringify(sendConfigs),
        headers:{'Content-Type': 'application/json'}
      }),
      timeout
    ])
  }  
  let result = raceTimeout(5000)
  result.then(res => res.json())    
  .then(response => {    
    act.visible = false
    setComposite.enabled = true    
    new AlertDialog({
      title: 'Upload',
      message: 'Configuration uploaded !',
      buttons: {ok: 'OK'}
    }).open() 
  })
  result.catch(error => {
    act.visible = false
    setComposite.enabled = true     
    new AlertDialog({
      title: 'Upload',
      message: 'Can not connect to Button !',
      buttons: {ok: 'OK'}
    }).open() 
  }) 
}

new Button({  
  top: 265, left: 10, width: 110,
  text: 'CLEAR', textColor: 'white', background: 'rgba(0,120,180,0.8)'
}).on('select', () => clear())
.appendTo(setComposite)

new Button({  
  top: 265, centerX: 0, width: 110,
  text: 'DOWNLOAD', textColor: 'white', background: 'rgba(0,120,180,0.8)'
}).on('select', () => download())
.appendTo(setComposite)

new Button({  
  top: 265, right: 10, width: 110,
  text: 'UPLOAD', textColor: 'white', background: 'rgba(0,120,180,0.8)'
}).on('select', () => upload())
.appendTo(setComposite)

let act = new ActivityIndicator({
  centerX: 0, centerY: 0,
  visible: false 
}).appendTo(ui.contentView)
///////////////////////////////////////////////////
new Button({  
  top: 450, centerX: 0, width: 200,
  text: 'TEST'
}).on('select', event => {
  act.visible = true
  setComposite.enabled = false
  let sendConfigs = {'test':'true'}
  let raceTimeout = function(ms){
    let timeout = new Promise((resolve, reject) => {
      let id = setTimeout(() => {
        clearTimeout(id)
        reject()
      }, ms)
    })
    return Promise.race([
      fetch('http://192.168.4.1/configs', {
        method: 'POST',
        body: JSON.stringify(sendConfigs),
        headers:{'Content-Type': 'application/json'}
      }),
      timeout
    ])
  }  
  let result = raceTimeout(5000)
  result.then(res => res.json())    
  .then(response => {
    act.visible = false
    setComposite.enabled = true    
    new AlertDialog({
      title: 'Test',
      message: 'Test request sent !',
      buttons: {ok: 'OK'}
    }).open() 
  })
  result.catch(error => {
    act.visible = false
    setComposite.enabled = true    
    new AlertDialog({
      title: 'Test',
      message: 'Can not connect to Button !',
      buttons: {ok: 'OK'}
    }).open()    
  })
}).appendTo(setComposite)
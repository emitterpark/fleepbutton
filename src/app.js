const {Button,TextInput,TextView,Composite,AlertDialog,ActivityIndicator,ui} = require('tabris')

ui.statusBar.background = 'black'
ui.contentView.background = 'black'

let composite = new Composite({
  top:0, bottom: 0, left: 0, right: 0,
  background: 'black'
}).appendTo(ui.contentView)

new TextView({
  top: 35, left:10, 
  text: 'WiFi ssid',
  textColor: 'gray', font: '16px'
}).appendTo(composite)

let ssid = new TextInput({  
  top: 45, left:10, right: 10, 
  text: localStorage.getItem('ssid'), 
  font: '20px',
  borderColor: 'gray'
}).on('textChanged', event => {
  localStorage.setItem('ssid', event.target.text)    
}).appendTo(composite)

new TextView({
  top: 95, left:10,  
  text: 'WiFi password',
  textColor: 'gray', font: '16px'
}).appendTo(composite)

let password = new TextInput({  
  top: 105, left:10, right: 10,
  text: localStorage.getItem('password'),  
  font: '20px',
  borderColor: 'gray'
}).on('textChanged', event => {
  localStorage.setItem('password', event.target.text)    
}).appendTo(composite)

new TextView({
  top: 155, left:10,
  text: 'Fleep webhook link',
  textColor: 'gray', font: '16px'
}).appendTo(composite)

let fleep = new TextInput({  
  top: 165, left:10, right: 10,
  text: localStorage.getItem('fleep'), 
  font: '20px',
  borderColor: 'gray'
}).on('textChanged', event => {
  localStorage.setItem('fleep', event.target.text)    
}).appendTo(composite)

new TextView({
  top: 215, left:10,
  text: 'Place',
  textColor: 'gray', font: '16px'
}).appendTo(composite)

let place = new TextInput({  
  top: 225, left:10, right: 10,
  text: localStorage.getItem('place'), 
  font: '20px',
  borderColor: 'gray'
}).on('textChanged', event => {
  localStorage.setItem('place', event.target.text)    
}).appendTo(composite)

new TextView({
  top: 275, left:10,
  text: 'Button',
  textColor: 'gray', font: '16px'
}).appendTo(composite)

let button = new TextInput({  
  top: 285, left:10, right: 10,
  text: localStorage.getItem('button'),  
  font: '20px',
  borderColor: 'gray'
}).on('textChanged', event => {
  localStorage.setItem('button', event.target.text)    
}).appendTo(composite)

new Button({  
  top: 350, left: 8, width: 80,
  text: 'CLEAR'
}).on('select', event => {    
  localStorage.clear()    
}).appendTo(composite)

new Button({  
  top: 350, left: 'prev()', width: 105,
  text: 'DOWNLOAD'
}).on('select', event => {
  act.visible = true
  composite.enabled = false
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
    composite.enabled = true 
    new AlertDialog({
      title: 'Download',
      message: 'Configuration downloaded !',
      buttons: {ok: 'OK'}
    }).open() 
  })
  result.catch(error => {
    act.visible = false
    composite.enabled = true 
    new AlertDialog({
      title: 'Download',
      message: 'Can not connect to Button !',
      buttons: {ok: 'OK'}
    }).open() 
  })
}).appendTo(composite)

new Button({  
  top: 350, left: 'prev()', width: 80,
  text: 'UPLOAD'
}).on('select', event => { 
  act.visible = true
  composite.enabled = false 
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
    composite.enabled = true
    new AlertDialog({
      title: 'Upload',
      message: 'Configuration uploaded !',
      buttons: {ok: 'OK'}
    }).open() 
  })
  result.catch(error => {
    act.visible = false
    composite.enabled = true 
    new AlertDialog({
      title: 'Upload',
      message: 'Can not connect to Button !',
      buttons: {ok: 'OK'}
    }).open() 
  })
}).appendTo(composite)

new Button({  
  top: 350, left: 'prev()', width: 80,
  text: 'TEST'
}).on('select', event => {
  act.visible = true
  composite.set('enabled', false)
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
    composite.enabled = true 
    new AlertDialog({
      title: 'Test',
      message: 'Test request sent !',
      buttons: {ok: 'OK'}
    }).open() 
  })
  result.catch(error => {
    act.visible = false
    composite.enabled = true 
    new AlertDialog({
      title: 'Test',
      message: 'Can not connect to Button !',
      buttons: {ok: 'OK'}
    }).open()    
  })
}).appendTo(composite)

let act = new ActivityIndicator({
  centerX: 0, centerY: 0,
  visible: false 
}).appendTo(ui.contentView)
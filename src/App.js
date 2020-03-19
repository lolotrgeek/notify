import React, { useState, useEffect } from 'react';
import './App.css';
import Notification from 'react-web-notification'
import useCounter from './useCounter'


function App(props) {
  const [ignore, setIgnore] = useState(true)
  const [title, setTitle] = useState('')
  const [options, setOptions] = useState({})
  const { count, setCount, start, stop } = useCounter(1000, false)

  function handlePermissionGranted() {
    console.log('Permission Granted');
    setIgnore(false);
  }
  function handlePermissionDenied() {
    console.log('Permission Denied');
    setIgnore(false);

  }
  function handleNotSupported() {
    console.log('Web Notification not Supported');
    setIgnore(true);
  }

  function handleNotificationOnClick(e, tag) {
    console.log(e, 'Notification clicked tag:' + tag);
  }

  function handleNotificationOnError(e, tag) {
    console.log(e, 'Notification error tag:' + tag);
  }

  function handleNotificationOnClose(e, tag) {
    console.log(e, 'Notification closed tag:' + tag);
  }

  function handleNotificationOnShow(e, tag) {
    console.log(e, 'Notification shown tag:' + tag);
  }

  function handleButtonClick() {

    if (ignore) {
      return;
    }
    setCount(0)
    start()
  }

  function createNotification() {
    const now = Date.now();

    const title = 'Timer';
    const body = 'Count: ' + count;
    const tag = 'timer'
    // Available options
    // See https://developer.mozilla.org/en-US/docs/Web/API/Notification/Notification
    const options = {
      tag: tag,
      body: body,
      lang: 'en',
      renotify: true,
      // requireInteraction: true
    }
    setOptions(options)
    setTitle(title)
  }

  useEffect(() => {
    if (count >= 0) {
      createNotification()
    }
    return () => count
  }, [count])

  useEffect(() => {
    console.log(options)
  }, [options])

  return (
    <div className="App">
      <h2>{count}</h2>
      <button onClick={handleButtonClick.bind()}>Start</button>
      <button onClick={() => { stop(); setCount(0) }}>Stop</button>
      <Notification
        ignore={ignore && title !== ''}
        notSupported={handleNotSupported.bind()}
        onPermissionGranted={handlePermissionGranted.bind()}
        onPermissionDenied={handlePermissionDenied.bind()}
        onShow={handleNotificationOnShow.bind()}
        onClick={handleNotificationOnClick.bind()}
        onClose={handleNotificationOnClose.bind()}
        onError={handleNotificationOnError.bind()}
        timeout={1000}
        title={title}
        options={options}
        swRegistration={props.swRegistration}
      />
    </div>
  );
}

export default App;

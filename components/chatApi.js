//chatApi.js
const url = process.env.EXPO_PUBLIC_SOCKET_URL;

export function getMessages(user_id) {
  return fetch(url + '/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id }),
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      return data;
    })
    .catch(error => {
      console.error('Error fetching tasks:', error);
      throw error;
    });
}

export function addAudioOrder(pars, callback) {

  // console.log('addAudioOrder', pars)

  let formData = new FormData();

  formData.append("file", {
    uri: pars.audio,
    type: 'audio/wav', // Изменили тип на 'audio/wav'
    name: 'audio.wav' // Установили имя файла с расширением .wav
});

  formData.append('user_id', 2)
  formData.append('to_id', 1)
  formData.append('text', '')

  fetch(url + '/upload', {
    method: 'POST',
    mode: 'no-cors',
    body: formData
  })
    .then((response) => response.json())
    .then((data) => {
      // console.log('data', data)
      return callback(data)
    });
}

export function addFileMessage(pars, callback) {
  let formData = new FormData();

  formData.append("file", {
    uri: pars.uri,
    type: pars.type,
    name: pars.name
  });

  formData.append('user_id', pars.userId);
  formData.append('to_id', pars.toId);
  formData.append('text', pars.text);

  fetch(url + '/upload', {
    method: 'POST',
    mode: 'no-cors',
    body: formData
  })
    .then((response) => response.json())
    .then((data) => {
      return callback(data);
    })
    .catch((error) => {
      console.error('Error uploading file:', error);
    });
}

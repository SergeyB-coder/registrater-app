// taskApi.js
const url = process.env.EXPO_PUBLIC_SOCKET_URL; // Замените на ваш реальный URL

export function getTasks(user_id) {
  console.log('url', url)
    return fetch(url + '/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id }),
    })
    .then(response => response.json())
    .then(data => {
      // console.log(data);
      return data;
    })
    .catch(error => {
      console.error('Error fetching tasks:', error);
      throw error;
    });
  }

  export function createTask(user_id, text, { timeout, urgency }, callback) {
    fetch(url + '/create-task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id,
        text,
        timeout,
        urgency
      }),
    })
      .then(response => response.json())
      .then(data => {
        callback(data);
      })
      .catch(error => {
        console.error('Error creating task:', error);
      });
  }


  export function updateTask(task_id, text, { timeout, urgency }, callback) {
    fetch(url + '/update-task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: task_id,
        text,
        timeout,
        urgency
      }),
    })
      .then(response => response.json())
      .then(data => {
        callback(data);
      })
      .catch(error => {
        console.error('Error updating task:', error);
      });
  }



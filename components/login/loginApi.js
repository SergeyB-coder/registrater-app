const url = process.env.EXPO_PUBLIC_SOCKET_URL;

export function loginUser(username, password) {
  return fetch(url + '/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: username, password }),
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      return data;
    })
    .catch(error => {
      console.error('Error logging in:', error);
      throw error;
    });
}


export function getUserData(userId) {
  return fetch(url + '/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id: userId }),
  })
    .then(response => response.json())
    .then(data => {
      console.log('getUserData', data);
      return data;
    })
    .catch(error => {
      console.error('Error fetching user data:', error);
      throw error;
    });
}

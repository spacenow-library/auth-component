const SWITCH_USER = 'SWITCH_USER';

// when user sign in / out
function switchUser(user) {
  return {
    type: SWITCH_USER,
    user
  }
}

export { SWITCH_USER }
export { switchUser }

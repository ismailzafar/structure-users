import UserModel from '../models/user'

const userModel = new UserModel()

function canUserEditProfile(props = {}, cb) {

  const result = props.userId == props.profileUserId

  cb(null, result)

}

export default [
  {a: 'user',  can: 'edit profile', when: canUserEditProfile},
  {a: 'admin', can: 'edit profile'},
  {a: 'admin', can: 'edit profiles'},
  {a: 'admin', can: 'create user'},
  {a: 'admin', can: 'edit user'},
  {a: 'admin', can: 'delete user'},
  {a: 'admin', can: 'user'}
]

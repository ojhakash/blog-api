const HttpError = require("http-error-constructor");
const mongoose = require("mongoose");

var { User } = require("../models/users.model");

exports.postUser = async (req, res) => {
  try {
    let user = new User(req.body);
    user = await user.save();
    const token = await user.generateAuthToken();
    res.header("x-auth", token).send(user);
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
};

/**
 * @api {post} /users Add New User
 * @apiName PostUser
 * @apiGroup User
 *
 * @apiParam {String} fistName Users first name.
 * @apiParam {String} lastName Users last name.
 * @apiParam {String} email Users unique email.
 * @apiParam {Number} phoneNumber Users unique phone number.
 * @apiParam {String} passsword Users password.
 *
 * @apiSuccess {String} firstName Firstname of the User.
 * @apiSuccess {String} lastName  Lastname of the User.
 * @apiSuccess {email} email  Email of the User.
 * @apiSuccess {phoneNumber} phoneNumber  phone Number of the User.
 * @apiSuccess {Array} mentors  mentorlist of the User.
 * @apiSuccess {Array} mentees  menteelist of the User.
 * @apiSuccess {Array} rolesOfUser  roles of the User.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "email": "akashojha15@gmail.com",
 *      "rolesOfUser": [],
 *      "phoneNumber": "7687886628",
 *      "firstName": "akash",
 *      "lastName": "ojha",
 *      "mentors": [
 *        "5b14c70795aca1107465f63f"
 *      ],
 *      "mentees": [
 *        "5b14c70795aca1107465f63f"
 *      ],
 *      "_id": "5b14c70795aca1107465f63f"
 *    }
 *
 * @apiError BadRequest User validation failed.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "User validation failed: ..."
 *     }
 */

exports.loginUser = async (req, res) => {
  try {
    let user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    res.header("x-auth", token).send(user);
  } catch (e) {
    res.status(e.status).send(e);
  }
};

/**
 * @api {get} /users/login Request User Login
 * @apiName Login user
 * @apiGroup User
 *
 * @apiParam {String} email Users unique email.
 * @apiParam {String} passsword Users password.
 *
 * @apiSuccess {String} firstName Firstname of the User.
 * @apiSuccess {String} lastName  Lastname of the User.
 * @apiSuccess {email} email  Email of the User.
 * @apiSuccess {phoneNumber} phoneNumber  phone Number of the User.
 * @apiSuccess {Array} mentors  mentorlist of the User.
 * @apiSuccess {Array} mentees  menteelist of the User.
 * @apiSuccess {Array} rolesOfUser  roles of the User.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "email": "akashojha15@gmail.com",
 *      "rolesOfUser": [],
 *      "phoneNumber": "7687886628",
 *      "firstName": "akash",
 *      "lastName": "ojha",
 *      "mentors": [
 *        "5b14c70795aca1107465f63f"
 *      ],
 *      "mentees": [
 *        "5b14c70795aca1107465f63f"
 *      ],
 *      "_id": "5b14c70795aca1107465f63f"
 *    }
 *
 * @apiError Forbidden password does not match.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Forbidden Request
 *     {
 *       "message": "password does not match"
 *     }
 *
 * @apiError Not Found user not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "user not found"
 *     }
 */

exports.addRoleToUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $addToSet: {
          rolesOfUser: { role: req.roleId, experience: req.body.experience }
        }
      },
      { new: true }
    ).exec();
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
};

exports.addMentor = async (req, res) => {
  try {
    // this will check a valid mentorId param is set or not
    if (
      !req.body.mentorId ||
      !mongoose.Types.ObjectId.isValid(req.body.mentorId)
    ) {
      throw new HttpError(400, "A proper mentorId is required !");
    }

    // this will update the mentees list in the user mentor
    const mentor = await User.findOneAndUpdate(
      { _id: req.body.mentorId },
      {
        $addToSet: {
          mentees: req.user._id
        }
      },
      { new: true }
    ).exec();
    //this will throw a error if userid is mentor is not updted for any error
    if (!mentor) {
      throw new HttpError(404, "mentorId is not in exsisitance!");
    }

    // this will update the mentors list in the user mentees
    const user = await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $addToSet: {
          mentors: req.body.mentorId
        }
      },
      { new: true }
    ).exec();

    //this will throw a error if userid is mentee is not updted for any error
    if (!user) {
      throw new HttpError(404, "Give a proper id");
    }

    res.send(user);
  } catch (e) {
    res.status(e.status).send(e);
  }
};

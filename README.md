# BizCards - Server

## Description

In this cards management server you can create users of different types (regular user, business user and admin user) and manage cards.

## Install

1. Download the project.

2. Open new terminal and in the command line write the command:

```
npm i
```

to install all the required libraries.

3. Change the "env.example" file to ".env" and enter the various variables (if needed). Delete the variaables which are not needed.
   Default values for various variables, used in the project, can be found under config->default.json.

4. After all the following instructions, you can write in the command line:

```
npm run dev
```

for development purposes,

or

```
npm run start
```

for production.

## Seeding DB

Under the folder called "scripts" there is a file called "dbSeeder.js". This file seeds the DB of 3 different users (regular, business and admin) and 3 different cards. The 3 cards are connected to the business user.

In order to run this file, write in the command line:

```
npm run seed-db
```

Important information:

- The seeding process empties both collections (users and cards) before inserting the data.
- The seeded data can be changed in file called scripts->dbSeederData.js.
- Users and cards can be added, but all the cards will be connected to the last user un the array. For right functionality, he should be a Business user ("isBusiness": true), but not a admin ("isAdmin": false).

## Usage

In the tables below you will see two different tables.

The first table is "User" Router.

The second table is "Card" Router.

### Users Routes / Users end points

| No. | URL          | method | Authorization                | action                   | notice       | return           |
| --- | ------------ | ------ | ---------------------------- | ------------------------ | ------------ | ---------------- |
| 1.  | /users       | POST   | all                          | register user            | Unique email | The created User |
| 2.  | /users/login | POST   | all                          | login                    | ---          | Encrypt token    |
| 3.  | /users       | GET    | admin                        | Get all users            | ---          | Array of users   |
| 4.  | /users/:id   | GET    | The registered user or admin | Get user                 | ---          | User             |
| 5.  | /users/:id   | PUT    | The registered user          | Edit user                | ---          | User             |
| 6.  | /users/:id   | PATCH  | The registered user          | Change isBusiness status | ---          | User             |
| 7.  | /users/:id   | DELETE | The registered user or admin | Delete user              | ---          | Deleted user     |

### Cards Routes / Cards end points

| No. | URL             | method | Authorization                          | action          | return           |
| --- | --------------- | ------ | -------------------------------------- | --------------- | ---------------- |
| 1.  | /cards          | GET    | all                                    | All cards       | The created card |
| 2.  | /cards/my-cards | GET    | The registered user                    | Get user cards  | Array of card    |
| 3.  | /cards/:id      | GET    | all                                    | Get card        | Card             |
| 4.  | /cards          | POST   | Business user                          | Create new card | Card             |
| 5.  | /cards/:id      | PUT    | The user who created the card          | Edit card       | Card             |
| 6.  | /cards/:id      | PATCH  | A registered user                      | Like card       | Card             |
| 1.  | /cards/:id      | DELETE | The user who created the card or admin | Delete card     | Deleted card     |

## Models

### User Model / Schema

```
{
   name: {
    first: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 255,
    },
    middle: {
      type: String,
      minlength: 0,
      maxlength: 255,
      default: "",
    },
    last: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 255,
    },

    _id: {
      type: mongoose.Types.ObjectId,
      default: new mongoose.Types.ObjectId(),
    },
  },
  phone: {
    type: String,
    required: true,
    minlength: 9,
    maxlength: 10,
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
  },
  image: {
    url: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      minlength: 11,
      maxlength: 1024,
    },
    alt: {
      type: String,
      minlength: 6,
      maxlength: 255,
      default: "User Image",
    },
    _id: {
      type: mongoose.Types.ObjectId,
      default: new mongoose.Types.ObjectId(),
    },
  },
  address: {
    state: {
      type: String,
      minlength: 0,
      maxlength: 255,
      default: "",
    },
    country: {
      type: String,
      minlength: 6,
      maxlength: 255,
      required: true,
    },
    city: {
      type: String,
      minlength: 6,
      maxlength: 255,
      required: true,
    },
    street: {
      type: String,
      minlength: 3,
      maxlength: 255,
      required: true,
    },
    houseNumber: {
      type: String,
      minlength: 1,
      maxlength: 10,
      required: true,
    },
    zip: {
      type: String,
      minlength: 0,
      maxlength: 12,
      default: "",
    },

    _id: {
      type: mongoose.Types.ObjectId,
      default: new mongoose.Types.ObjectId(),
    },
  },
  isBusiness: {
    type: Boolean,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}
```

- Various "\_id" properties are determined automatically.

### Minimum Input Required For User Model

```
{
  "name": {
        "first": "Ayala",
        "last": "Shulman",
  },
  "phone":"0501234567",
  "email":"ayala@ayala.com",
  "password":"123456",
  isBusiness:true,
  address:{
        "country": "London",
        "city": "Manchester",
        "street": "The Hero",
        "houseNumber": "15",
  }
}
```

### Card Model / Schema

```
{
    title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  subtitle: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  description: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 1024,
  },
  phone: {
    type: String,
    required: true,
    minlength: 9,
    maxlength: 10,
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
  },
  web: {
    type: String,
    required: true,
    minlength: 11,
    maxlength: 1024,
  },
  image: {
    url: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      minlength: 11,
      maxlength: 1024,
    },
    alt: {
      type: String,
      minlength: 6,
      maxlength: 255,
      default: "User Image",
    },
    _id: {
      type: mongoose.Types.ObjectId,
      default: new mongoose.Types.ObjectId(),
    },
  },
  address: {
    state: {
      type: String,
      minlength: 0,
      maxlength: 255,
      default: "",
    },
    country: {
      type: String,
      minlength: 6,
      maxlength: 255,
      required: true,
    },
    city: {
      type: String,
      minlength: 6,
      maxlength: 255,
      required: true,
    },
    street: {
      type: String,
      minlength: 3,
      maxlength: 255,
      required: true,
    },
    houseNumber: {
      type: String,
      minlength: 1,
      maxlength: 10,
      required: true,
    },
    zip: {
      type: String,
      minlength: 0,
      maxlength: 12,
      default: "",
    },

    _id: {
      type: mongoose.Types.ObjectId,
      default: new mongoose.Types.ObjectId(),
    },
  },
  bizNumber: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 999_999_999,
    unique: true,
  },
  likes: [
    {
      user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}
```

- "user_id" is entered automatically and references the user who created the card.
- "bizNumber" is created randomaly and automatically. It is a unique number.
- Various "\_id" properties are determined automatically.

### Minimum Input Required For Card Model

```
{
    "title":"Card Title",
    "subtitle":"Card Subtitle",
    "description":"Card Description",
    "phone":"0501234567",
    "email":"CardEmail@CardEmail.com",
    "web":"http://business.web",
    "address":{
        "country": "London",
        "city": "Manchester",
        "street": "The Hero",
        "houseNumber": "15",
  }
}
```

## Additional Feature

Static file are located in the "public" folder, and are served if no previous route was found.

## Libraries

1. "node.js" : main platform.
2. "express": managing routes and requests.
3. "mongoose": connecting to and managing MongoDB database.
4. "joi" : validation.
5. "bcrypt": password encryption.
6. "dotenv": injecting environment variables.
7. "config" : various configuration variables (including environment variables).
8. "jsonwebtoken": creating user token.
9. "cors": for handling cors.
10. "chalk": adding color to your console.
11. "morgan": logging requests to the console.
12. "lodash": for easy functionality.

### Have Fun !

const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Comment = require('./models/comment')

const data = [
  {
    name: "Clouds' Rest",
    image:
      'https://images.unsplash.com/photo-1527856263669-12c3a0af2aa6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
    description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Reprehenderit asperiores odit adipisci ut rerum aut! Numquam placeat velit temporibus sed, amet suscipit. Accusamus quos laborum alias nam? Repudiandae, cum dolore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, fuga optio recusandae officiis quos labore ipsum fugiat non esse, libero consequuntur perferendis eos qui, amet ratione quibusdam consectetur nostrum! Cum, quas? Sint facilis quisquam earum!'
  },
  {
    name: 'Sunny Side Up',
    image:
      'https://images.unsplash.com/photo-1590570253788-6b8a8a144403?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
    description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Reprehenderit asperiores odit adipisci ut rerum aut! Numquam placeat velit temporibus sed, amet suscipit. Accusamus quos laborum alias nam? Repudiandae, cum dolore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, fuga optio recusandae officiis quos labore ipsum fugiat non esse, libero consequuntur perferendis eos qui, amet ratione quibusdam consectetur nostrum! Cum, quas? Sint facilis quisquam earum!'
  },
  {
    name: "Angel's Pool",
    image:
      'https://images.unsplash.com/photo-1542322796450-498d544e2457?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
    description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Reprehenderit asperiores odit adipisci ut rerum aut! Numquam placeat velit temporibus sed, amet suscipit. Accusamus quos laborum alias nam? Repudiandae, cum dolore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, fuga optio recusandae officiis quos labore ipsum fugiat non esse, libero consequuntur perferendis eos qui, amet ratione quibusdam consectetur nostrum! Cum, quas? Sint facilis quisquam earum!'
  },
];

function seedDB() {
  Campground.remove({}, function (err) {
    if (err) {
      console.log(err);
    }
    console.log('campgrounds removed');
    data.forEach((seed) => {
      Campground.create(seed, (err, campground) => {
        if (err) {
          console.log(err);
        } else {
          console.log('added campgrounds');
          // creating comment
          Comment.create(
            {
              text: 'Place is greate, but no wifi',
              author: 'Homer',
            },
            (err, comment) => {
              if (err) {
                console.log(err);
              } else {
                campground.comments.push(comment);
                campground.save();
              }
            }
          );
        }
      });
    });
  });

  //add campground
}

module.exports = seedDB;



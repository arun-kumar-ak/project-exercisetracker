const mongoose = require('mongoose');

async function main() {
  await mongoose.connect("mongodb+srv://arun:arun.ikumar@cluster0.1kj8juo.mongodb.net/excersiceTracker?retryWrites=true&w=majority");//'mongodb://localhost:27017/test');
}
main().then(() => console.log("db connected successfully")).catch(err => console.log(err));
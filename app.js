//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistData", {useNewUrlParser: true});

const itemsSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model("Item", itemsSchema);


const item1 = new Item({
  name: "Welcome to todolist"
});

const item2 = new Item({
  name: "Hit the button to add a new item."
});

const item3 = new Item({
  name: "<-- Hit to delete an item."
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);


app.get("/", function(req, res) {

  Item.find({}, function(err, foundItems){

    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err){
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully savevd default items to DB.");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {listTitle: "Todo", newListItems: foundItems});
    }
  });

});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });
    item.save();
    res.redirect("/");
});

app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;

    Item.findByIdAndRemove(checkedItemId, function(err){
      if (!err) {
        console.log("Successfully deleted checked item.");
        res.redirect("/");
      }else{
        console.log(err)
      }
    });
});

app.post("/update", function(req, res) {
  const checkedItemId = req.body.button;
  const input = req.body.check;
  Item.findByIdAndUpdate({_id: checkedItemId}, {name: input}, function(err, callback) {
    if (err) {
      console.log(err);
    }else {
      console.log(callback);
      res.redirect("/");
    }
  })
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

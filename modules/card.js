const path = require("path");
const fs = require("fs");

const url = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "jsonCard.json"
);

class Card {
  static async add(notebook) {
    const card = await Card.fetch();
    const idx = card.notebooks.findIndex((c) => c.id === notebook.id);
    const idxNotebook = card.notebooks[idx];
    if (idxNotebook) {
      idxNotebook.count++;
      card.notebooks[idx] = idxNotebook;
    } else {
      notebook.count = 1;
      card.notebooks.push(notebook);
    }
    card.prise += +notebook.price;

    return new Promise((resolve, reject) => {
      fs.writeFile(url, JSON.stringify(card), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  static async fetch() {
    return new Promise((resolve, reject) => {
      fs.readFile(url, "utf-8", (err, content) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(content));
        }
      });
    });
  }

  static async remove(id) {
    const card = await Card.fetch();
    const idx = card.notebooks.findIndex((c) => c.id === id);
    const notebook = card.notebooks[idx];
    if (notebook.count === 1) {
      card.notebooks = card.notebooks.filter((c) => c.id !== id);
    } else {
      card.notebooks[idx].count -= 1;
    }
    card.prise -= +notebook.price;

    return new Promise((resolve, reject) => {
      fs.writeFile(url, JSON.stringify(card), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(card);
        }
      });
    });
  }
}

module.exports = Card;

import Dexie from "dexie";

export const db = new Dexie("receiptManagerDB");

db.version(1).stores({
  recipients: "++id, name",
  products: "++id, name, price, qty, unit",
  bills: "++id, customer, date, total, items",
  pending: "++id, customer, balance, date",
});

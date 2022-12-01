import { expect } from "chai";
import { AddOrderMessage } from "../messages/AddOrderMessage";
import { OrderBook } from "./OrderBook";


describe("OrderBook", () => {
  it("getMatches", () => {
    const book = new OrderBook();

    const buyOrder = new AddOrderMessage();
    buyOrder.buy = 'BTC';
    buyOrder.sell = 'USD';
    buyOrder.amountToBuy = 1;
    book.add(buyOrder);

    const sellOrder = new AddOrderMessage();
    sellOrder.buy = 'USD';
    sellOrder.sell = 'BTC';
    sellOrder.amountToBuy = 1;
    book.add(sellOrder);

    const matches = book.getMatches(buyOrder.id);
    expect(matches.length).equal(1);
    const match = matches[0];
    expect(match.id).equal(sellOrder.id);
  });

  it("getMatches no match", () => {
    const book = new OrderBook();

    const buyOrder = new AddOrderMessage();
    buyOrder.buy = 'BTC';
    buyOrder.sell = 'USD';
    buyOrder.amountToBuy = 1;
    book.add(buyOrder);

    const matches = book.getMatches(buyOrder.id);
    expect(matches.length).equal(0);
  });

    it("add and get", () => {
      const order = new AddOrderMessage();
      order.buy = 'BTC';
      order.sell = 'USD';
      order.amountToBuy = 1;

      const book = new OrderBook();
      book.add(order);
      const retrieved = book.get(order.id);
      expect(retrieved?.id).equal(order.id);

    });


    it("get non-existing order", () => {
      const book = new OrderBook();
      const retrieved = book.get('asdf');
      expect(retrieved).to.be.undefined;
    });
});

import { ICard, ICardsData } from '../types';
import { IEvents } from './base/events';

export class CardData implements ICardsData {
	protected _cards: ICard[]

	constructor(protected events: IEvents) {
	}

	set cards(cards: ICard[]) {
		this._cards = cards;
	}

	get cards() {
		return this._cards;
	}

	getCard(cardId: string): ICard {
		return this.cards.find((item) => item.id === cardId);
	}

	getPrice(cardId: string): number {
		return  this.cards.find((item) => item.id === cardId).price;
		
	}
}
